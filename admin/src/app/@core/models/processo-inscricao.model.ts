import { CursoModel } from './curso.model';

export class ProcessoInscricaoModel {
  id: number;
  dataInicial: string;
  dataFinal: string;
  configuraPeriodo: string;
  tipo: string;
  status: string;
  valor: number;
  valorPixBoleto: number;
  dataInicalPagto: string;
  dataFinalPagto: string;
  dataInicioVisualizacaoCurso: string;
  dataFinalVisualizacaoCurso: string;
  ciclo: string;
  ano: string;
  cursoId: number;
  limiteVagas: number;
  descricaoPagto: string;
  horarioListaPresencaInicial: string;
  horarioListaPresencaFinal: string;
  diaSemanaCurso: string;
  dataInicioPresencial: string;
  dataFinalPresencial: string;
  descricao: string;
  qtdInscricoesTotal: number;
  qtdInscricoesConfirmadas: number;
  qtdInscricoesCanceladas: number;
  curso: CursoModel = new CursoModel();

  constructor() {
    this.id = 0;
    this.status = 'A';
    this.configuraPeriodo = 'N';
    this.tipo = 'G';
    this.valor = 0;
    this.valorPixBoleto = 0;
    this.limiteVagas = 0;
    this.diaSemanaCurso = 'SEG';
    this.qtdInscricoesTotal = 0;
    this.qtdInscricoesConfirmadas = 0;
    this.qtdInscricoesCanceladas = 0;
  }
}
