import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CongregacaoModel } from '../models/congregacao.model';
import { LiderPequenoGrupoModel } from '../models/lider-pequeno-grupo.model';
import { ModeloBase } from '../models/modelo-base';
import { PequenoGrupoModel } from '../models/pequeno-grupo.model';

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

  cadastrarPequenoGrupo(pequenoGrupo: PequenoGrupoModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos`, pequenoGrupo);
  }

  atualizarPequenoGrupo(pequenoGrupo: PequenoGrupoModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/pequeno-grupo/admin/pequenos-grupos`, pequenoGrupo);
  }
}
