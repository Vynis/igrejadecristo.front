import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModeloBase } from '../_models/modelo-base';
import { PequenoGrupoMembro } from '../_models/pequeno-grupo-membro.model';
import { PequenoGrupoRelatorio } from '../_models/pequeno-grupo-relatorio.model';

@Injectable()
export class PequenoGrupoService {
  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  meuPg(): Observable<ModeloBase> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}pequeno-grupo/meu-pg`);
  }

  membros(): Observable<ModeloBase> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}pequeno-grupo/membros`);
  }

  cadastrarMembro(membro: PequenoGrupoMembro): Observable<ModeloBase> {
    return this.http.post<ModeloBase>(`${this.caminhoApi}pequeno-grupo/membros`, membro);
  }

  atualizarMembro(membro: PequenoGrupoMembro): Observable<ModeloBase> {
    return this.http.put<ModeloBase>(`${this.caminhoApi}pequeno-grupo/membros`, membro);
  }

  inativarMembro(id: number): Observable<ModeloBase> {
    return this.http.put<ModeloBase>(`${this.caminhoApi}pequeno-grupo/membros/inativar/${id}`, null);
  }

  relatorios(): Observable<ModeloBase> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}pequeno-grupo/relatorios`);
  }

  cadastrarRelatorio(relatorio: PequenoGrupoRelatorio): Observable<ModeloBase> {
    return this.http.post<ModeloBase>(`${this.caminhoApi}pequeno-grupo/relatorios`, relatorio);
  }

  atualizarRelatorio(relatorio: PequenoGrupoRelatorio): Observable<ModeloBase> {
    return this.http.put<ModeloBase>(`${this.caminhoApi}pequeno-grupo/relatorios`, relatorio);
  }

  enviarRelatorio(id: number): Observable<ModeloBase> {
    return this.http.post<ModeloBase>(`${this.caminhoApi}pequeno-grupo/relatorios/${id}/enviar`, null);
  }
}
