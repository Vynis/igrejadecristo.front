import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModeloBase } from '../models/modelo-base';

@Injectable({ providedIn: 'root' })
export class PermissoesAdminService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  obterPerfis() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/permissao/perfis`);
  }

  obterPermissoes() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/permissao/buscar-todas`);
  }

  obterPermissoesPerfil(perfilId: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/permissao/perfil/${perfilId}`);
  }

  salvarPermissoesPerfil(perfilId: number, permissoesIds: number[]) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/permissao/salvar-perfil`, { perfilId, permissoesIds });
  }
}
