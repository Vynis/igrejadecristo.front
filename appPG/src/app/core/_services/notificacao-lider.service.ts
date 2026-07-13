import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ModeloBase } from '../_models/modelo-base';
import { NotificacaoLider, NotificacaoResumo } from '../_models/notificacao-lider.model';

@Injectable({ providedIn: 'root' })
export class NotificacaoLiderService {
  caminhoApi: string = '';

  constructor(private http: HttpClient) {
    this.caminhoApi = environment.api;
  }

  resumo(): Observable<NotificacaoResumo> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}pequeno-grupo/notificacoes/resumo`).pipe(
      map(res => this.normalizarResumo(res.dados || {})),
      catchError(() => of(this.normalizarResumo({})))
    );
  }

  notificacoes(): Observable<NotificacaoLider[]> {
    return this.http.get<ModeloBase>(`${this.caminhoApi}pequeno-grupo/notificacoes`).pipe(
      map(res => (res.dados || []).map((x: any) => this.normalizarNotificacao(x))),
      catchError(() => of([]))
    );
  }

  marcarLida(id: number): Observable<ModeloBase> {
    return this.http.post<ModeloBase>(`${this.caminhoApi}pequeno-grupo/notificacoes/${id}/marcar-lida`, null);
  }

  private normalizarResumo(resumo: any): NotificacaoResumo {
    const notificacoes = (resumo.notificacoes || resumo.Notificacoes || []).map((x: any) => this.normalizarNotificacao(x));

    return {
      quantidadeNaoLidas: resumo.quantidadeNaoLidas || resumo.QuantidadeNaoLidas || notificacoes.filter(x => !x.lida).length,
      relatorioSemanalPendente: resumo.relatorioSemanalPendente === undefined ? resumo.RelatorioSemanalPendente : resumo.relatorioSemanalPendente,
      notificacoes
    } as NotificacaoResumo;
  }

  private normalizarNotificacao(notificacao: any): NotificacaoLider {
    return {
      id: notificacao.id || notificacao.Id,
      tipo: notificacao.tipo || notificacao.Tipo,
      titulo: notificacao.titulo || notificacao.Titulo,
      mensagem: notificacao.mensagem || notificacao.Mensagem,
      data: notificacao.data || notificacao.Data,
      lida: notificacao.lida === undefined ? notificacao.Lida : notificacao.lida,
      acaoTexto: notificacao.acaoTexto || notificacao.AcaoTexto,
      acaoUrl: notificacao.acaoUrl || notificacao.AcaoUrl,
      prioridade: notificacao.prioridade || notificacao.Prioridade
    } as NotificacaoLider;
  }
}
