export class UsuarioModel {
  id: number;
  nome: string;
  email: string;
  senha: string;
  status: string;
  dataCadastro: string;
  cpf: string;
  dataNascimento: string;
  tipoAcesso: string;
  rua: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  cep: string;
  telefoneCelular: string;
  telefoneFixo: string;
  congregaHaQuantoTempo: string;
  recebePastoreiro: string;
  quemPastoreia: string;
  frequentaCelula: string;
  quemLider: string;
  congregacaoId: number;

  constructor() {
    this.id = 0;
    this.status = 'A';
    this.tipoAcesso = 'U';
    this.senha = '123456';
    this.congregacaoId = 1;
  }
}
