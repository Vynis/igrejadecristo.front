import { Component, OnInit } from '@angular/core';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-checkins-lista',
  templateUrl: './checkins-lista.component.html',
  styleUrls: ['./checkins-lista.component.scss']
})
export class CheckinsListaComponent implements OnInit {
  pequenosGrupos: PequenoGrupoModel[] = [];
  dadosTabela: any[] = [];

  colunas: DataTableColunas[] = [
    { propriedade: 'dataReuniao', titulo: 'Data', disabled: false, maxwidth: 120, cell: (row: any) => this.data(row.dataReuniao) },
    { propriedade: 'semanaReferencia', titulo: 'Semana', disabled: false, maxwidth: 150, cell: (row: any) => `${row.semanaReferencia || ''}` },
    { propriedade: 'pequenoGrupoId', titulo: 'PG', disabled: false, cell: (row: any) => this.nomePg(row.pequenoGrupoId) },
    { propriedade: 'quantidadeAtivos', titulo: 'Ativos', disabled: false, maxwidth: 80, cell: (row: any) => `${row.quantidadeAtivos || 0}` },
    { propriedade: 'quantidadeRotativos', titulo: 'Rotativos', disabled: false, maxwidth: 90, cell: (row: any) => `${row.quantidadeRotativos || 0}` },
    { propriedade: 'quantidadeCriancas', titulo: 'Crianças', disabled: false, maxwidth: 90, cell: (row: any) => `${row.quantidadeCriancas || 0}` },
    { propriedade: 'quantidadeVisitantes', titulo: 'Visitantes', disabled: false, maxwidth: 90, cell: (row: any) => `${row.quantidadeVisitantes || 0}` },
    { propriedade: 'totalPresente', titulo: 'Total', disabled: false, maxwidth: 80, cell: (row: any) => `${row.totalPresente || 0}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 100, cell: (row: any) => `${row.status || ''}` },
  ];

  constructor(private service: PequenoGrupoAdminService) { }

  ngOnInit() {
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.service.buscarCheckins().subscribe(res => { if (res.success) this.dadosTabela = res.dados; });
  }

  nomePg(id: number): string {
    const pg = this.pequenosGrupos.find(x => x.id === id);
    return pg ? pg.nome : `PG ${id}`;
  }

  data(valor: any): string {
    return valor ? new Date(valor).toLocaleDateString('pt-BR') : '';
  }
}
