import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';
import { RelatorioService } from '../../../@core/services/relatorio.service';
import { error } from 'console';

@Component({
  selector: 'app-relatorios-presenca',
  templateUrl: './relatorios-presenca.component.html',
  styleUrls: ['./relatorios-presenca.component.scss']
})
export class RelatoriosPresencaComponent implements OnInit {
  listaProcessoInscricoes: any[] = [];
  listaPresencaAlunos: any[] = [];
  listaCabecalhoTabela: any[] = [];
  formulario: FormGroup;

  constructor(
    private processoInscricaoService: ProcessoInscricaoService, 
    private relatorioService: RelatorioService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buscarProcessoInscricoes();
    this.createForm();
  }


  createForm() {
    this.formulario = this.fb.group({
      curso: ['' ]
    });
  }

  obterDadosGrid() {

    var processoInscricaoId = this.formulario.controls.curso.value;

    const findProcessoSelecionado = this.listaProcessoInscricoes.filter( x => x.id === processoInscricaoId);

    this.relatorioService.buscaRelatorioPresencaAlunos(findProcessoSelecionado[0].ciclo, findProcessoSelecionado[0].ano, findProcessoSelecionado[0].id).subscribe(res => {
      if (!res.success)
          return;


      if (res.dados.length == 0)
        return;

      
      this.listaPresencaAlunos = res.dados;
      this.listaCabecalhoTabela = Object.keys(res.dados[0]);
    });

  }

  buscarProcessoInscricoes() {
    this.processoInscricaoService.buscarInscricoesAtivas().subscribe(res => {
      if (!res.success)
          return;

      this.listaProcessoInscricoes = res.dados.filter(x => x.dataInicioPresencial !== null);
    });
  }

  formataValorTexto(row,col) {
    return row[col];
  }

  downloadExcel() {
    var processoInscricaoId = this.formulario.controls.curso.value;

    const findProcessoSelecionado = this.listaProcessoInscricoes.filter( x => x.id === processoInscricaoId);


    this.relatorioService.dowloadRelatorioPresencaAlunos(findProcessoSelecionado[0].ciclo, findProcessoSelecionado[0].ano, findProcessoSelecionado[0].id).subscribe(res => {
      console.log(res);
      let blob = new Blob([res as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
    }, error => {
      console.log(error)
    }
   
    );
  }

}
