import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-lideres-lista',
  templateUrl: './lideres-lista.component.html',
  styleUrls: ['./lideres-lista.component.scss']
})
export class LideresListaComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  congregacoes: CongregacaoModel[] = [];
  dadosTabela: LiderPequenoGrupoModel[] = [];

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: LiderPequenoGrupoModel) => `${row.id}` },
    { propriedade: 'usuarioId', titulo: 'Usuário', disabled: false, cell: (row: LiderPequenoGrupoModel) => this.nomeUsuario(row.usuarioId) },
    { propriedade: 'congregacaoId', titulo: 'Congregação', disabled: false, cell: (row: LiderPequenoGrupoModel) => row.congregacaoId ? this.nomeCongregacao(row.congregacaoId) : '-' },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: LiderPequenoGrupoModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary' },
    { icone: 'block', evento: this.inativar.bind(this), toolTip: 'Inativar', color: 'warn' }
  ];

  constructor(
    private service: PequenoGrupoAdminService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.carregarDadosBase();
  }

  carregarDadosBase() {
    this.service.buscarUsuarios().subscribe(res => { if (res.success) this.usuarios = res.dados; });
    this.service.buscarCongregacoes().subscribe(res => { if (res.success) this.congregacoes = res.dados; });
    this.carregarLideres();
  }

  carregarLideres() {
    this.service.buscarLideres().subscribe(res => { if (res.success) this.dadosTabela = res.dados; });
  }

  editar(lider: LiderPequenoGrupoModel) {
    this.router.navigate([`pages/pequenos-grupos/lideres/cadastro/edit/${lider.id}`]);
  }

  inativar(lider: LiderPequenoGrupoModel) {
    if (lider.status !== 'A') return;

    if (!confirm(`Deseja inativar o líder ${this.nomeUsuario(lider.usuarioId)}?`)) return;

    this.service.inativarLider(lider.id).subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success(res.dados);
      this.carregarLideres();
    });
  }

  nomeUsuario(id: number): string {
    const usuario = this.usuarios.find(x => x.id === id);
    return usuario ? usuario.nome : `Usuário ${id}`;
  }

  nomeCongregacao(id: number): string {
    const congregacao = this.congregacoes.find(x => x.id === id);
    return congregacao ? congregacao.nome : `Congregação ${id}`;
  }
}
