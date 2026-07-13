export class NotificacaoLiderPgModel {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  link: string;
  dataInicio: Date;
  dataFim: Date;
  congregacaoId: number;
  pequenoGrupoId: number;
  liderPequenoGrupoId: number;
  status: string;
  dataCadastro: Date;
}
