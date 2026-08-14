import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PequenoGrupoRelatorioModel } from '../../../@core/models/pequeno-grupo-relatorio.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-relatorios-lista',
  templateUrl: './relatorios-lista.component.html',
  styleUrls: ['./relatorios-lista.component.scss']
})
export class RelatoriosListaComponent implements OnInit {
  pequenosGrupos: PequenoGrupoModel[] = [];
  relatorios: PequenoGrupoRelatorioModel[] = [];
  dadosTabela: PequenoGrupoRelatorioModel[] = [];
  mesesEnvio: string[] = [];
  filtroPequenoGrupoId: number;
  filtroMesAnoEnvio: string;

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: PequenoGrupoRelatorioModel) => `${row.id}` },
    { propriedade: 'dataReuniao', titulo: 'Data', disabled: false, maxwidth: 120, cell: (row: PequenoGrupoRelatorioModel) => this.data(row.dataReuniao) },
    { propriedade: 'semanaReferencia', titulo: 'Semana', disabled: false, maxwidth: 150, cell: (row: PequenoGrupoRelatorioModel) => `${row.semanaReferencia || ''}` },
    { propriedade: 'pequenoGrupoId', titulo: 'PG', disabled: false, cell: (row: PequenoGrupoRelatorioModel) => this.nomePg(row.pequenoGrupoId) },
    { propriedade: 'total', titulo: 'Total', disabled: false, maxwidth: 90, cell: (row: PequenoGrupoRelatorioModel) => `${this.total(row)}` },
    { propriedade: 'quantidadeVisitantes', titulo: 'Visitantes', disabled: false, maxwidth: 100, cell: (row: PequenoGrupoRelatorioModel) => `${row.quantidadeVisitantes || 0}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 100, cell: (row: PequenoGrupoRelatorioModel) => `${row.status || ''}` },
    { propriedade: 'dataEnvio', titulo: 'Enviado em', disabled: false, maxwidth: 130, cell: (row: PequenoGrupoRelatorioModel) => this.data(row.dataEnvio) },
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('pequenosgrupos.relatorios.editar') }
  ];

  constructor(private service: PequenoGrupoAdminService, private permissaoService: PermissaoService, private router: Router) { }

  ngOnInit() {
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.service.buscarRelatorios().subscribe(res => {
      if (res.success) {
        this.relatorios = res.dados || [];
        this.mesesEnvio = this.montarMesesEnvio(this.relatorios);
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros() {
    this.dadosTabela = this.relatorios.filter(relatorio => {
      const filtroPgValido = !this.filtroPequenoGrupoId || relatorio.pequenoGrupoId === this.filtroPequenoGrupoId;
      const filtroMesValido = !this.filtroMesAnoEnvio || this.mesAno(relatorio.dataEnvio) === this.filtroMesAnoEnvio;
      return filtroPgValido && filtroMesValido;
    });
  }

  limparFiltros() {
    this.filtroPequenoGrupoId = null;
    this.filtroMesAnoEnvio = null;
    this.aplicarFiltros();
  }

  editar(relatorio: PequenoGrupoRelatorioModel) {
    this.router.navigate([`pages/pequenos-grupos/relatorios/cadastro/edit/${relatorio.id}`]);
  }

  nomePg(id: number): string {
    const pg = this.pequenosGrupos.find(x => x.id === id);
    return pg ? pg.nome : `PG ${id}`;
  }

  total(row: PequenoGrupoRelatorioModel): number {
    return Number(row.quantidadeAtivos || 0) + Number(row.quantidadeRotativos || 0) + Number(row.quantidadeCriancas || 0) + Number(row.quantidadeVisitantes || 0);
  }

  data(valor: any): string {
    return valor ? new Date(valor).toLocaleDateString('pt-BR') : '';
  }

  nomeMesAno(valor: string): string {
    if (!valor) return '';
    const partes = valor.split('-');
    return `${partes[1]}/${partes[0]}`;
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }

  private montarMesesEnvio(relatorios: PequenoGrupoRelatorioModel[]): string[] {
    return Array.from(new Set(relatorios.map(x => this.mesAno(x.dataEnvio)).filter(x => !!x))).sort().reverse();
  }

  private mesAno(valor: any): string {
    if (!valor) return '';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return `${data.getFullYear()}-${`${data.getMonth() + 1}`.padStart(2, '0')}`;
  }
}
