import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PequenoGrupoMembroModel } from '../../../@core/models/pequeno-grupo-membro.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-membros-lista',
  templateUrl: './membros-lista.component.html',
  styleUrls: ['./membros-lista.component.scss']
})
export class MembrosListaComponent implements OnInit {
  pequenosGrupos: PequenoGrupoModel[] = [];
  dadosTabela: PequenoGrupoMembroModel[] = [];
  pequenoGrupoId: number;

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: PequenoGrupoMembroModel) => `${row.id}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: PequenoGrupoMembroModel) => `${row.nome || ''}` },
    { propriedade: 'pequenoGrupoId', titulo: 'PG', disabled: false, cell: (row: PequenoGrupoMembroModel) => this.nomePg(row.pequenoGrupoId) },
    { propriedade: 'tipo', titulo: 'Tipo', disabled: false, maxwidth: 120, cell: (row: PequenoGrupoMembroModel) => `${row.tipo || ''}` },
    { propriedade: 'telefone', titulo: 'Telefone', disabled: false, maxwidth: 140, cell: (row: PequenoGrupoMembroModel) => `${row.telefone || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: PequenoGrupoMembroModel) => row.status === 'A' ? 'Ativo' : 'Inativo' },
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('pequenosgrupos.membros.editar') },
    { icone: 'close-circle', evento: this.inativar.bind(this), toolTip: 'Inativar', color: 'danger', visivel: () => this.temPermissao('pequenosgrupos.membros.inativar') },
    { icone: 'checkmark-circle', evento: this.reativar.bind(this), toolTip: 'Reativar', color: 'success', visivel: () => this.temPermissao('pequenosgrupos.membros.reativar') },
  ];

  constructor(
    private service: PequenoGrupoAdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissaoService: PermissaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.pequenoGrupoId = params.pgId ? Number(params.pgId) : null;
      this.carregarDadosBase();
    });
  }

  carregarDadosBase() {
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.carregarMembros();
  }

  carregarMembros() {
    this.service.buscarMembros().subscribe(res => {
      if (res.success) {
        const membros = res.dados || [];
        this.dadosTabela = this.pequenoGrupoId ? membros.filter((x: PequenoGrupoMembroModel) => x.pequenoGrupoId === this.pequenoGrupoId) : membros;
      }
    });
  }

  novo() {
    const rota = this.pequenoGrupoId ? `pages/pequenos-grupos/membros/cadastro/add/${this.pequenoGrupoId}` : 'pages/pequenos-grupos/membros/cadastro';
    this.router.navigate([rota]);
  }

  editar(membro: PequenoGrupoMembroModel) {
    this.router.navigate([`pages/pequenos-grupos/membros/cadastro/edit/${membro.id}`]);
  }

  inativar(membro: PequenoGrupoMembroModel) {
    if (membro.status !== 'A') return;
    this.service.inativarMembro(membro.id).subscribe(res => this.aposAcao(res));
  }

  reativar(membro: PequenoGrupoMembroModel) {
    if (membro.status === 'A') return;
    this.service.reativarMembro(membro.id).subscribe(res => this.aposAcao(res));
  }

  nomePg(id: number): string {
    const pg = this.pequenosGrupos.find(x => x.id === id);
    return pg ? pg.nome : `PG ${id}`;
  }

  titulo(): string {
    return this.pequenoGrupoId ? `Membros - ${this.nomePg(this.pequenoGrupoId)}` : 'Membros dos PGs';
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }

  private aposAcao(res: any) {
    res.success ? this.toast.success(res.dados) : this.toast.error(res.dados);
    this.carregarMembros();
  }
}
