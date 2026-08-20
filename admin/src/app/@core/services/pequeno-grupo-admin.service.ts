import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CongregacaoModel } from '../models/congregacao.model';
import { LiderPequenoGrupoModel } from '../models/lider-pequeno-grupo.model';
import { ModeloBase } from '../models/modelo-base';
import { NotificacaoLiderPgModel } from '../models/notificacao-lider-pg.model';
import { PequenoGrupoMembroModel } from '../models/pequeno-grupo-membro.model';
import { PequenoGrupoModel } from '../models/pequeno-grupo.model';
import { PequenoGrupoRelatorioModel } from '../models/pequeno-grupo-relatorio.model';

@Injectable()
export class PequenoGrupoAdminService {
  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  buscarUsuarios() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario/buscar-todos`);
  }

  buscarCongregacoes() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/congregacao/buscar-todos-ativos`);
  }

  buscarLideres() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/lideres`);
  }

  buscarLiderPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/lideres/${id}`);
  }

  cadastrarLider(lider: LiderPequenoGrupoModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/lideres`, lider);
  }

  atualizarLider(lider: LiderPequenoGrupoModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/lideres`, lider);
  }

  inativarLider(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/lideres/inativar/${id}`, null);
  }

  buscarPequenosGrupos() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos`);
  }

  buscarPequenoGrupoPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos/${id}`);
  }

  cadastrarPequenoGrupo(pequenoGrupo: PequenoGrupoModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos`, pequenoGrupo);
  }

  atualizarPequenoGrupo(pequenoGrupo: PequenoGrupoModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos`, pequenoGrupo);
  }

  buscarNotificacoes() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/notificacoes`);
  }

  buscarNotificacaoPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/notificacoes/${id}`);
  }

  cadastrarNotificacao(notificacao: NotificacaoLiderPgModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/notificacoes`, notificacao);
  }

  atualizarNotificacao(notificacao: NotificacaoLiderPgModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/notificacoes`, notificacao);
  }

  inativarNotificacao(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/notificacoes/inativar/${id}`, null);
  }

  buscarMembros() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros`);
  }

  buscarMembroPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros/${id}`);
  }

  cadastrarMembro(membro: PequenoGrupoMembroModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros`, membro);
  }

  atualizarMembro(membro: PequenoGrupoMembroModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros`, membro);
  }

  inativarMembro(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros/inativar/${id}`, null);
  }

  reativarMembro(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/membros/reativar/${id}`, null);
  }

  buscarRelatorios() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/relatorios`);
  }

  buscarRelatorioPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/relatorios/${id}`);
  }

  atualizarRelatorio(relatorio: PequenoGrupoRelatorioModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/relatorios`, relatorio);
  }

  buscarRelatorioGeral() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/relatorio-geral`);
  }

  buscarCheckins() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/checkins`);
  }
}
