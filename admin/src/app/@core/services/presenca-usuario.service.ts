import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ModeloBase } from "../models/modelo-base";
import { PresencaUsuarioModel } from "../models/presenca-usuario.model";

@Injectable()
export class PresencaUsuarioService {

  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  buscarAulasDisponiveis() {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/presenca-usuario/buscar-aulas-disponiveis`)
  }

  buscarTodosPresencaUsuario(data: Date) {
    return this.http.get<ModeloBase>(`${this.caminhoApi}/presenca-usuario/buscar-todos-presenca-usuario/${data}`)
  }

  inserirCheckInUsuario(dado: PresencaUsuarioModel){
    return this.http.post<ModeloBase>(`${this.caminhoApi}/presenca-usuario/inserir-presenca-usuario`, dado);
  }

  deletarCheckInUsuario(idUsuario: number, idProcessoInscricao: number , data: Date){
    return this.http.delete<ModeloBase>(`${this.caminhoApi}/presenca-usuario/deletar-presenca-usuario/${idUsuario}/${idProcessoInscricao}/${data}`);
  }

}
