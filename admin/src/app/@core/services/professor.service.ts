import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ModeloBase } from '../models/modelo-base';

@Injectable()
export class ProfessorService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api
  }

  obterAtivos() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/professor/buscar-ativo`)
  }
}
