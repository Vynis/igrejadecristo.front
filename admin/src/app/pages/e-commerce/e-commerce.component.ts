import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FiltroItemModel } from '../../@core/models/filtroItem.model';
import { PaginationfilterModel } from '../../@core/models/paginationfilter.model';
import { ProcessoInscricaoModel } from '../../@core/models/processo-inscricao.model';
import { RelatorioService } from '../../@core/services/relatorio.service';
import { ProcessoInscricaoService } from '../../@core/services/processo-inscricao.service';
import { UsuarioService } from '../../@core/services/usuario.service';

interface CicloAnoFiltro {
  key: string;
  ciclo: string;
  ano: string;
  descricao: string;
}

interface DashboardCard {
  titulo: string;
  valor: number;
  status: string;
}

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class ECommerceComponent implements OnInit {
  carregando = false;

  filtros: CicloAnoFiltro[] = [];
  filtroSelecionado = 'TODOS';

  cards: DashboardCard[] = [
    { titulo: 'Processos', valor: 0, status: 'basic' },
    { titulo: 'Inscrições', valor: 0, status: 'primary' },
    { titulo: 'Confirmadas', valor: 0, status: 'success' },
    { titulo: 'Canceladas', valor: 0, status: 'danger' },
    { titulo: 'Usuários', valor: 0, status: 'info' },
  ];

  graficoCursos: any = {};
  graficoCongregacoes: any = {};
  graficoStatus: any = {};

  constructor(
    private relatorioService: RelatorioService,
    private processoInscricaoService: ProcessoInscricaoService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    this.carregarFiltros();
  }

  onChangeFiltro(key: string) {
    this.filtroSelecionado = key;
    this.carregarDashboard();
  }

  private carregarFiltros() {
    this.processoInscricaoService.buscarCiclos().subscribe(res => {
      const lista = this.ordenarCicloAnoDesc(res?.dados || []);

      this.filtros = [
        { key: 'TODOS', ciclo: null, ano: null, descricao: 'Todos' },
        ...lista.map(item => ({
          key: `${item.ciclo}-${item.ano}`,
          ciclo: item.ciclo,
          ano: item.ano,
          descricao: `${item.ciclo}/${item.ano}`,
        })),
      ];

      if (!this.filtros.some(x => x.key === this.filtroSelecionado))
        this.filtroSelecionado = 'TODOS';

      this.carregarDashboard();
    });
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

      const cicloTextoA = `${a?.ciclo || ''}`;
      const cicloTextoB = `${b?.ciclo || ''}`;
      return cicloTextoB.localeCompare(cicloTextoA);
    });
  }

  private toNumberOrZero(valor: any): number {
    const numero = Number(valor);
    return Number.isNaN(numero) ? 0 : numero;
  }

  private carregarDashboard() {
    this.carregando = true;
    const filtro = this.criarFiltro();

    forkJoin({
      processos: this.processoInscricaoService.obterDadosFiltro(filtro),
      contagemCurso: this.relatorioService.buscarContagemInscritosCurso(filtro),
      contagemCongregacao: this.relatorioService.buscarContagemInscritosCongregacao(filtro),
      usuarios: this.usuarioService.obterTodos(),
    }).subscribe(result => {
      const processos = (result.processos?.dados || []) as ProcessoInscricaoModel[];
      const curso = result.contagemCurso?.dados || [];
      const congregacao = result.contagemCongregacao?.dados || [];
      const usuarios = result.usuarios?.dados || [];

      this.preencherCards(processos, usuarios.length);
      this.montarGraficoCursos(curso);
      this.montarGraficoCongregacoes(congregacao);
      this.montarGraficoStatus(processos);
      this.carregando = false;
    }, () => {
      this.carregando = false;
    });
  }

  private preencherCards(processos: ProcessoInscricaoModel[], totalUsuarios: number) {
    const totalInscricoes = processos.reduce((soma, item) => soma + (item.qtdInscricoesTotal || 0), 0);
    const confirmadas = processos.reduce((soma, item) => soma + (item.qtdInscricoesConfirmadas || 0), 0);
    const canceladas = processos.reduce((soma, item) => soma + (item.qtdInscricoesCanceladas || 0), 0);

    this.cards = [
      { titulo: 'Processos', valor: processos.length, status: 'basic' },
      { titulo: 'Inscrições', valor: totalInscricoes, status: 'primary' },
      { titulo: 'Confirmadas', valor: confirmadas, status: 'success' },
      { titulo: 'Canceladas', valor: canceladas, status: 'danger' },
      { titulo: 'Usuários', valor: totalUsuarios, status: 'info' },
    ];
  }

  private montarGraficoCursos(lista: any[]) {
    const topLista = [...lista].sort((a, b) => b.qtd - a.qtd).slice(0, 10);

    this.graficoCursos = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: topLista.map(x => x.nome), axisLabel: { interval: 0, rotate: 20 } },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: topLista.map(x => x.qtd),
          itemStyle: { color: '#3366FF' },
          name: 'Inscrições',
        },
      ],
    };
  }

  private montarGraficoCongregacoes(lista: any[]) {
    const topLista = [...lista].sort((a, b) => b.qtd - a.qtd).slice(0, 10);

    this.graficoCongregacoes = {
      tooltip: { trigger: 'axis' },
      grid: { left: 120, right: 20, top: 20, bottom: 20 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: topLista.map(x => x.nome) },
      series: [
        {
          type: 'bar',
          data: topLista.map(x => x.qtd),
          itemStyle: { color: '#00D68F' },
          name: 'Inscrições',
        },
      ],
    };
  }

  private montarGraficoStatus(processos: ProcessoInscricaoModel[]) {
    const confirmadas = processos.reduce((soma, item) => soma + (item.qtdInscricoesConfirmadas || 0), 0);
    const canceladas = processos.reduce((soma, item) => soma + (item.qtdInscricoesCanceladas || 0), 0);
    const total = processos.reduce((soma, item) => soma + (item.qtdInscricoesTotal || 0), 0);
    const aguardando = Math.max(total - confirmadas - canceladas, 0);

    this.graficoStatus = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: confirmadas, name: 'Confirmadas', itemStyle: { color: '#00D68F' } },
            { value: aguardando, name: 'Aguardando', itemStyle: { color: '#FFAA00' } },
            { value: canceladas, name: 'Canceladas', itemStyle: { color: '#FF3D71' } },
          ],
        },
      ],
    };
  }

  private criarFiltro(): PaginationfilterModel {
    const filtro = new PaginationfilterModel();
    filtro.filtro = [];

    const selecionado = this.filtros.find(x => x.key === this.filtroSelecionado);

    if (!selecionado || selecionado.key === 'TODOS')
      return filtro;

    filtro.filtro.push(this.novoFiltro('ciclo', selecionado.ciclo));
    filtro.filtro.push(this.novoFiltro('ano', selecionado.ano));

    return filtro;
  }

  private novoFiltro(property: string, value: any): FiltroItemModel {
    const item = new FiltroItemModel();
    item.property = property;
    item.filterType = 'equals';
    item.value = value;
    return item;
  }
}
