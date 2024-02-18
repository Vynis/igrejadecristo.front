import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';
import { VwRelatorioInscricoes } from '../../../@core/models/vw-relatorio-inscricoes.model';
import { RelatorioService } from '../../../@core/services/relatorio.service';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { FiltroItemModel } from '../../../@core/models/filtroItem.model';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-relatorios-inscricoes',
  templateUrl: './relatorios-inscricoes.component.html',
  styleUrls: ['./relatorios-inscricoes.component.scss']
})
export class RelatoriosInscricoesComponent implements OnInit {

  @ViewChild('filtroTitulo', { static: true }) filtroTitulo: ElementRef;

  colunas: DataTableColunas[] = [
    { propriedade: 'idUsuario', titulo: 'Id Aluno', disabled: false, maxwidth: 100 , cell: (row:  VwRelatorioInscricoes) => `${row.idUsuario}` },
    { propriedade: 'idInscricao', titulo: 'Id Inscrição', disabled: false, maxwidth: 100, cell: (row:  VwRelatorioInscricoes) => `${row.idInscricao}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.nome}`  },
    { propriedade: 'telefoneCelular', titulo: 'Celular', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.telefoneCelular}`  },
    { propriedade: 'curso', titulo: 'Curso', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.curso}`  },
    { propriedade: 'status', titulo: 'Status Pagto.', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.status}`  },
    { propriedade: 'dataInscricao', titulo: 'Data Inscrição', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${ formatDate(row.dataInscricao,'dd/MM/yyyy hh:mm:ss','en-US') }`  },
    { propriedade: 'ciclo', titulo: 'Ciclo', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.ciclo}/${row.ano}`  },
    { propriedade: 'meioPagamentoDesc', titulo: 'Meio Pagto', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.meioPagamentoDesc}`  },
    { propriedade: 'valorLiquido', titulo: 'Valor Liquido', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.valorLiquido}`  },
    { propriedade: 'valorBruto', titulo: 'Valor Liquido', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.valorBruto}`  },
    { propriedade: 'qtdParcelas', titulo: 'Qtd. Parcelas', disabled: false, cell: (row:  VwRelatorioInscricoes) => `${row.qtdParcelas}`  },
  ];

  acoes: DataTableAcoes[] = [
    // { icone: 'create', evento: null, toolTip: 'Editar', color: 'primary' },
  ];

  formulario: FormGroup;

  dadosTabela: VwRelatorioInscricoes[] = [];

  listaCiclos: any[] = [];
  listaAnos: any[] = [];

  constructor(
    private relatorioService: RelatorioService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.buscaCiclosAnos();
  }


  createForm(_filtro) {
    this.formulario = this.fb.group({
      nome: ['' ],
      ciclo: [_filtro.ciclo ],
      ano: [_filtro.ano ],
      status: ['' ]
    });
  }

  obterDadosGrid() {
    const parametros = new PaginationfilterModel();
    parametros.filtro = this.prepararFiltro();

    this.relatorioService.buscaRelatorioInscritos(parametros).subscribe(
      res => this.dadosTabela = res.dados
    );

  }

  prepararFiltro() : FiltroItemModel[] {
    let listaFiltro: FiltroItemModel[] = [];

    if (this.formulario.controls.nome.value !== '')
      listaFiltro.push({ property: 'Nome', filterType: 'contains', value: this.formulario.controls.nome.value });

    if (this.formulario.controls.ciclo.value !== '') 
      listaFiltro.push({ property: 'Ciclo', filterType: 'equals', value: this.formulario.controls.ciclo.value });

    if (this.formulario.controls.ano.value !== '') 
      listaFiltro.push({ property: 'Ano', filterType: 'equals', value: this.formulario.controls.ano.value });

    if (this.formulario.controls.status.value !== '') 
      listaFiltro.push({ property: 'Status', filterType: 'equals', value: this.formulario.controls.status.value });

    return listaFiltro;
  }

  downloadExcel(){
    const parametros = new PaginationfilterModel();
    parametros.filtro = this.prepararFiltro();


    this.relatorioService.dowloadRelatorioInscritos(parametros).subscribe(res => {
      console.log(res);
      let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
    });
  }

  buscaCiclosAnos() {
    this.relatorioService.buscaFiltroTodosCiclosEhAnos().subscribe(res => {
      this.listaCiclos = res.dados.listaCiclos;
      this.listaAnos = res.dados.listaAnos;

      var filtro = { ciclo: this.listaCiclos[0].ciclo, ano: this.listaAnos[0].ano };

      this.createForm(filtro);
      this.obterDadosGrid();
    });
  }

}
