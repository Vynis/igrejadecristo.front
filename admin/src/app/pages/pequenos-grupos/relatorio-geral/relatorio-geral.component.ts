import { Component, OnInit } from '@angular/core';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-relatorio-geral',
  templateUrl: './relatorio-geral.component.html',
  styleUrls: ['./relatorio-geral.component.scss']
})
export class RelatorioGeralComponent implements OnInit {
  pequenosGrupos: PequenoGrupoModel[] = [];
  dadosTabela: any[] = [];

  colunas: DataTableColunas[] = [
    { propriedade: 'nome', titulo: 'PG', disabled: false, cell: (row: any) => `${row.nome || ''}` },
    { propriedade: 'congregacaoId', titulo: 'Congregação', disabled: false, maxwidth: 120, cell: (row: any) => `${row.congregacaoId || ''}` },
    { propriedade: 'diaSemana', titulo: 'Dia', disabled: false, maxwidth: 130, cell: (row: any) => `${row.diaSemana || ''}` },
    { propriedade: 'horarioReuniao', titulo: 'Horário', disabled: false, maxwidth: 100, cell: (row: any) => `${row.horarioReuniao || ''}` },
    { propriedade: 'membrosAtivos', titulo: 'Membros ativos', disabled: false, maxwidth: 130, cell: (row: any) => `${row.membrosAtivos || 0}` },
    { propriedade: 'totalRelatorios', titulo: 'Relatórios', disabled: false, maxwidth: 110, cell: (row: any) => `${row.totalRelatorios || 0}` },
    { propriedade: 'ultimoRelatorio', titulo: 'Último relatório', disabled: false, maxwidth: 140, cell: (row: any) => this.data(row.ultimoRelatorio) },
    { propriedade: 'mediaPresenca', titulo: 'Média presença', disabled: false, maxwidth: 130, cell: (row: any) => `${row.mediaPresenca || 0}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: any) => row.status === 'A' ? 'Ativo' : 'Inativo' },
  ];

  constructor(private service: PequenoGrupoAdminService) { }

  ngOnInit() {
    this.service.buscarRelatorioGeral().subscribe(res => { if (res.success) this.dadosTabela = res.dados; });
  }

  data(valor: any): string {
    return valor ? new Date(valor).toLocaleDateString('pt-BR') : '-';
  }
}
