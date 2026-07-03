export class LiderPequenoGrupo {
  id: number;
  usuarioId: number;
  congregacaoId: number;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  observacao: string;
  dataCadastro: Date;
}

export class PequenoGrupo {
  id: number;
  congregacaoId: number;
  nome: string;
  liderPequenoGrupoId: number;
  coLiderPequenoGrupoId: number;
  diaSemana: string;
  horarioReuniao: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: string;
  dataCadastro: Date;
}

export class MeuPgResponse {
  lider: LiderPequenoGrupo;
  pequenoGrupo: PequenoGrupo;
  usuario: any;
}
