import { ProvaModel } from '../models/prova.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModeloBase } from '../models/modelo-base';
import { PaginationfilterModel } from '../models/paginationfilter.model';
import { ProcessoInscricaoModel } from '../models/processo-inscricao.model';

@Injectable()
export class ProcessoInscricaoService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api
  }

  buscarCiclos() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/processo-inscricao/buscar-ciclos`)
  }

  buscarInscricoesAtivas() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/processo-inscricao/busca-inscricoes-ativos`)
  }

  obterDadosFiltro(filtro: PaginationfilterModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/processo-inscricao/busca-com-filtro`, filtro)
  }

  obterPorId(id: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/processo-inscricao/buscar-por-id/${id}`)
  }

  buscarUsuariosInscritos(idProcessoInscricao: number) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/processo-inscricao/buscar-usuarios-inscritos/${idProcessoInscricao}`)
  }

  adicionar(processoInscricao: ProcessoInscricaoModel) {
    return this.http.post<ModeloBase>(`${this.caminhoApi}/processo-inscricao/adcionar`, processoInscricao)
  }

  atualizar(processoInscricao: ProcessoInscricaoModel) {
    return this.http.put<ModeloBase>(`${this.caminhoApi}/processo-inscricao/alterar`, processoInscricao)
  }



}
