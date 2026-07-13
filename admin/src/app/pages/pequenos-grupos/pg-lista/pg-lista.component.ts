import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-pg-lista',
  templateUrl: './pg-lista.component.html',
  styleUrls: ['./pg-lista.component.scss']
})
export class PgListaComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  congregacoes: CongregacaoModel[] = [];
  lideres: LiderPequenoGrupoModel[] = [];
  dadosTabela: PequenoGrupoModel[] = [];

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: PequenoGrupoModel) => `${row.id}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: PequenoGrupoModel) => `${row.nome || ''}` },
    { propriedade: 'congregacaoId', titulo: 'Congregação', disabled: false, cell: (row: PequenoGrupoModel) => this.nomeCongregacao(row.congregacaoId) },
    { propriedade: 'liderPequenoGrupoId', titulo: 'Líder', disabled: false, cell: (row: PequenoGrupoModel) => this.nomeLider(row.liderPequenoGrupoId) },
    { propriedade: 'diaSemana', titulo: 'Dia', disabled: false, maxwidth: 130, cell: (row: PequenoGrupoModel) => `${row.diaSemana || ''}` },
    { propriedade: 'horarioReuniao', titulo: 'Horário', disabled: false, maxwidth: 90, cell: (row: PequenoGrupoModel) => `${row.horarioReuniao || ''}` },
    { propriedade: 'bairro', titulo: 'Bairro', disabled: false, cell: (row: PequenoGrupoModel) => `${row.bairro || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: PequenoGrupoModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary' }
  ];

  constructor(
    private service: PequenoGrupoAdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarDadosBase();
  }

  carregarDadosBase() {
    this.service.buscarUsuarios().subscribe(res => {
      if (res.success) this.usuarios = res.dados;
      this.carregarPequenosGrupos();
    });

    this.service.buscarCongregacoes().subscribe(res => {
      if (res.success) this.congregacoes = res.dados;
    });

    this.service.buscarLideres().subscribe(res => {
      if (res.success) this.lideres = res.dados;
    });
  }

  carregarPequenosGrupos() {
    this.service.buscarPequenosGrupos().subscribe(res => {
      if (res.success) this.dadosTabela = res.dados;
    });
  }

  editar(pg: PequenoGrupoModel) {
    this.router.navigate([`pages/pequenos-grupos/pg/cadastro/edit/${pg.id}`]);
  }

  nomeUsuario(id: number): string {
    const usuario = this.usuarios.find(x => x.id === id);
    return usuario ? usuario.nome : `Usuário ${id}`;
  }

  nomeCongregacao(id: number): string {
    const congregacao = this.congregacoes.find(x => x.id === id);
    return congregacao ? congregacao.nome : `Congregação ${id}`;
  }

  nomeLider(id: number): string {
    const lider = this.lideres.find(x => x.id === id);
    return lider ? this.nomeUsuario(lider.usuarioId) : `Líder ${id}`;
  }
}
