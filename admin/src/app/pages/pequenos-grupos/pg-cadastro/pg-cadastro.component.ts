import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { LiderBuscaDialogComponent } from '../lider-busca-dialog/lider-busca-dialog.component';

@Component({
  selector: 'app-pg-cadastro',
  templateUrl: './pg-cadastro.component.html',
  styleUrls: ['./pg-cadastro.component.scss']
})
export class PgCadastroComponent implements OnInit {
  tituloPagina = 'Cadastro de Pequeno Grupo';
  formulario: FormGroup;
  pg: PequenoGrupoModel;
  usuarios: UsuarioModel[] = [];
  congregacoes: CongregacaoModel[] = [];
  lideres: LiderPequenoGrupoModel[] = [];
  liderSelecionado: LiderPequenoGrupoModel;
  coLiderSelecionado: LiderPequenoGrupoModel;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PequenoGrupoAdminService,
    private toast: ToastrService,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit() {
    this.carregarDadosBase();
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Pequeno Grupo - Nº ${id}`;
        this.buscarPorId(id);
        return;
      }

      this.createForm(new PequenoGrupoModel());
    });
  }

  carregarDadosBase() {
    this.service.buscarUsuarios().subscribe(res => {
      if (res.success) {
        this.usuarios = res.dados
          .slice()
          .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        this.preencherLideresSelecionados();
      }
    });
    this.service.buscarCongregacoes().subscribe(res => { if (res.success) this.congregacoes = res.dados; });
    this.service.buscarLideres().subscribe(res => {
      if (res.success) {
        this.lideres = res.dados.filter(x => x.status === 'A');
        this.preencherLideresSelecionados();
      }
    });
  }

  createForm(pg: PequenoGrupoModel) {
    this.pg = pg;
    this.formulario = this.fb.group({
      id: [pg.id || 0],
      congregacaoId: [pg.congregacaoId || null, Validators.required],
      nome: [pg.nome || '', Validators.required],
      liderPequenoGrupoId: [pg.liderPequenoGrupoId || null, Validators.required],
      coLiderPequenoGrupoId: [pg.coLiderPequenoGrupoId || null],
      diaSemana: [pg.diaSemana || '', Validators.required],
      horarioReuniao: [pg.horarioReuniao || ''],
      cep: [pg.cep || ''],
      endereco: [pg.endereco || ''],
      numero: [pg.numero || ''],
      complemento: [pg.complemento || ''],
      bairro: [pg.bairro || ''],
      cidade: [pg.cidade || ''],
      estado: [pg.estado || ''],
      status: [pg.status || 'A', Validators.required],
    });

    this.preencherLideresSelecionados();
  }

  abrirBuscaLider(campo: string) {
    this.dialogService.open(LiderBuscaDialogComponent)
      .onClose.subscribe((lider: LiderPequenoGrupoModel) => {
        if (!lider) {
          return;
        }

        if (campo === 'coLider') {
          this.coLiderSelecionado = lider;
          this.formulario.patchValue({ coLiderPequenoGrupoId: lider.id });
          return;
        }

        this.liderSelecionado = lider;
        this.formulario.patchValue({ liderPequenoGrupoId: lider.id });
      });
  }

  limparCoLider() {
    this.coLiderSelecionado = null;
    this.formulario.patchValue({ coLiderPequenoGrupoId: null });
  }

  preencherLideresSelecionados() {
    if (!this.formulario || !this.lideres.length) {
      return;
    }

    const liderId = this.formulario.get('liderPequenoGrupoId').value;
    const coLiderId = this.formulario.get('coLiderPequenoGrupoId').value;
    this.liderSelecionado = this.lideres.find(x => x.id === liderId);
    this.coLiderSelecionado = this.lideres.find(x => x.id === coLiderId);
  }

  buscarPorId(id: number) {
    this.service.buscarPequenoGrupoPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error('Erro ao buscar dados do PG');
        return;
      }

      this.createForm(res.dados);
    });
  }

  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const model = this.formulario.value as PequenoGrupoModel;
    const request = model.id > 0 ? this.service.atualizarPequenoGrupo(model) : this.service.cadastrarPequenoGrupo(model);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('PG salvo com sucesso.');
      this.router.navigateByUrl('/pages/pequenos-grupos/pg/lista');
    });
  }

  nomeUsuario(id: number): string {
    const usuario = this.usuarios.find(x => x.id === id);
    return usuario ? usuario.nome : `Usuário ${id}`;
  }

  nomeLider(lider: LiderPequenoGrupoModel): string {
    return lider ? this.nomeUsuario(lider.usuarioId) : '';
  }
}
