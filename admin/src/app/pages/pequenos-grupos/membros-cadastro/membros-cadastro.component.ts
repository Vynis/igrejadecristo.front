import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PequenoGrupoMembroModel } from '../../../@core/models/pequeno-grupo-membro.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';

@Component({
  selector: 'app-membros-cadastro',
  templateUrl: './membros-cadastro.component.html',
  styleUrls: ['./membros-cadastro.component.scss']
})
export class MembrosCadastroComponent implements OnInit {
  tituloPagina = 'Cadastro de Membro de PG';
  formulario: FormGroup;
  membro: PequenoGrupoMembroModel;
  pequenosGrupos: PequenoGrupoModel[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PequenoGrupoAdminService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Membro de PG - Nº ${id}`;
        this.buscarPorId(id);
        return;
      }

      const membro = new PequenoGrupoMembroModel();
      membro.pequenoGrupoId = params.pgId ? Number(params.pgId) : null;
      this.createForm(membro);
    });
  }

  createForm(membro: PequenoGrupoMembroModel) {
    this.membro = membro;
    this.formulario = this.fb.group({
      id: [membro.id || 0],
      pequenoGrupoId: [membro.pequenoGrupoId || null, Validators.required],
      nome: [membro.nome || '', Validators.required],
      telefone: [membro.telefone || ''],
      email: [membro.email || ''],
      dataNascimento: [this.toInputDate(membro.dataNascimento)],
      tipo: [membro.tipo || 'Ativo', Validators.required],
      status: [membro.status || 'A', Validators.required],
      cep: [membro.cep || ''],
      ruaAvenida: [membro.ruaAvenida || ''],
      numero: [membro.numero || ''],
      bairro: [membro.bairro || ''],
      cidade: [membro.cidade || ''],
      estado: [membro.estado || ''],
      complemento: [membro.complemento || ''],
      observacao: [membro.observacao || ''],
    });
  }

  buscarPorId(id: number) {
    this.service.buscarMembroPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
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

    const model = this.formulario.value as PequenoGrupoMembroModel;
    const request = model.id > 0 ? this.service.atualizarMembro(model) : this.service.cadastrarMembro(model);

    request.subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('Membro salvo com sucesso.');
      this.router.navigateByUrl(`/pages/pequenos-grupos/membros/lista/${model.pequenoGrupoId}`);
    });
  }

  private toInputDate(data: any): string {
    if (!data) return '';
    const valor = new Date(data);
    if (Number.isNaN(valor.getTime())) return '';
    return `${valor.getFullYear()}-${`${valor.getMonth() + 1}`.padStart(2, '0')}-${`${valor.getDate()}`.padStart(2, '0')}`;
  }
}
