import { CursoModel } from './curso.model';
import { ProcessoInscricaoModel } from './processo-inscricao.model';

export class ProcessoInscricaoLiberarCursosModel {
  processoInscricao: ProcessoInscricaoModel;
  cursos: CursoModel[];
  cursosLiberadosIds: number[];
}
