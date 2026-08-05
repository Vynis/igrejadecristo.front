import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PerfilModel } from '../../@core/models/perfil.model';
import { PermissaoModel } from '../../@core/models/permissao.model';
import { PermissoesAdminService } from '../../@core/services/permissoes-admin.service';

@Component({
  selector: 'app-permissoes',
  templateUrl: './permissoes.component.html',
  styleUrls: ['./permissoes.component.scss']
})
export class PermissoesComponent implements OnInit {

  perfis: PerfilModel[] = [];
  permissoes: PermissaoModel[] = [];
  perfilId: number;
  permissoesSelecionadas: number[] = [];
  carregando = false;
  salvando = false;

  constructor(
    private permissoesAdminService: PermissoesAdminService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;

    this.permissoesAdminService.obterPerfis().subscribe(perfisResult => {
      this.perfis = perfisResult.dados || [];

      this.permissoesAdminService.obterPermissoes().subscribe(permissoesResult => {
        this.permissoes = permissoesResult.dados || [];
        this.carregando = false;
      }, () => {
        this.carregando = false;
        this.toast.error('Erro ao carregar permissões');
      });
    }, () => {
      this.carregando = false;
      this.toast.error('Erro ao carregar perfis');
    });
  }

  selecionarPerfil(perfilId: number) {
    this.perfilId = perfilId;
    this.permissoesSelecionadas = [];

    if (!perfilId)
      return;

    this.carregando = true;

    this.permissoesAdminService.obterPermissoesPerfil(perfilId).subscribe(result => {
      this.permissoesSelecionadas = result.dados || [];
      this.carregando = false;
    }, () => {
      this.carregando = false;
      this.toast.error('Erro ao carregar permissões do perfil');
    });
  }

  permissaoMarcada(permissaoId: number): boolean {
    return this.permissoesSelecionadas.includes(permissaoId);
  }

  alterarPermissao(permissaoId: number, marcado: boolean) {
    if (marcado) {
      if (!this.permissaoMarcada(permissaoId))
        this.permissoesSelecionadas.push(permissaoId);

      return;
    }

    this.permissoesSelecionadas = this.permissoesSelecionadas.filter(x => x !== permissaoId);
  }

  salvar() {
    if (!this.perfilId) {
      this.toast.warning('Selecione um perfil');
      return;
    }

    this.salvando = true;

    this.permissoesAdminService.salvarPermissoesPerfil(this.perfilId, this.permissoesSelecionadas).subscribe(result => {
      this.salvando = false;

      if (!result || !result.success) {
        this.toast.error('Erro ao salvar permissões');
        return;
      }

      this.toast.success('Permissões atualizadas com sucesso!');
    }, () => {
      this.salvando = false;
      this.toast.error('Erro ao salvar permissões');
    });
  }
}
