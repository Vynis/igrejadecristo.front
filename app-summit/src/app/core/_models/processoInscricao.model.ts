import { Curso } from "./curso.model";

export class ProcessoInscricao {
    id: number;
    dataInicial: Date;
    dataFinal: Date;
    configuraPeriodo: string;
    tipo: string;
    status: string;
    cursoId: number;
    curso: Curso = new Curso();
    valor: number;
    valorPixBoleto: number;
    dataInicalPagto: Date;
    dataFinalPagto: Date;
    dataInicioVisualizacaoCurso: Date;
    dataFinalVisualizacaoCurso: Date;
    naoTemDataVisualizacao: boolean;
    descricaoPagto: string;
    descricao: string;
}
