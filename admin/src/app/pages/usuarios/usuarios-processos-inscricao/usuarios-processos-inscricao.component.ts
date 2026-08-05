import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioProcessoInscricaoModel } from '../../../@core/models/usuario-processo-inscricao.model';
import { UsuarioService } from '../../../@core/services/usuario.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-usuarios-processos-inscricao',
  templateUrl: './usuarios-processos-inscricao.component.html',
  styleUrls: ['./usuarios-processos-inscricao.component.scss']
})
export class UsuariosProcessosInscricaoComponent implements OnInit {
  idUsuario: number;

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Inscrição Id', disabled: false, maxwidth: 90, cell: (row: UsuarioProcessoInscricaoModel) => `${row.id}` },
    { propriedade: 'processoInscricaoId', titulo: 'Processo Id', disabled: false, maxwidth: 90, cell: (row: UsuarioProcessoInscricaoModel) => `${row.processoInscricaoId}` },
    { propriedade: 'curso', titulo: 'Curso', disabled: false, cell: (row: UsuarioProcessoInscricaoModel) => `${row.curso || ''}` },
    { propriedade: 'cicloAno', titulo: 'Ciclo/Ano', disabled: false, maxwidth: 110, cell: (row: UsuarioProcessoInscricaoModel) => `${row.ciclo || ''}/${row.ano || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 140, cell: (row: UsuarioProcessoInscricaoModel) => this.descricaoStatus(row.status) },
    { propriedade: 'valor', titulo: 'Valor', disabled: false, maxwidth: 90, cell: (row: UsuarioProcessoInscricaoModel) => `${row.valor || 0}` },
    { propriedade: 'dataInscricao', titulo: 'Data Inscrição', disabled: false, maxwidth: 130, cell: (row: UsuarioProcessoInscricaoModel) => this.formatarData(row.dataInscricao) }
  ];

  acoes: DataTableAcoes[] = [];
  dadosTabela: UsuarioProcessoInscricaoModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = Number(params.idUsuario);
      this.buscarProcessosInscricao();
    });
  }

  buscarProcessosInscricao() {
    this.usuarioService.buscarProcessosInscricao(this.idUsuario).subscribe(res => {
      this.dadosTabela = res?.dados || [];
    });
  }

  descricaoStatus(status: string): string {
    if (status === 'CO')
      return 'Confirmada';

    if (status === 'CA')
      return 'Cancelada';

    if (status === 'AG')
      return 'Aguardando Pagamento';

    return status || '';
  }

  formatarData(data: string): string {
    if (!data)
      return '';

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime()))
      return '';

    const dia = `${dataObj.getDate()}`.padStart(2, '0');
    const mes = `${dataObj.getMonth() + 1}`.padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }
}
