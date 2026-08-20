import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';

@Component({
  selector: 'app-usuario-busca-dialog',
  templateUrl: './usuario-busca-dialog.component.html',
  styleUrls: ['./usuario-busca-dialog.component.scss']
})
export class UsuarioBuscaDialogComponent implements OnInit {
  filtro: string = '';
  usuarios: UsuarioModel[] = [];
  usuariosFiltrados: UsuarioModel[] = [];

  constructor(
    protected dialogRef: NbDialogRef<UsuarioBuscaDialogComponent>,
    private service: PequenoGrupoAdminService
  ) { }

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.service.buscarUsuarios().subscribe(res => {
      if (!res.success) {
        return;
      }

      this.usuarios = res.dados
        .slice()
        .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      this.usuariosFiltrados = this.usuarios;
    });
  }

  filtrar() {
    const filtro = (this.filtro || '').trim().toLowerCase();

    if (!filtro) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      (usuario.nome || '').toLowerCase().includes(filtro) ||
      (usuario.email || '').toLowerCase().includes(filtro) ||
      (usuario.cpf || '').toLowerCase().includes(filtro)
    );
  }

  selecionar(usuario: UsuarioModel) {
    this.dialogRef.close(usuario);
  }

  fechar() {
    this.dialogRef.close();
  }
}
