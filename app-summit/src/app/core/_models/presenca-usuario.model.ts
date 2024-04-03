import { ProcessoInscricao } from "./processoInscricao.model";
import { Usuario } from "./usurario.model";

export class PresencaUsuario {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    processoInscricaoId: number;
    processoInscricao: ProcessoInscricao;
    dataRegistro: Date;
}