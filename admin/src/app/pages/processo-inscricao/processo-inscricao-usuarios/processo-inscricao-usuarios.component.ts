import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProcessoInscricaoUsuarioModel } from '../../../@core/models/processo-inscricao-usuario.model';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-processo-inscricao-usuarios',
  templateUrl: './processo-inscricao-usuarios.component.html',
  styleUrls: ['./processo-inscricao-usuarios.component.scss']
})
export class ProcessoInscricaoUsuariosComponent implements OnInit {
  idProcessoInscricao: number;

  colunas: DataTableColunas[] = [
    { propriedade: 'usuarioId', titulo: 'Aluno Id', disabled: false, maxwidth: 90, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.usuarioId}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.nome || ''}` },
    { propriedade: 'email', titulo: 'Email', disabled: false, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.email || ''}` },
    { propriedade: 'cpf', titulo: 'CPF', disabled: false, maxwidth: 130, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.cpf || ''}` },
    { propriedade: 'telefoneCelular', titulo: 'Celular', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.telefoneCelular || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => this.descricaoStatus(row.status) },
    { propriedade: 'statusEstudo', titulo: 'Resultado', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => this.descricaoStatusEstudo(row.statusEstudo) },
    { propriedade: 'dataInscricao', titulo: 'Data Inscrição', disabled: false, maxwidth: 150, cell: (row: ProcessoInscricaoUsuarioModel) => this.formatarData(row.dataInscricao) }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'check_circle', evento: this.aprovar.bind(this), toolTip: 'Lançar aprovado', color: 'primary', visivel: row => row.statusEstudo !== 'AP' && this.temPermissao('processoinscricao.lancar_resultado') },
    { icone: 'cancel', evento: this.reprovar.bind(this), toolTip: 'Lançar reprovado', color: 'warn', visivel: row => row.statusEstudo !== 'RE' && this.temPermissao('processoinscricao.lancar_resultado') }
  ];
  dadosTabela: ProcessoInscricaoUsuarioModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private processoInscricaoService: ProcessoInscricaoService,
    private permissaoService: PermissaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idProcessoInscricao = Number(params.idProcessoInscricao);
      this.buscarUsuariosInscritos();
    });
  }

  buscarUsuariosInscritos() {
    this.processoInscricaoService.buscarUsuariosInscritos(this.idProcessoInscricao).subscribe(res => {
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

  descricaoStatusEstudo(statusEstudo: string): string {
    if (statusEstudo === 'AP')
      return 'Aprovado';

    if (statusEstudo === 'RE')
      return 'Reprovado';

    return 'Não lançado';
  }

  aprovar(inscricao: ProcessoInscricaoUsuarioModel) {
    this.alterarStatusEstudo(inscricao, 'AP');
  }

  reprovar(inscricao: ProcessoInscricaoUsuarioModel) {
    this.alterarStatusEstudo(inscricao, 'RE');
  }

  alterarStatusEstudo(inscricao: ProcessoInscricaoUsuarioModel, statusEstudo: string) {
    const descricao = statusEstudo === 'AP' ? 'aprovado' : 'reprovado';
    const confirmar = confirm(`Deseja lançar ${descricao} para ${inscricao.nome}?`);

    if (!confirmar)
      return;

    this.processoInscricaoService.alterarStatusEstudo(inscricao.id, statusEstudo).subscribe(res => {
      if (!res || !res.success) {
        this.toast.error('Erro ao lançar resultado');
        return;
      }

      this.toast.success('Resultado lançado com sucesso!');
      this.buscarUsuariosInscritos();
    });
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

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }
}
