import { Component, OnInit } from '@angular/core';
import { PequenoGrupoMembro } from 'src/app/core/_models/pequeno-grupo-membro.model';
import { MeuPgResponse } from 'src/app/core/_models/pequeno-grupo.model';
import { PequenoGrupoRelatorio } from 'src/app/core/_models/pequeno-grupo-relatorio.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

interface ParticipacaoRelatorio {
  data: Date;
  semanaReferencia: string;
  totalPresentes: number;
  percentual: number;
}

interface FrequenciaMembro {
  nome: string;
  presencas: number;
  totalRelatorios: number;
  percentual: number;
}

@Component({
  selector: 'app-meu-pg',
  templateUrl: './meu-pg.page.html',
  styleUrls: ['./meu-pg.page.scss']
})
export class MeuPgPage implements OnInit {
  dados: MeuPgResponse;
  membros: PequenoGrupoMembro[] = [];
  relatorios: PequenoGrupoRelatorio[] = [];
  totalMembrosAtivos = 0;
  totalRelatoriosEnviados = 0;
  totalRelatoriosPendentes = 0;
  mediaPresenca = 0;
  ultimoRelatorio: PequenoGrupoRelatorio;
  relatorioSemanaPendente = false;
  participacaoRelatorios: ParticipacaoRelatorio[] = [];
  frequenciaMembros: FrequenciaMembro[] = [];

  constructor(private pequenoGrupoService: PequenoGrupoService) { }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.pequenoGrupoService.meuPg().subscribe(res => {
      if (res.success) {
        this.dados = res.dados;
      }
    });

    this.pequenoGrupoService.membros().subscribe(res => {
      if (res.success) {
        this.membros = res.dados || [];
        this.atualizarDashboard();
      }
    });

    this.pequenoGrupoService.relatorios().subscribe(res => {
      if (res.success) {
        this.relatorios = (res.dados || []).map((x: any) => this.normalizarRelatorio(x));
        this.atualizarDashboard();
      }
    });
  }

  ionViewWillEnter() {
    this.carregar();
  }

  totalPresentes(relatorio: PequenoGrupoRelatorio): number {
    return Number(relatorio.quantidadeAtivos || 0) +
      Number(relatorio.quantidadeRotativos || 0) +
      Number(relatorio.quantidadeCriancas || 0) +
      Number(relatorio.quantidadeVisitantes || 0);
  }

  private atualizarDashboard() {
    const membrosAtivos = this.membros.filter(x => x.status === 'A');
    const relatoriosOrdenados = [...this.relatorios].sort((a, b) => this.dataRelatorio(b).getTime() - this.dataRelatorio(a).getTime());
    const relatoriosEnviados = relatoriosOrdenados.filter(x => x.status === 'Enviado');
    const relatoriosComPresenca = relatoriosEnviados.length ? relatoriosEnviados : relatoriosOrdenados;

    this.totalMembrosAtivos = membrosAtivos.length;
    this.totalRelatoriosEnviados = relatoriosEnviados.length;
    this.totalRelatoriosPendentes = relatoriosOrdenados.filter(x => x.status !== 'Enviado').length;
    this.ultimoRelatorio = relatoriosOrdenados[0];
    this.relatorioSemanaPendente = !relatoriosOrdenados.some(x => this.mesmaSemana(this.dataRelatorio(x), new Date()) && x.status === 'Enviado');

    const totalPresencas = relatoriosComPresenca.reduce((total, relatorio) => total + this.totalPresentes(relatorio), 0);
    const baseMedia = relatoriosComPresenca.length * (this.totalMembrosAtivos || 1);
    this.mediaPresenca = relatoriosComPresenca.length && this.totalMembrosAtivos ? Math.round((totalPresencas / baseMedia) * 100) : 0;

    const maximoGrafico = Math.max(...relatoriosComPresenca.slice(0, 6).map(x => this.totalPresentes(x)), 1);
    this.participacaoRelatorios = relatoriosComPresenca.slice(0, 6).reverse().map(relatorio => {
      const totalPresentes = this.totalPresentes(relatorio);

      return {
        data: this.dataRelatorio(relatorio),
        semanaReferencia: relatorio.semanaReferencia,
        totalPresentes,
        percentual: Math.round((totalPresentes / maximoGrafico) * 100)
      };
    });

    this.frequenciaMembros = this.montarFrequenciaMembros(relatoriosComPresenca, membrosAtivos);
  }

  private montarFrequenciaMembros(relatorios: PequenoGrupoRelatorio[], membros: PequenoGrupoMembro[]): FrequenciaMembro[] {
    const relatoriosComPresencas = relatorios.filter(x => x.presencas && x.presencas.length);

    if (!relatoriosComPresencas.length) return [];

    return membros.map(membro => {
      const presencas = relatoriosComPresencas.filter(relatorio =>
        relatorio.presencas.some((presenca: any) =>
          (presenca.pequenoGrupoMembroId || presenca.PequenoGrupoMembroId) === membro.id &&
          (presenca.presente === undefined ? presenca.Presente : presenca.presente))).length;

      return {
        nome: membro.nome || 'Sem nome',
        presencas,
        totalRelatorios: relatoriosComPresencas.length,
        percentual: Math.round((presencas / relatoriosComPresencas.length) * 100)
      };
    }).sort((a, b) => b.presencas - a.presencas).slice(0, 5);
  }

  private dataRelatorio(relatorio: PequenoGrupoRelatorio): Date {
    return new Date(relatorio.dataReuniao || relatorio.dataCadastro || new Date());
  }

  private mesmaSemana(data: Date, referencia: Date): boolean {
    const inicioData = this.inicioSemana(data);
    const inicioReferencia = this.inicioSemana(referencia);
    return inicioData.getTime() === inicioReferencia.getTime();
  }

  private inicioSemana(data: Date): Date {
    const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    inicio.setDate(inicio.getDate() - inicio.getDay());
    return inicio;
  }

  private normalizarRelatorio(relatorio: any): PequenoGrupoRelatorio {
    return {
      ...relatorio,
      id: relatorio.id || relatorio.Id,
      dataReuniao: relatorio.dataReuniao || relatorio.DataReuniao,
      semanaReferencia: relatorio.semanaReferencia || relatorio.SemanaReferencia,
      quantidadeAtivos: relatorio.quantidadeAtivos || relatorio.QuantidadeAtivos || 0,
      quantidadeRotativos: relatorio.quantidadeRotativos || relatorio.QuantidadeRotativos || 0,
      quantidadeCriancas: relatorio.quantidadeCriancas || relatorio.QuantidadeCriancas || 0,
      quantidadeVisitantes: relatorio.quantidadeVisitantes || relatorio.QuantidadeVisitantes || 0,
      status: relatorio.status || relatorio.Status,
      dataCadastro: relatorio.dataCadastro || relatorio.DataCadastro,
      dataEnvio: relatorio.dataEnvio || relatorio.DataEnvio,
      presencas: relatorio.presencas || relatorio.Presencas || []
    } as PequenoGrupoRelatorio;
  }
}
