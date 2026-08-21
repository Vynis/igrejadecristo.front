import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { ProcessoInscricaoUsuarioModel } from '../../../@core/models/processo-inscricao-usuario.model';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { PermissaoService } from '../../../@core/services/permissao.service';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';
import { DataTableAcoes } from '../../components/_models/DataTableAcoes';
import { DataTableColunas } from '../../components/_models/DataTableColunas';
import { ProcessoInscricaoAlunoBuscaDialogComponent } from '../processo-inscricao-aluno-busca-dialog/processo-inscricao-aluno-busca-dialog.component';

@Component({
  selector: 'app-processo-inscricao-usuarios',
  templateUrl: './processo-inscricao-usuarios.component.html',
  styleUrls: ['./processo-inscricao-usuarios.component.scss']
})
export class ProcessoInscricaoUsuariosComponent implements OnInit {
  idProcessoInscricao: number;
  formularioInscricaoManual: FormGroup;
  alunoSelecionado: UsuarioModel;

  colunas: DataTableColunas[] = [
    { propriedade: 'usuarioId', titulo: 'Aluno Id', disabled: false, maxwidth: 90, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.usuarioId}` },
    { propriedade: 'nome', titulo: 'Nome', disabled: false, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.nome || ''}` },
    { propriedade: 'email', titulo: 'Email', disabled: false, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.email || ''}` },
    { propriedade: 'cpf', titulo: 'CPF', disabled: false, maxwidth: 130, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.cpf || ''}` },
    { propriedade: 'telefoneCelular', titulo: 'Celular', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => `${row.telefoneCelular || ''}` },
    { propriedade: 'status', titulo: 'Status', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => this.descricaoStatus(row.status) },
    { propriedade: 'statusEstudo', titulo: 'Resultado', disabled: false, maxwidth: 120, cell: (row: ProcessoInscricaoUsuarioModel) => this.descricaoStatusEstudo(row.statusEstudo) },
    { propriedade: 'dataInscricao', titulo: 'Data Inscrição', disabled: false, maxwidth: 150, cell: (row: ProcessoInscricaoUsuarioModel) => this.formatarData(row.dataInscricao) }
  ];

  acoes: DataTableAcoes[] = [
    { icone: 'check_circle', evento: this.aprovar.bind(this), toolTip: 'Lançar aprovado', color: 'primary', visivel: row => row.statusEstudo !== 'AP' && this.temPermissao('processoinscricao.lancar_resultado') },
    { icone: 'cancel', evento: this.reprovar.bind(this), toolTip: 'Lançar reprovado', color: 'warn', visivel: row => row.statusEstudo !== 'RE' && this.temPermissao('processoinscricao.lancar_resultado') },
    { icone: 'person_remove', evento: this.cancelarInscricao.bind(this), toolTip: 'Remover aluno do processo', color: 'warn', visivel: row => row.status !== 'CA' && this.temPermissao('processoinscricao.remover_aluno') }
  ];
  dadosTabela: ProcessoInscricaoUsuarioModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private processoInscricaoService: ProcessoInscricaoService,
    private permissaoService: PermissaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.criarFormularioInscricaoManual();

    this.activatedRoute.params.subscribe(params => {
      this.idProcessoInscricao = Number(params.idProcessoInscricao);
      this.buscarUsuariosInscritos();
    });
  }

  criarFormularioInscricaoManual() {
    this.formularioInscricaoManual = this.fb.group({
      status: ['AG', [Validators.required]]
    });
  }

  buscarUsuariosInscritos() {
    this.processoInscricaoService.buscarUsuariosInscritos(this.idProcessoInscricao).subscribe(res => {
      this.dadosTabela = res?.dados || [];
    });
  }

  descricaoStatus(status: string): string {
    if (status === 'CO')
      return 'Confirmada';

    if (status === 'CA')
      return 'Cancelada';

    if (status === 'AG')
      return 'Aguardando Pagamento';

    return status || '';
  }

  descricaoStatusEstudo(statusEstudo: string): string {
    if (statusEstudo === 'AP')
      return 'Aprovado';

    if (statusEstudo === 'RE')
      return 'Reprovado';

    return 'Não lançado';
  }

  aprovar(inscricao: ProcessoInscricaoUsuarioModel) {
    this.alterarStatusEstudo(inscricao, 'AP');
  }

  reprovar(inscricao: ProcessoInscricaoUsuarioModel) {
    this.alterarStatusEstudo(inscricao, 'RE');
  }

  alterarStatusEstudo(inscricao: ProcessoInscricaoUsuarioModel, statusEstudo: string) {
    const descricao = statusEstudo === 'AP' ? 'aprovado' : 'reprovado';
    const confirmar = confirm(`Deseja lançar ${descricao} para ${inscricao.nome}?`);

    if (!confirmar)
      return;

    this.processoInscricaoService.alterarStatusEstudo(inscricao.id, statusEstudo).subscribe(res => {
      if (!res || !res.success) {
        this.toast.error('Erro ao lançar resultado');
        return;
      }

      this.toast.success('Resultado lançado com sucesso!');
      this.buscarUsuariosInscritos();
    });
  }

  cadastrarInscricaoManual() {
    if (!this.alunoSelecionado || !this.alunoSelecionado.id || !this.formularioInscricaoManual.valid) {
      Object.keys(this.formularioInscricaoManual.controls).forEach(controlName => this.formularioInscricaoManual.controls[controlName].markAllAsTouched());
      this.toast.error('Selecione o aluno e informe o status da inscrição');
      return;
    }

    const status = this.formularioInscricaoManual.controls.status.value || 'AG';

    this.processoInscricaoService.cadastrarInscricaoManual(this.alunoSelecionado.id, this.idProcessoInscricao, status).subscribe(res => {
      if (!res || !res.success) {
        this.toast.error(res && res.dados ? res.dados : 'Erro ao cadastrar inscrição manual');
        return;
      }

      this.toast.success('Inscrição manual cadastrada com sucesso!');
      this.alunoSelecionado = null;
      this.formularioInscricaoManual.reset({ status: 'AG' });
      this.buscarUsuariosInscritos();
    });
  }

  cancelarInscricao(inscricao: ProcessoInscricaoUsuarioModel) {
    const confirmar = confirm(`Deseja remover o aluno ${inscricao.nome} deste processo de inscrição? A inscrição será marcada como cancelada, sem apagar o histórico.`);

    if (!confirmar)
      return;

    this.processoInscricaoService.cancelarInscricao(inscricao.id).subscribe(res => {
      if (!res || !res.success) {
        this.toast.error(res && res.dados ? res.dados : 'Erro ao remover aluno do processo');
        return;
      }

      this.toast.success('Aluno removido do processo com sucesso!');
      this.buscarUsuariosInscritos();
    });
  }

  pesquisarAluno() {
    this.dialogService.open(ProcessoInscricaoAlunoBuscaDialogComponent)
      .onClose.subscribe((usuario: UsuarioModel) => {
        if (usuario)
          this.alunoSelecionado = usuario;
      });
  }

  limparAlunoSelecionado() {
    this.alunoSelecionado = null;
  }

  formatarData(data: string): string {
    if (!data)
      return '';

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime()))
      return '';

    const dia = `${dataObj.getDate()}`.padStart(2, '0');
    const mes = `${dataObj.getMonth() + 1}`.padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  temPermissao(permissao: string): boolean {
    return this.permissaoService.temPermissao(permissao);
  }
}
