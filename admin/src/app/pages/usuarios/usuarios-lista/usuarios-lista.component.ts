import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FiltroItemModel } from '../../../@core/models/filtroItem.model';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { GridStateService } from '../../../@core/services/grid-state.service';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { UsuarioService } from '../../../@core/services/usuario.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.scss']
})
export class UsuariosListaComponent implements OnInit {
  private readonly gridStateKey = 'usuarios-lista';

  @ViewChild('filtroNome', { static: true }) filtroNome: ElementRef;
  @ViewChild('filtroEmail', { static: true }) filtroEmail: ElementRef;
  @ViewChild('filtroStatus', { static: true }) filtroStatus: ElementRef;

  colunas: DataTableColunas[] = [
    { propriedade: 'id', titulo: 'Id', disabled: false, maxwidth: 70, cell: (row: UsuarioModel) => `${row.id}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: UsuarioModel) => `${row.nome || ''}` },
    { propriedade: 'email', titulo: 'Email', disabled: false, cell: (row: UsuarioModel) => `${row.email || ''}` },
    { propriedade: 'cpf', titulo: 'CPF', disabled: false, maxwidth: 120, cell: (row: UsuarioModel) => `${row.cpf || ''}` },
    { propriedade: 'telefoneCelular', titulo: 'Celular', disabled: false, maxwidth: 130, cell: (row: UsuarioModel) => `${row.telefoneCelular || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 90, cell: (row: UsuarioModel) => row.status === 'A' ? 'Ativo' : 'Inativo' }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'assignment', evento: this.visualizarProcessosInscricao.bind(this), toolTip: 'Visualizar processos de inscrição', color: 'primary', visivel: () => this.temPermissao('alunos.visualizar_inscricoes') },
    { icone: 'create', evento: this.editar.bind(this), toolTip: 'Editar', color: 'primary', visivel: () => this.temPermissao('alunos.editar') },
    { icone: 'refresh', evento: this.resetarSenha.bind(this), toolTip: 'Resetar senha para 123456', color: 'warn', visivel: () => this.temPermissao('alunos.resetar_senha') }
  ];

  dadosTabela: UsuarioModel[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private permissaoService: PermissaoService,
    private gridStateService: GridStateService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    if (!this.restaurarEstadoGrid())
      this.obterDadosGrid();
  }

  obterDadosGrid() {
    const parametros = new PaginationfilterModel();
    parametros.filtro = this.prepararFiltro();

    this.usuarioService.obterDadosFiltro(parametros).subscribe(res => {
      this.dadosTabela = res.dados;
      this.salvarEstadoGrid();
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

  editar(usuario: UsuarioModel) {
    this.router.navigate([`pages/usuarios/cadastro/edit/${usuario.id}`]);
  }

  visualizarProcessosInscricao(usuario: UsuarioModel) {
    this.router.navigate([`pages/usuarios/processos-inscricao/${usuario.id}`]);
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }

  resetarSenha(usuario: UsuarioModel) {
    const confirmar = confirm(`Deseja resetar a senha do aluno ${usuario.nome} para 123456?`);

    if (!confirmar)
      return;

    this.usuarioService.resetarSenha(usuario.id).subscribe(result => {
      if (!result || !result.success) {
        this.toast.error('Erro ao resetar senha do aluno');
        return;
      }

      this.toast.success('Senha resetada para 123456 com sucesso!');
    });
  }

  private salvarEstadoGrid() {
    this.gridStateService.set<UsuarioModel>(this.gridStateKey, {
      filters: {
        nome: this.filtroNome.nativeElement.value,
        email: this.filtroEmail.nativeElement.value,
        status: this.filtroStatus.nativeElement.value
      },
      data: this.dadosTabela
    });
  }

  private restaurarEstadoGrid(): boolean {
    const estado = this.gridStateService.get<UsuarioModel>(this.gridStateKey);

    if (!estado)
      return false;

    this.filtroNome.nativeElement.value = estado.filters?.nome || '';
    this.filtroEmail.nativeElement.value = estado.filters?.email || '';
    this.filtroStatus.nativeElement.value = estado.filters?.status || '';
    this.dadosTabela = estado.data || [];

    return true;
  }
}
