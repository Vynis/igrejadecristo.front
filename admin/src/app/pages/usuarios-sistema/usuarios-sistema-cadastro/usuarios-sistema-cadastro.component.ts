import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PerfilModel } from '../../../@core/models/perfil.model';
import { UsuarioSistemaModel } from '../../../@core/models/usuario-sistema.model';
import { UsuarioSistemaService } from '../../../@core/services/usuario-sistema.service';

@Component({
  selector: 'app-usuarios-sistema-cadastro',
  templateUrl: './usuarios-sistema-cadastro.component.html',
  styleUrls: ['./usuarios-sistema-cadastro.component.scss']
})
export class UsuariosSistemaCadastroComponent implements OnInit {
  tituloPagina: string = 'Cadastro de Usuário do Sistema';
  formulario: FormGroup;
  usuario: UsuarioSistemaModel;
  perfis: PerfilModel[] = [];
  existeErro: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioSistemaService: UsuarioSistemaService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarPerfis();

    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Usuário do Sistema - Nº ${id}`;
        this.buscaPorId(id);
      }
      else {
        const novoUsuario = new UsuarioSistemaModel();
        this.createForm(novoUsuario);
      }
    });
  }

  carregarPerfis() {
    this.usuarioSistemaService.obterPerfis().subscribe(res => {
      if (res && res.success)
        this.perfis = res.dados;
    });
  }

  createForm(_usuario: UsuarioSistemaModel) {
    this.usuario = _usuario;

    this.formulario = this.fb.group({
      id: [this.usuario.id, [Validators.required]],
      nome: [this.usuario.nome, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      status: [this.usuario.status, [Validators.required]],
      perfilIds: [this.usuario.perfilIds || [], [Validators.required]]
    });
  }

  validacao(): boolean {
    this.existeErro = false;
    const controls = this.formulario.controls;

    if (this.formulario.invalid || !controls.perfilIds.value || controls.perfilIds.value.length === 0) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAllAsTouched());
      this.existeErro = true;
      return false;
    }

    return true;
  }

  prepararModel(): UsuarioSistemaModel {
    const controls = this.formulario.controls;
    const model = new UsuarioSistemaModel();

    model.id = this.usuario.id;
    model.nome = controls.nome.value;
    model.email = controls.email.value;
    model.status = controls.status.value;
    model.perfilIds = controls.perfilIds.value;
    model.usuarioPerfis = model.perfilIds.map(perfilId => ({ perfilId }));

    return model;
  }

  salvar() {
    if (this.validacao() === false)
      return;

    const model = this.prepararModel();

    if (model.id > 0) {
      this.atualizar(model);
      return;
    }

    this.adcionar(model);
  }

  adcionar(model: UsuarioSistemaModel) {
    this.usuarioSistemaService.adicionar(model).subscribe((result: any) => {
      if (!result || !result.success) {
        this.toast.error(result && result.dados ? result.dados : 'Erro ao realizar o cadastro');
        return;
      }

      this.toast.success('Cadastro realizado com sucesso! Senha inicial: 123456');
      this.router.navigateByUrl('/pages/usuarios-sistema/lista');
    });
  }

  atualizar(model: UsuarioSistemaModel) {
    this.usuarioSistemaService.atualizar(model).subscribe((result: any) => {
      if (!result || !result.success) {
        this.toast.error(result && result.dados ? result.dados : 'Erro ao realizar atualização');
        return;
      }

      this.toast.success('Atualização realizada com sucesso!');
      this.router.navigateByUrl('/pages/usuarios-sistema/lista');
    });
  }

  buscaPorId(id: number) {
    this.usuarioSistemaService.obterPorId(id).subscribe(
      res => {
        if (!res.success) {
          this.toast.error('Erro a buscar dados!');
          return;
        }

        this.createForm(res.dados);
      }
    );
  }
}
