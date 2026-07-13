import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { PequenoGrupoMembro } from 'src/app/core/_models/pequeno-grupo-membro.model';
import { PequenoGrupoRelatorio, PequenoGrupoRelatorioPresenca } from 'src/app/core/_models/pequeno-grupo-relatorio.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({ selector: 'app-relatorios', templateUrl: './relatorios.page.html', styleUrls: ['./relatorios.page.scss'] })
export class RelatoriosPage implements OnInit {
  form: FormGroup;
  relatorios: PequenoGrupoRelatorio[] = [];
  membros: PequenoGrupoMembro[] = [];
  presencas: PequenoGrupoRelatorioPresenca[] = [];
  presencasRelatorioSelecionado: PequenoGrupoRelatorioPresenca[] = [];
  modo: 'simplificado' | 'completo' = 'simplificado';
  exibindoFormulario = false;
  editando = false;

  constructor(private fb: FormBuilder, private service: PequenoGrupoService, private toastCtrl: ToastController) {
    this.form = this.fb.group({
      id: [0], dataReuniao: [''], semanaReferencia: [''], quantidadeAtivos: [0], quantidadeRotativos: [0],
      quantidadeCriancas: [0], quantidadeVisitantes: [0], observacao: [''], status: ['Rascunho']
    });
  }

  ngOnInit() { this.carregar(); this.carregarMembros(); }

  carregar() {
    this.service.relatorios().subscribe(res => {
      if (res.success) this.relatorios = (res.dados || []).map((x: any) => this.normalizarRelatorio(x));
    });
  }

  carregarMembros() {
    this.service.membros().subscribe(res => {
      if (res.success) {
        this.membros = (res.dados || []).filter((x: PequenoGrupoMembro) => x.status === 'A');

        if (this.exibindoFormulario && this.modo === 'completo' && !this.presencas.length) {
          this.montarPresencas(this.presencasRelatorioSelecionado);
          this.atualizarQuantidades();
        }
      }
    });
  }

  iniciar(modo: 'simplificado' | 'completo') {
    this.novo();
    this.modo = modo;
    this.exibindoFormulario = true;
    this.form.patchValue({
      dataReuniao: this.dataHoje(),
      semanaReferencia: this.semanaReferenciaAtual()
    });
    this.presencasRelatorioSelecionado = [];

    if (modo === 'completo') {
      this.montarPresencas([]);
      this.atualizarQuantidades();
    }
  }

  salvar() {
    const relatorio = this.montarRelatorio();
    const request = this.editando ? this.service.atualizarRelatorio(relatorio) : this.service.cadastrarRelatorio(relatorio);
    request.subscribe(res => {
      this.show(res.success ? 'Relatório salvo com sucesso.' : res.dados);
      if (res.success) { this.novo(); this.carregar(); }
    });
  }

  salvarEEnviar() {
    const relatorio = this.montarRelatorio();

    const request = this.editando ? this.service.atualizarRelatorio(relatorio) : this.service.cadastrarRelatorio(relatorio);
    request.subscribe(res => {
      if (!res.success) {
        this.show(res.dados);
        return;
      }

      const id = this.editando ? relatorio.id : (res.dados.id || res.dados.Id);
      this.service.enviarRelatorio(id).subscribe(envio => {
        this.show(envio.dados);
        this.novo();
        this.carregar();
      });
    });
  }

  editar(relatorio: PequenoGrupoRelatorio) {
    relatorio = this.normalizarRelatorio(relatorio);
    this.editando = true;
    this.exibindoFormulario = true;
    this.modo = relatorio.presencas && relatorio.presencas.length ? 'completo' : 'simplificado';
    this.form.patchValue({ ...relatorio, dataReuniao: this.toInputDate(relatorio.dataReuniao) });
    this.presencasRelatorioSelecionado = relatorio.presencas || [];
    this.montarPresencas(this.presencasRelatorioSelecionado);
  }

  enviar(relatorio: PequenoGrupoRelatorio) {
    this.service.enviarRelatorio(relatorio.id).subscribe(res => {
      this.show(res.dados);
      this.carregar();
    });
  }

  novo() {
    this.editando = false;
    this.exibindoFormulario = false;
    this.presencas = [];
    this.presencasRelatorioSelecionado = [];
    this.form.reset({ id: 0, quantidadeAtivos: 0, quantidadeRotativos: 0, quantidadeCriancas: 0, quantidadeVisitantes: 0, status: 'Rascunho' });
  }

  totalPresentes(): number {
    const valores = this.form.value;
    return Number(valores.quantidadeAtivos || 0) + Number(valores.quantidadeRotativos || 0) + Number(valores.quantidadeCriancas || 0) + Number(valores.quantidadeVisitantes || 0);
  }

