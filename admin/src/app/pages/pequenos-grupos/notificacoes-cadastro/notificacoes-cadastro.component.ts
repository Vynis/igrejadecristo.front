import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { NotificacaoLiderPgModel } from '../../../@core/models/notificacao-lider-pg.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';

@Component({
  selector: 'app-notificacoes-cadastro',
  templateUrl: './notificacoes-cadastro.component.html',
  styleUrls: ['./notificacoes-cadastro.component.scss']
})
export class NotificacoesCadastroComponent implements OnInit {
  tituloPagina = 'Cadastro de Notificação';
  formulario: FormGroup;
  notificacao: NotificacaoLiderPgModel;
  congregacoes: CongregacaoModel[] = [];
  pequenosGrupos: PequenoGrupoModel[] = [];
  lideres: LiderPequenoGrupoModel[] = [];
  usuarios: UsuarioModel[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PequenoGrupoAdminService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarDadosBase();
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Notificação - Nº ${id}`;
        this.buscarPorId(id);
        return;
      }

      this.createForm(new NotificacaoLiderPgModel());
    });
  }

  carregarDadosBase() {
    this.service.buscarCongregacoes().subscribe(res => { if (res.success) this.congregacoes = res.dados; });
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.service.buscarLideres().subscribe(res => { if (res.success) this.lideres = res.dados; });
    this.service.buscarUsuarios().subscribe(res => { if (res.success) this.usuarios = res.dados; });
  }

  createForm(notificacao: NotificacaoLiderPgModel) {
    this.notificacao = notificacao;
    this.formulario = this.fb.group({
      id: [notificacao.id || 0],
      titulo: [notificacao.titulo || '', Validators.required],
      mensagem: [notificacao.mensagem || '', Validators.required],
      tipo: [notificacao.tipo || 'Aviso', Validators.required],
      link: [notificacao.link || ''],
      dataInicio: [this.toInputDate(notificacao.dataInicio)],
      dataFim: [this.toInputDate(notificacao.dataFim)],
      congregacaoId: [notificacao.congregacaoId || null],
      pequenoGrupoId: [notificacao.pequenoGrupoId || null],
      liderPequenoGrupoId: [notificacao.liderPequenoGrupoId || null],
      status: [notificacao.status || 'A', Validators.required],
    });
  }

  buscarPorId(id: number) {
    this.service.buscarNotificacaoPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error('Erro ao buscar dados da notificação');
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

    const model = this.formulario.value as NotificacaoLiderPgModel;
    const request = model.id > 0 ? this.service.atualizarNotificacao(model) : this.service.cadastrarNotificacao(model);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('Notificação salva com sucesso.');
      this.router.navigateByUrl('/pages/pequenos-grupos/notificacoes/lista');
    });
  }

  nomeLider(lider: LiderPequenoGrupoModel): string {
    const usuario = this.usuarios.find(x => x.id === lider.usuarioId);
    return usuario ? usuario.nome : `Líder ${lider.id}`;
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
