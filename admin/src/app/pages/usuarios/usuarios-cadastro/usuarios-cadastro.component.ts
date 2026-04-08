import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { UsuarioService } from '../../../@core/services/usuario.service';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.scss']
})
export class UsuariosCadastroComponent implements OnInit {
  tituloPagina: string = 'Cadastro de Usuários';
  formulario: FormGroup;
  usuario: UsuarioModel;
  existeErro: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Usuário - Nº ${id}`;
        this.buscaPorId(id);
      }
      else {
        const novoUsuario = new UsuarioModel();
        this.createForm(novoUsuario);
      }
    });
  }

  createForm(_usuario: UsuarioModel) {
    this.usuario = _usuario;

    this.formulario = this.fb.group({
      id: [this.usuario.id, [Validators.required]],
      nome: [this.usuario.nome, [Validators.required]],
      email: [this.usuario.email],
      cpf: [this.usuario.cpf, [Validators.required]],
      telefoneCelular: [this.usuario.telefoneCelular],
      status: [this.usuario.status, [Validators.required]],
      tipoAcesso: [this.usuario.tipoAcesso],
      dataNascimento: [this.toInputDate(this.usuario.dataNascimento)],
      congregacaoId: [this.usuario.congregacaoId || 1, [Validators.required]],
      cidade: [this.usuario.cidade],
      estado: [this.usuario.estado],
      bairro: [this.usuario.bairro],
      rua: [this.usuario.rua],
      numero: [this.usuario.numero],
      complemento: [this.usuario.complemento],
      cep: [this.usuario.cep]
    });
  }

  validacao(): boolean {
    this.existeErro = false;
    const controls = this.formulario.controls;

    if (this.formulario.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAllAsTouched());
      this.existeErro = true;
      return false;
    }

    return true;
  }

  prepararModel(): UsuarioModel {
    const controls = this.formulario.controls;
    const model = new UsuarioModel();

    model.id = this.usuario.id;
    model.nome = controls.nome.value;
    model.email = controls.email.value;
    model.cpf = controls.cpf.value;
    model.telefoneCelular = controls.telefoneCelular.value;
    model.status = controls.status.value;
    model.tipoAcesso = controls.tipoAcesso.value;
    model.dataNascimento = controls.dataNascimento.value || null;
    model.congregacaoId = Number(controls.congregacaoId.value);
    model.cidade = controls.cidade.value;
    model.estado = controls.estado.value;
    model.bairro = controls.bairro.value;
    model.rua = controls.rua.value;
    model.numero = controls.numero.value;
    model.complemento = controls.complemento.value;
    model.cep = controls.cep.value;
    model.senha = this.usuario.id > 0 ? this.usuario.senha : '123456';

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

  adcionar(model: UsuarioModel) {
    this.usuarioService.adicionar(model).subscribe((result: any) => {
      if (!result || !result.success) {
        this.toast.error('Erro ao realizar o cadastro');
        return;
      }

      this.toast.success('Cadastro realizado com sucesso!');
      this.router.navigateByUrl('/pages/usuarios/lista');
    });
  }

  atualizar(model: UsuarioModel) {
    this.usuarioService.atualizar(model).subscribe((result: any) => {
      if (!result || !result.success) {
        this.toast.error('Erro ao realizar atualização');
        return;
      }

      this.toast.success('Atualização realizada com sucesso!');
      this.router.navigateByUrl('/pages/usuarios/lista');
    });
  }

  buscaPorId(id: number) {
    this.usuarioService.obterPorId(id).subscribe(
      res => {
        if (!res.success) {
          this.toast.error('Erro a buscar dados!');
          return;
        }

        this.createForm(res.dados);
      }
    )
  }

  private toInputDate(data: any): string {
    if (!data)
      return '';

    const valorData = new Date(data);

    if (Number.isNaN(valorData.getTime()))
      return '';

    const ano = valorData.getFullYear();
    const mes = `${valorData.getMonth() + 1}`.padStart(2, '0');
    const dia = `${valorData.getDate()}`.padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
}
