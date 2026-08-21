import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FiltroItemModel } from '../../../@core/models/filtroItem.model';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { UsuarioService } from '../../../@core/services/usuario.service';

@Component({
  selector: 'app-processo-inscricao-aluno-busca-dialog',
  templateUrl: './processo-inscricao-aluno-busca-dialog.component.html',
  styleUrls: ['./processo-inscricao-aluno-busca-dialog.component.scss']
})
export class ProcessoInscricaoAlunoBuscaDialogComponent {
  formulario: FormGroup;
  usuarios: UsuarioModel[] = [];
  pesquisou: boolean = false;

  constructor(
    protected dialogRef: NbDialogRef<ProcessoInscricaoAlunoBuscaDialogComponent>,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  pesquisar() {
    if (!this.formulario.valid) {
      this.formulario.controls.nome.markAllAsTouched();
      return;
    }

    const parametros = new PaginationfilterModel();
    const filtros: FiltroItemModel[] = [];
    filtros.push({ property: 'Nome', filterType: 'contains', value: this.formulario.controls.nome.value });
    parametros.filtro = filtros;

    this.usuarioService.obterDadosFiltro(parametros).subscribe(res => {
      this.pesquisou = true;
      this.usuarios = res && res.success ? res.dados || [] : [];
    });
  }

  selecionar(usuario: UsuarioModel) {
    this.dialogRef.close(usuario);
  }

  fechar() {
    this.dialogRef.close();
  }
}