  atualizarQuantidades() {
    const presentes = this.presencas.filter(x => x.presente);

    this.form.patchValue({
      quantidadeAtivos: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'ativo').length,
      quantidadeRotativos: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'rotativo').length,
      quantidadeCriancas: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'crianca').length,
    });
  }

  membroPorId(id: number): PequenoGrupoMembro {
    return this.membros.find(x => x.id === id);
  }

  private montarRelatorio(): PequenoGrupoRelatorio {
    const relatorio = this.form.value as PequenoGrupoRelatorio;
    relatorio.presencas = this.modo === 'completo' ? this.presencas : [];
    return relatorio;
  }

  private montarPresencas(presencasRelatorio: PequenoGrupoRelatorioPresenca[]) {
    const presencas = (presencasRelatorio || []).map((x: any) => this.normalizarPresenca(x));

    this.presencas = this.membros.map(membro => {
      const presenca = presencas.find(x => x.pequenoGrupoMembroId === membro.id);

      return {
        id: presenca ? presenca.id : 0,
        pequenoGrupoRelatorioId: presenca ? presenca.pequenoGrupoRelatorioId : 0,
        pequenoGrupoMembroId: membro.id,
        presente: presenca ? presenca.presente : false,
        observacao: presenca ? presenca.observacao : ''
      } as PequenoGrupoRelatorioPresenca;
    });
  }

  private tipoMembro(membroId: number): string {
    const membro = this.membroPorId(membroId);
    const tipo = ((membro && membro.tipo) || '').toLowerCase();

    if (tipo.indexOf('crian') >= 0) return 'crianca';
    if (tipo.indexOf('rot') >= 0) return 'rotativo';
    return 'ativo';
  }

  private dataHoje(): string {
    return this.toInputDate(new Date());
  }

  private semanaReferenciaAtual(): string {
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    return `${this.formatarData(inicio)} a ${this.formatarData(fim)}`;
  }

  private formatarData(data: Date): string {
    const dia = `${data.getDate()}`.padStart(2, '0');
    const mes = `${data.getMonth() + 1}`.padStart(2, '0');
    return `${dia}/${mes}`;
  }

  private toInputDate(data: any): string {
    if (!data) return '';
    const valorData = new Date(data);
    if (Number.isNaN(valorData.getTime())) return '';
    const ano = valorData.getFullYear();
    const mes = `${valorData.getMonth() + 1}`.padStart(2, '0');
    const dia = `${valorData.getDate()}`.padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private normalizarRelatorio(relatorio: any): PequenoGrupoRelatorio {
    return {
      ...relatorio,
      id: relatorio.id || relatorio.Id,
      pequenoGrupoId: relatorio.pequenoGrupoId || relatorio.PequenoGrupoId,
      liderPequenoGrupoId: relatorio.liderPequenoGrupoId || relatorio.LiderPequenoGrupoId,
      dataReuniao: relatorio.dataReuniao || relatorio.DataReuniao,
      semanaReferencia: relatorio.semanaReferencia || relatorio.SemanaReferencia,
      quantidadeAtivos: relatorio.quantidadeAtivos || relatorio.QuantidadeAtivos || 0,
      quantidadeRotativos: relatorio.quantidadeRotativos || relatorio.QuantidadeRotativos || 0,
      quantidadeCriancas: relatorio.quantidadeCriancas || relatorio.QuantidadeCriancas || 0,
      quantidadeVisitantes: relatorio.quantidadeVisitantes || relatorio.QuantidadeVisitantes || 0,
      observacao: relatorio.observacao || relatorio.Observacao,
      status: relatorio.status || relatorio.Status,
      dataCadastro: relatorio.dataCadastro || relatorio.DataCadastro,
      dataEnvio: relatorio.dataEnvio || relatorio.DataEnvio,
      presencas: (relatorio.presencas || relatorio.Presencas || []).map((x: any) => this.normalizarPresenca(x))
    } as PequenoGrupoRelatorio;
  }

  private normalizarPresenca(presenca: any): PequenoGrupoRelatorioPresenca {
    return {
      id: presenca.id || presenca.Id,
      pequenoGrupoRelatorioId: presenca.pequenoGrupoRelatorioId || presenca.PequenoGrupoRelatorioId,
      pequenoGrupoMembroId: presenca.pequenoGrupoMembroId || presenca.PequenoGrupoMembroId,
      presente: presenca.presente === undefined ? presenca.Presente : presenca.presente,
      observacao: presenca.observacao || presenca.Observacao
    } as PequenoGrupoRelatorioPresenca;
  }

  async show(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500 });
    toast.present();
  }
}
