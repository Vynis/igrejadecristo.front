import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CongregacaoModel } from '../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../@core/models/lider-pequeno-grupo.model';
import { PequenoGrupoModel } from '../../@core/models/pequeno-grupo.model';
import { UsuarioModel } from '../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../@core/services/pequeno-grupo-admin.service';

@Component({
  selector: 'app-pequenos-grupos',
  templateUrl: './pequenos-grupos.component.html',
  styleUrls: ['./pequenos-grupos.component.scss'],
})
export class PequenosGruposComponent implements OnInit {
  liderForm: FormGroup;
  pgForm: FormGroup;
  usuarios: UsuarioModel[] = [];
  congregacoes: CongregacaoModel[] = [];
  lideres: LiderPequenoGrupoModel[] = [];
  pequenosGrupos: PequenoGrupoModel[] = [];
  editandoLider = false;
  editandoPg = false;

  constructor(
    private fb: FormBuilder,
    private service: PequenoGrupoAdminService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.criarForms();
    this.carregarDadosBase();
    this.carregarLideres();
    this.carregarPequenosGrupos();
  }

  criarForms() {
    this.liderForm = this.fb.group({
      id: [0],
      usuarioId: [null, Validators.required],
      congregacaoId: [null],
      dataInicio: [''],
      dataFim: [''],
      status: ['A', Validators.required],
      observacao: [''],
    });

    this.pgForm = this.fb.group({
      id: [0],
      congregacaoId: [null, Validators.required],
      nome: ['', Validators.required],
      liderPequenoGrupoId: [null, Validators.required],
      coLiderPequenoGrupoId: [null],
      diaSemana: ['', Validators.required],
      horarioReuniao: [''],
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      status: ['A', Validators.required],
    });
  }

  carregarDadosBase() {
    this.service.buscarUsuarios().subscribe(res => {
      if (res.success) {
        this.usuarios = res.dados;
      }
    });

    this.service.buscarCongregacoes().subscribe(res => {
      if (res.success) {
        this.congregacoes = res.dados;
      }
    });
  }

  carregarLideres() {
    this.service.buscarLideres().subscribe(res => {
      if (res.success) {
        this.lideres = res.dados;
      }
    });
  }

  carregarPequenosGrupos() {
    this.service.buscarPequenosGrupos().subscribe(res => {
      if (res.success) {
        this.pequenosGrupos = res.dados;
      }
    });
  }

  salvarLider() {
    if (this.liderForm.invalid) {
      this.liderForm.markAllAsTouched();
      return;
    }

    const lider = this.liderForm.value as LiderPequenoGrupoModel;
    const request = this.editandoLider ? this.service.atualizarLider(lider) : this.service.cadastrarLider(lider);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('Líder salvo com sucesso.');
      this.novoLider();
      this.carregarLideres();
    });
  }

  editarLider(lider: LiderPequenoGrupoModel) {
    this.editandoLider = true;
    this.liderForm.patchValue(lider);
  }

  inativarLider(lider: LiderPequenoGrupoModel) {
    this.service.inativarLider(lider.id).subscribe(res => {
      if (res.success) {
        this.toast.success(res.dados);
        this.carregarLideres();
        return;
      }

      this.toast.error(res.dados);
    });
  }

  novoLider() {
    this.editandoLider = false;
    this.liderForm.reset({ id: 0, status: 'A' });
  }

  salvarPg() {
    if (this.pgForm.invalid) {
      this.pgForm.markAllAsTouched();
      return;
    }

    const pg = this.pgForm.value as PequenoGrupoModel;
    const request = this.editandoPg ? this.service.atualizarPequenoGrupo(pg) : this.service.cadastrarPequenoGrupo(pg);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('PG salvo com sucesso.');
      this.novoPg();
      this.carregarPequenosGrupos();
    });
  }

  editarPg(pg: PequenoGrupoModel) {
    this.editandoPg = true;
    this.pgForm.patchValue(pg);
  }

  novoPg() {
    this.editandoPg = false;
    this.pgForm.reset({ id: 0, status: 'A' });
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
