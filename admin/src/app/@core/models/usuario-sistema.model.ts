export class UsuarioSistemaModel {
  id: number;
  nome: string;
  email: string;
  status: string;
  perfilIds: number[];
  perfis: string[];
  usuarioPerfis: any[];

  constructor() {
    this.id = 0;
    this.status = 'A';
    this.perfilIds = [];
    this.perfis = [];
    this.usuarioPerfis = [];
  }
}
