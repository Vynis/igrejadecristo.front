import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModeloBase } from '../models/modelo-base';
import { PaginationfilterModel } from '../models/paginationfilter.model';
import { UsuarioModel } from '../models/usuario.model';

@Injectable()
export class UsuarioService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  obterTodos() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario/buscar-todos`)
  }

  obterDadosFiltro(filtro: PaginationfilterModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/usuario/busca-com-filtro`, filtro)
  }

  obterPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario/busca-por-id/${id}`)
  }

  buscarProcessosInscricao(idUsuario: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/usuario/buscar-processos-inscricao/${idUsuario}`)
  }

  adicionar(usuario: UsuarioModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/usuario/cadastrar`, usuario)
  }

  atualizar(usuario: UsuarioModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/usuario/alterar`, usuario)
  }

  resetarSenha(id: number) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/usuario/resetar-senha/${id}`, null)
  }
}
