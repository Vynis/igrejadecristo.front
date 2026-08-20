export class PequenoGrupoRelatorio {
  id: number;
  pequenoGrupoId: number;
  liderPequenoGrupoId: number;
  dataReuniao: Date;
  semanaReferencia: string;
  quantidadeAtivos: number;
  quantidadeRotativos: number;
  quantidadeCriancas: number;
  quantidadeVisitantes: number;
  observacao: string;
  status: string;
  dataCadastro: Date;
  dataEnvio: Date;
  presencas: PequenoGrupoRelatorioPresenca[];
}

export class PequenoGrupoRelatorioPresenca {
  id: number;
  pequenoGrupoRelatorioId: number;
  pequenoGrupoMembroId: number;
  presente: boolean;
  observacao: string;
}
