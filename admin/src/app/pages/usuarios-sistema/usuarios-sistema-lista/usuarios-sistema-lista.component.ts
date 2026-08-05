import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FiltroItemModel } from '../../../@core/models/filtroItem.model';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { UsuarioSistemaModel } from '../../../@core/models/usuario-sistema.model';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { UsuarioSistemaService } from '../../../@core/services/usuario-sistema.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-usuarios-sistema-lista',
  templateUrl: './usuarios-sistema-lista.component.html',
  styleUrls: ['./usuarios-sistema-lista.component.scss']
})
export class UsuariosSistemaListaComponent implements OnInit {

  @ViewChild('filtroNome', { static: true }) filtroNome: ElementRef;
  @ViewChild('filtroEmail', { static: true }) filtroEmail: ElementRef;
  @ViewChild('filtroStatus', { static: true }) filtroStatus: ElementRef;

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: UsuarioSistemaModel) => `${row.id}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: UsuarioSistemaModel) => `${row.nome || ''}` },
    { propriedade: 'email', titulo: 'Email', disabled: false, cell: (row: UsuarioSistemaModel) => `${row.email || ''}` },
    { propriedade: 'perfis', titulo: 'Perfis', disabled: false, cell: (row: UsuarioSistemaModel) => (row.perfis || []).join(', ') },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: UsuarioSistemaModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('usuariosistema.editar') },
    { icone: 'refresh', evento: this.resetarSenha.bind(this), toolTip: 'Resetar senha para 123456', color: 'warn', visivel: () => this.temPermissao('usuariosistema.resetar_senha') }
  ];

  dadosTabela: UsuarioSistemaModel[] = [];

  constructor(
    private usuarioSistemaService: UsuarioSistemaService,
    private permissaoService: PermissaoService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.obterDadosGrid();
  }

  obterDadosGrid() {
    const parametros = new PaginationfilterModel();
    parametros.filtro = this.prepararFiltro();

    this.usuarioSistemaService.obterDadosFiltro(parametros).subscribe(res => {
      this.dadosTabela = res.dados;
    });
  }

  prepararFiltro(): FiltroItemModel[] {
    const listaFiltro: FiltroItemModel[] = [];

    if (this.filtroNome.nativeElement.value !== '')
      listaFiltro.push({ property: 'Nome', filterType: 'contains', value: this.filtroNome.nativeElement.value });

    if (this.filtroEmail.nativeElement.value !== '')
      listaFiltro.push({ property: 'Email', filterType: 'contains', value: this.filtroEmail.nativeElement.value });

    if (this.filtroStatus.nativeElement.value !== '')
      listaFiltro.push({ property: 'Status', filterType: 'equals', value: this.filtroStatus.nativeElement.value });

    return listaFiltro;
  }

  editar(usuario: UsuarioSistemaModel) {
    this.router.navigate([`pages/usuarios-sistema/cadastro/edit/${usuario.id}`]);
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }

  resetarSenha(usuario: UsuarioSistemaModel) {
    const confirmar = confirm(`Deseja resetar a senha do usuário ${usuario.nome} para 123456?`);

    if (!confirmar)
      return;

    this.usuarioSistemaService.resetarSenha(usuario.id).subscribe(result => {
      if (!result || !result.success) {
        this.toast.error('Erro ao resetar senha do usuário do sistema');
        return;
      }

      this.toast.success('Senha resetada para 123456 com sucesso!');
    });
  }
}
