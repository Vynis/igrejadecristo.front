import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModeloBase } from '../_models/modelo-base';

@Injectable()
export class CheckUsuarioService {
  caminhoApi: string = '';

  constructor(private http: HttpClient) {
      this.caminhoApi = environment.api;
  }

  cadastrarLocalizacaoUsuario(latitude: string, longitude: string): Observable<ModeloBase> {
      return this.http.post<ModeloBase>(`${this.caminhoApi}check-usuario/cadastrar-localizacao-usuario`, { latitude, longitude });
  }

  buscarProcessosInscricaoLiberadosCheck(): Observable<ModeloBase> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}check-usuario/buscar-processos-inscricao-liberados-check`);
  }

  checkUsuario(processoInscricaoId: number): Observable<ModeloBase> {
    return this.http.post<ModeloBase>(`${this.caminhoApi}check-usuario/checkin/${processoInscricaoId}`, {processoInscricaoId});
  }

  buscarHistoricoUsuario(): Observable<ModeloBase> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}check-usuario/historico-usuario`);
  }

}
