import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModeloBase } from '../models/modelo-base';
import { PaginationfilterModel } from '../models/paginationfilter.model';
import { UsuarioSistemaModel } from '../models/usuario-sistema.model';

@Injectable({ providedIn: 'root' })
export class UsuarioSistemaService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  obterDadosUsuarioLogado() {
    return this.http.get<any>(`${this.caminhoApi}/usuario-sistema/buscar-dados-usuario`);
  }

  obterDadosFiltro(filtro: PaginationfilterModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/usuario-sistema/busca-com-filtro`, filtro);
  }

  obterPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario-sistema/busca-por-id/${id}`);
  }

  obterPerfis() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario-sistema/perfis`);
  }

  adicionar(usuario: UsuarioSistemaModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/usuario-sistema/cadastrar`, usuario);
  }

  atualizar(usuario: UsuarioSistemaModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/usuario-sistema/alterar`, usuario);
  }

  resetarSenha(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/usuario-sistema/resetar-senha/${id}`, null);
  }
}
