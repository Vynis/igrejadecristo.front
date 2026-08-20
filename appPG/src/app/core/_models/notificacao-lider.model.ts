export class NotificacaoLider {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  acaoTexto: string;
  acaoUrl: string;
  prioridade: string;
}

export class NotificacaoResumo {
  quantidadeNaoLidas: number;
  relatorioSemanalPendente: boolean;
  notificacoes: NotificacaoLider[];
}
