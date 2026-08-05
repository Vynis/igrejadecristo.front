import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FiltroItemModel } from '../../../@core/models/filtroItem.model';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { ProcessoInscricaoModel } from '../../../@core/models/processo-inscricao.model';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

interface CicloAnoFiltro {
  key: string;
  ciclo: string;
  ano: string;
  descricao: string;
}

@Component({
  selector: 'app-processo-inscricao-lista',
  templateUrl: './processo-inscricao-lista.component.html',
  styleUrls: ['./processo-inscricao-lista.component.scss']
})
export class ProcessoInscricaoListaComponent implements OnInit {

  @ViewChild('filtroStatus', { static: true }) filtroStatus: ElementRef;

  filtrosCicloAno: CicloAnoFiltro[] = [];
  filtroCicloAnoSelecionado = 'TODOS';

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: ProcessoInscricaoModel) => `${row.id}` },
    { propriedade: 'curso', titulo: 'Curso', disabled: false, cell: (row: ProcessoInscricaoModel) => `${row.curso ? row.curso.titulo : ''}` },
    { propriedade: 'cicloAno', titulo: 'Ciclo/Ano', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoModel) => `${row.ciclo || ''}/${row.ano || ''}` },
    { propriedade: 'qtdInscricoesTotal', titulo: 'Inscrições Total', disabled: false, maxwidth: 130, cell: (row: ProcessoInscricaoModel) => `${row.qtdInscricoesTotal || 0}` },
    { propriedade: 'qtdInscricoesConfirmadas', titulo: 'Confirmadas', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoModel) => `${row.qtdInscricoesConfirmadas || 0}` },
    { propriedade: 'qtdInscricoesCanceladas', titulo: 'Canceladas', disabled: false, maxwidth: 110, cell: (row: ProcessoInscricaoModel) => `${row.qtdInscricoesCanceladas || 0}` },
    { propriedade: 'tipo', titulo: 'Tipo', disabled: false, maxwidth: 80, cell: (row: ProcessoInscricaoModel) => row.tipo === 'P' ? 'Pago' : 'Gratuito' },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: ProcessoInscricaoModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'people', evento: this.visualizarUsuariosInscritos.bind(this), toolTip: 'Visualizar alunos inscritos', color: 'primary', visivel: () => this.temPermissao('processoinscricao.alunos_inscritos') },
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('processoinscricao.editar') }
  ];

  dadosTabela: ProcessoInscricaoModel[] = [];

  constructor(
    private processoInscricaoService: ProcessoInscricaoService,
    private permissaoService: PermissaoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarFiltrosCicloAno();
  }

  carregarFiltrosCicloAno() {
    this.processoInscricaoService.buscarCiclos().subscribe(res => {
      const lista = this.ordenarCicloAnoDesc(res?.dados || []);

      this.filtrosCicloAno = [
        { key: 'TODOS', ciclo: null, ano: null, descricao: 'Todos' },
        ...lista.map(item => ({
          key: `${item.ciclo}-${item.ano}`,
          ciclo: item.ciclo,
          ano: item.ano,
          descricao: `${item.ciclo}/${item.ano}`,
        })),
      ];

      this.obterDadosGrid();
    });
  }

  obterDadosGrid() {
    const parametros = new PaginationfilterModel();
    parametros.filtro = this.prepararFiltro();

    this.processoInscricaoService.obterDadosFiltro(parametros).subscribe(res => {
      this.dadosTabela = res.dados;
    });
  }

  prepararFiltro(): FiltroItemModel[] {
    const listaFiltro: FiltroItemModel[] = [];
    const cicloAnoSelecionado = this.filtrosCicloAno.find(x => x.key === this.filtroCicloAnoSelecionado);

    if (cicloAnoSelecionado && cicloAnoSelecionado.key !== 'TODOS') {
      listaFiltro.push({ property: 'Ciclo', filterType: 'equals', value: cicloAnoSelecionado.ciclo });
      listaFiltro.push({ property: 'Ano', filterType: 'equals', value: cicloAnoSelecionado.ano });
    }

    if (this.filtroStatus.nativeElement.value !== '')
      listaFiltro.push({ property: 'Status', filterType: 'equals', value: this.filtroStatus.nativeElement.value });

    return listaFiltro;
  }

  editar(processoInscricao: ProcessoInscricaoModel) {
    this.router.navigate([`pages/processo-inscricao/cadastro/edit/${processoInscricao.id}`]);
  }

  visualizarUsuariosInscritos(processoInscricao: ProcessoInscricaoModel) {
    this.router.navigate([`pages/processo-inscricao/usuarios-inscritos/${processoInscricao.id}`]);
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }

  private ordenarCicloAnoDesc(lista: any[]): any[] {
    return [...lista].sort((a, b) => {
      const anoA = this.toNumberOrZero(a?.ano);
      const anoB = this.toNumberOrZero(b?.ano);

      if (anoB !== anoA)
        return anoB - anoA;

      const cicloA = this.toNumberOrZero(a?.ciclo);
      const cicloB = this.toNumberOrZero(b?.ciclo);

      if (cicloB !== cicloA)
        return cicloB - cicloA;

      return `${b?.ciclo || ''}`.localeCompare(`${a?.ciclo || ''}`);
    });
  }

  private toNumberOrZero(valor: any): number {
    const numero = Number(valor);
    return Number.isNaN(numero) ? 0 : numero;
  }

}
