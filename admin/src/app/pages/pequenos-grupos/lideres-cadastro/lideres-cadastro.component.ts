import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';
import { UsuarioBuscaDialogComponent } from '../usuario-busca-dialog/usuario-busca-dialog.component';

@Component({
  selector: 'app-lideres-cadastro',
  templateUrl: './lideres-cadastro.component.html',
  styleUrls: ['./lideres-cadastro.component.scss']
})
export class LideresCadastroComponent implements OnInit {
  tituloPagina = 'Cadastro de Líder de PG';
  formulario: FormGroup;
  lider: LiderPequenoGrupoModel;
  usuarios: UsuarioModel[] = [];
  congregacoes: CongregacaoModel[] = [];
  usuarioSelecionado: UsuarioModel;

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
        this.tituloPagina = `Editar Líder de PG - Nº ${id}`;
        this.buscarPorId(id);
        return;
      }

      this.createForm(new LiderPequenoGrupoModel());
    });
  }

  carregarDadosBase() {
    this.service.buscarUsuarios().subscribe(res => {
      if (res.success) {
        this.usuarios = res.dados
          .slice()
          .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
        this.preencherUsuarioSelecionado();
      }
    });
    this.service.buscarCongregacoes().subscribe(res => { if (res.success) this.congregacoes = res.dados; });
  }

  createForm(lider: LiderPequenoGrupoModel) {
    this.lider = lider;
    this.formulario = this.fb.group({
      id: [lider.id || 0],
      usuarioId: [lider.usuarioId || null, Validators.required],
      congregacaoId: [lider.congregacaoId || null],
      dataInicio: [this.toInputDate(lider.dataInicio)],
      dataFim: [this.toInputDate(lider.dataFim)],
      status: [lider.status || 'A', Validators.required],
      observacao: [lider.observacao || ''],
    });

    this.preencherUsuarioSelecionado();
  }

  abrirBuscaUsuario() {
    this.dialogService.open(UsuarioBuscaDialogComponent)
      .onClose.subscribe((usuario: UsuarioModel) => {
        if (!usuario) {
          return;
        }

        this.usuarioSelecionado = usuario;
        this.formulario.patchValue({ usuarioId: usuario.id });
      });
  }

  preencherUsuarioSelecionado() {
    if (!this.formulario || !this.usuarios.length) {
      return;
    }

    const usuarioId = this.formulario.get('usuarioId').value;
    this.usuarioSelecionado = this.usuarios.find(x => x.id === usuarioId);
  }

  buscarPorId(id: number) {
    this.service.buscarLiderPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error('Erro ao buscar dados do líder');
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

    const model = this.formulario.value as LiderPequenoGrupoModel;
    const request = model.id > 0 ? this.service.atualizarLider(model) : this.service.cadastrarLider(model);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('Líder salvo com sucesso.');
      this.router.navigateByUrl('/pages/pequenos-grupos/lideres/lista');
    });
  }

  private toInputDate(data: any): string {
    if (!data) return '';
    const valorData = new Date(data);
    if (Number.isNaN(valorData.getTime())) return '';
    const ano = valorData.getFullYear();
    const mes = `${valorData.getMonth() + 1}`.padStart(2, '0');
    const dia = `${valorData.getDate()}`.padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
