import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CongregacaoModel } from '../../../@core/models/congregacao.model';
import { LiderPequenoGrupoModel } from '../../../@core/models/lider-pequeno-grupo.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';

class LiderBuscaItem {
  lider: LiderPequenoGrupoModel;
  nome: string;
  email: string;
  cpf: string;
  congregacao: string;
}

@Component({
  selector: 'app-lider-busca-dialog',
  templateUrl: './lider-busca-dialog.component.html',
  styleUrls: ['./lider-busca-dialog.component.scss']
})
export class LiderBuscaDialogComponent implements OnInit {
  filtro: string = '';
  lideres: LiderBuscaItem[] = [];
  lideresFiltrados: LiderBuscaItem[] = [];

  private usuarios: UsuarioModel[] = [];
  private congregacoes: CongregacaoModel[] = [];
  private lideresBase: LiderPequenoGrupoModel[] = [];
  private carregamentosPendentes = 0;

  constructor(
    protected dialogRef: NbDialogRef<LiderBuscaDialogComponent>,
    private service: PequenoGrupoAdminService
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregamentosPendentes = 3;

    this.service.buscarLideres().subscribe(res => {
      if (res.success) {
        this.lideresBase = res.dados || [];
      }

      this.finalizarCarregamento();
    });

    this.service.buscarUsuarios().subscribe(res => {
      if (res.success) {
        this.usuarios = res.dados || [];
      }

      this.finalizarCarregamento();
    });

    this.service.buscarCongregacoes().subscribe(res => {
      if (res.success) {
        this.congregacoes = res.dados || [];
      }

      this.finalizarCarregamento();
    });
  }

  filtrar() {
    const filtro = (this.filtro || '').trim().toLowerCase();

    if (!filtro) {
      this.lideresFiltrados = this.lideres;
      return;
    }

    this.lideresFiltrados = this.lideres.filter(item =>
      (item.nome || '').toLowerCase().includes(filtro) ||
      (item.email || '').toLowerCase().includes(filtro) ||
      (item.cpf || '').toLowerCase().includes(filtro) ||
      (item.congregacao || '').toLowerCase().includes(filtro)
    );
  }

  selecionar(item: LiderBuscaItem) {
    this.dialogRef.close(item.lider);
  }

  fechar() {
    this.dialogRef.close();
  }

  private finalizarCarregamento() {
    this.carregamentosPendentes--;

    if (this.carregamentosPendentes > 0) {
      return;
    }

    this.montarLideres();
  }

  private montarLideres() {
    this.lideres = this.lideresBase
      .filter(lider => lider.status === 'A')
      .map(lider => {
        const usuario = this.usuarios.find(x => x.id === lider.usuarioId);
        const congregacao = this.congregacoes.find(x => x.id === lider.congregacaoId);

        return {
          lider: lider,
          nome: usuario ? usuario.nome : `Usuário ${lider.usuarioId}`,
          email: usuario ? usuario.email : '',
          cpf: usuario ? usuario.cpf : '',
          congregacao: congregacao ? congregacao.nome : '',
        } as LiderBuscaItem;
      })
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    this.lideresFiltrados = this.lideres;
  }
}
