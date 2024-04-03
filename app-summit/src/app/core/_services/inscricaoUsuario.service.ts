import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from 'src/environments/environment';
import { ConteudoUsuario } from '../_models/conteudoUsuario.model';
import { InscricaoUsuario } from '../_models/inscricaoUsuario.model';
import { ModeloBase } from '../_models/modelo-base';
import { ProvaUsuario } from '../_models/provaUsuario.model';



@Injectable()
export class InscricaoUsuarioService {
    caminhoApi: string = '';

    constructor(private http: HttpClient) {
        this.caminhoApi = environment.api;
    }

    cadastrar(inscricao: InscricaoUsuario, userToken: string): Observable<any> {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        });

        return this.http.post<InscricaoUsuario>(`${this.caminhoApi}inscricao-usuario/cadastrar`,inscricao,{ headers: httpHeaders } )
            .pipe(
                tap((res: InscricaoUsuario) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    cadastrarSemToken(inscricao: InscricaoUsuario): Observable<any> {
        return this.http.post<InscricaoUsuario>(`${this.caminhoApi}inscricao-usuario/cadastrar`,inscricao)
            .pipe(
                tap((res: InscricaoUsuario) => {
                    return res;
                }),
                catchError(err => {
                    return null;
                })
            );
    }

    gerarPagamento(idInscricao: number, userToken: string) : Observable<any> {
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        });

        return this.http.post<InscricaoUsuario>(`${this.caminhoApi}inscricao-usuario/gerar/${idInscricao}`, { id: idInscricao } ,{ headers: httpHeaders } )
        .pipe(
            tap((res: InscricaoUsuario) => {
                return res;
            }),
            catchError(err => {
                return null;
            })
        );
    }



    gerarPagamentoSemToken(idInscricao: number, metodoPagto: string) : Observable<ModeloBase> {
        return this.http.post<ModeloBase>(`${this.caminhoApi}inscricao-usuario/gerar/${idInscricao}/${metodoPagto}`, { id: idInscricao } );
    }

    buscaCursoIsncrito() : Observable<ModeloBase> {
        return this.http.get<ModeloBase>(`${this.caminhoApi}inscricao-usuario/busca-curso-inscrito`);
    }

    buscaTransacao(idTransacao: string) : Observable<ModeloBase> {
        return this.http.get<ModeloBase>(`${this.caminhoApi}inscricao-usuario/buscar-transacao/${idTransacao}`);
    }

    cancelarInscricao(idInscricao: number) : Observable<ModeloBase> {
        return this.http.put<ModeloBase>(`${this.caminhoApi}inscricao-usuario/cancelar-incricao/${idInscricao}`,  { id: idInscricao } );
    }

    processarCursoInscrito(idInscricao: number) {
        return this.http.get<ModeloBase>(`${this.caminhoApi}inscricao-usuario/processar-curso-inscrito/${idInscricao}`);
    }

    buscaConteudoUsuario(idCurso: number) {
        return this.http.get<ModeloBase>(`${this.caminhoApi}conteudo-usuario/busca-conteudo-usuario/${idCurso}`);
    }

    salvarConteudoUsuario(conteudoUsuario: ConteudoUsuario) {
        return this.http.post<ConteudoUsuario>(`${this.caminhoApi}conteudo-usuario/salvar-conteudo-usuario`,  conteudoUsuario);
    }

    buscarModuloCurso(idCurso: number) {
        return this.http.get<ModeloBase>(`${this.caminhoApi}modulo/buscar-modulo-curso/${idCurso}`)
    }

    salvarProva(provaUsuario: ProvaUsuario[]) {
        return this.http.post(`${this.caminhoApi}prova-usuario/salvar-prova`, {provaUsuario: provaUsuario});
    }

    gerarSessao() {
        return this.http.get<ModeloBase>(`${this.caminhoApi}inscricao-usuario/gerar-sessao`)
    }

}
