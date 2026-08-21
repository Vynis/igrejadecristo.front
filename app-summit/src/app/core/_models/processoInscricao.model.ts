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
    valorAtual: number;
    valorPixBoletoAtual: number;
    loteAtual: string;
    lotes: ProcessoInscricaoLote[];
    dataInicalPagto: Date;
    dataFinalPagto: Date;
    dataInicioVisualizacaoCurso: Date;
    dataFinalVisualizacaoCurso: Date;
    naoTemDataVisualizacao: boolean;
    descricaoPagto: string;
    descricao: string;
}

export class ProcessoInscricaoLote {
    id: number;
    processoInscricaoId: number;
    nome: string;
    dataInicial: Date;
    dataFinal: Date;
    valor: number;
    valorPixBoleto: number;
    status: string;
}
