import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificacaoLiderPgModel } from '../../../@core/models/notificacao-lider-pg.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-notificacoes-lista',
  templateUrl: './notificacoes-lista.component.html',
  styleUrls: ['./notificacoes-lista.component.scss']
})
export class NotificacoesListaComponent implements OnInit {
  dadosTabela: NotificacaoLiderPgModel[] = [];

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: NotificacaoLiderPgModel) => `${row.id}` },
    { propriedade: 'titulo', titulo: 'Título', disabled: false, cell: (row: NotificacaoLiderPgModel) => `${row.titulo || ''}` },
    { propriedade: 'tipo', titulo: 'Tipo', disabled: false, maxwidth: 120, cell: (row: NotificacaoLiderPgModel) => `${row.tipo || 'Aviso'}` },
    { propriedade: 'dataInicio', titulo: 'Início', disabled: false, maxwidth: 110, cell: (row: NotificacaoLiderPgModel) => this.formatarData(row.dataInicio) },
    { propriedade: 'dataFim', titulo: 'Fim', disabled: false, maxwidth: 110, cell: (row: NotificacaoLiderPgModel) => this.formatarData(row.dataFim) },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: NotificacaoLiderPgModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('pequenosgrupos.notificacoes.editar') },
    { icone: 'block', evento: this.inativar.bind(this), toolTip: 'Inativar', color: 'warn', visivel: () => this.temPermissao('pequenosgrupos.notificacoes.inativar') }
  ];

  constructor(
    private service: PequenoGrupoAdminService,
    private permissaoService: PermissaoService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.buscarNotificacoes().subscribe(res => {
      if (res.success) this.dadosTabela = res.dados;
    });
  }

  editar(notificacao: NotificacaoLiderPgModel) {
    this.router.navigate([`pages/pequenos-grupos/notificacoes/cadastro/edit/${notificacao.id}`]);
  }

  inativar(notificacao: NotificacaoLiderPgModel) {
    if (notificacao.status !== 'A') return;

    if (!confirm(`Deseja inativar a notificação ${notificacao.titulo}?`)) return;

    this.service.inativarNotificacao(notificacao.id).subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success(res.dados);
      this.carregar();
    });
  }

  formatarData(data: Date): string {
    if (!data) return '-';
    const valorData = new Date(data);
    if (Number.isNaN(valorData.getTime())) return '-';
    return valorData.toLocaleDateString('pt-BR');
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }
}
