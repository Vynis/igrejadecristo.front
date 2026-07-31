import { Component, OnInit } from '@angular/core';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { RelatorioService } from '../../../@core/services/relatorio.service';

@Component({
  selector: 'app-relatorios-evolucao-usuarios',
  templateUrl: './relatorios-evolucao-usuarios.component.html',
  styleUrls: ['./relatorios-evolucao-usuarios.component.scss']
})
export class RelatoriosEvolucaoUsuariosComponent implements OnInit {
  listaEvolucaoUsuarios: any[] = [];
  listaCabecalhoTabela: string[] = [];
  nome = '';

  constructor(
    private relatorioService: RelatorioService,
    private permissaoService: PermissaoService
  ) { }

  ngOnInit() {
    this.obterDadosGrid();
  }

  obterDadosGrid() {
    this.relatorioService.buscaRelatorioEvolucaoUsuarios(this.nome).subscribe(res => {
      if (!res.success)
        return;

      this.listaEvolucaoUsuarios = res.dados || [];
      this.listaCabecalhoTabela = this.listaEvolucaoUsuarios.length > 0 ? Object.keys(this.listaEvolucaoUsuarios[0]) : [];
    });
  }

  formataValorTexto(row, col) {
    return row[col];
  }

  downloadExcel() {
    this.relatorioService.dowloadRelatorioEvolucaoUsuarios(this.nome).subscribe(res => {
      const blob = new Blob([res as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      const pwa = window.open(url);

      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
    });
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }
}
