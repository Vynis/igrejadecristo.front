import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PequenoGrupoMembroModel } from '../../../@core/models/pequeno-grupo-membro.model';
import { PequenoGrupoRelatorioModel, PequenoGrupoRelatorioPresencaModel } from '../../../@core/models/pequeno-grupo-relatorio.model';
import { PequenoGrupoModel } from '../../../@core/models/pequeno-grupo.model';
import { PequenoGrupoAdminService } from '../../../@core/services/pequeno-grupo-admin.service';

@Component({
  selector: 'app-relatorios-cadastro',
  templateUrl: './relatorios-cadastro.component.html',
  styleUrls: ['./relatorios-cadastro.component.scss']
})
export class RelatoriosCadastroComponent implements OnInit {
  formulario: FormGroup;
  relatorio: PequenoGrupoRelatorioModel;
  pequenosGrupos: PequenoGrupoModel[] = [];
  membros: PequenoGrupoMembroModel[] = [];
  presencas: PequenoGrupoRelatorioPresencaModel[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: PequenoGrupoAdminService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.service.buscarPequenosGrupos().subscribe(res => { if (res.success) this.pequenosGrupos = res.dados; });
    this.service.buscarMembros().subscribe(res => { if (res.success) this.membros = res.dados; this.montarPresencas(); });
    this.activatedRoute.params.subscribe(params => this.buscarPorId(params.id));
  }

  buscarPorId(id: number) {
    this.service.buscarRelatorioPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.relatorio = res.dados;
      this.createForm(this.relatorio);
      this.montarPresencas();
    });
  }

  createForm(relatorio: PequenoGrupoRelatorioModel) {
    this.formulario = this.fb.group({
      id: [relatorio.id],
      dataReuniao: [this.toInputDate(relatorio.dataReuniao), Validators.required],
      semanaReferencia: [relatorio.semanaReferencia || '', Validators.required],
      quantidadeAtivos: [relatorio.quantidadeAtivos || 0],
      quantidadeRotativos: [relatorio.quantidadeRotativos || 0],
      quantidadeCriancas: [relatorio.quantidadeCriancas || 0],
      quantidadeVisitantes: [relatorio.quantidadeVisitantes || 0],
      observacao: [relatorio.observacao || ''],
      status: [relatorio.status || 'Rascunho', Validators.required],
    });
  }

  montarPresencas() {
    if (!this.relatorio || !this.membros.length) return;

    const presencasRelatorio = this.relatorio.presencas || [];
    this.presencas = this.membros
      .filter(x => x.pequenoGrupoId === this.relatorio.pequenoGrupoId && x.status === 'A')
      .map(membro => {
        const presenca = presencasRelatorio.find(x => x.pequenoGrupoMembroId === membro.id);
        return {
          id: presenca ? presenca.id : 0,
          pequenoGrupoRelatorioId: this.relatorio.id,
          pequenoGrupoMembroId: membro.id,
          presente: presenca ? presenca.presente : false,
          observacao: presenca ? presenca.observacao : '',
        } as PequenoGrupoRelatorioPresencaModel;
      });
  }

  salvar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const model = { ...this.relatorio, ...this.formulario.value, presencas: this.presencas } as PequenoGrupoRelatorioModel;
    this.service.atualizarRelatorio(model).subscribe(res => {
      if (!res.success) {
        this.toast.error(res.dados);
        return;
      }

      this.toast.success('Relatório salvo com sucesso.');
      this.router.navigateByUrl('/pages/pequenos-grupos/relatorios/lista');
    });
  }

  membroNome(id: number): string {
    const membro = this.membros.find(x => x.id === id);
    return membro ? membro.nome : `Membro ${id}`;
  }

  nomePg(id: number): string {
    const pg = this.pequenosGrupos.find(x => x.id === id);
    return pg ? pg.nome : `PG ${id}`;
  }

  atualizarQuantidades() {
    const presentes = this.presencas.filter(x => x.presente);
    this.formulario.patchValue({
      quantidadeAtivos: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'ativo').length,
      quantidadeRotativos: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'rotativo').length,
      quantidadeCriancas: presentes.filter(x => this.tipoMembro(x.pequenoGrupoMembroId) === 'crianca').length,
    });
  }

  private tipoMembro(id: number): string {
    const membro = this.membros.find(x => x.id === id);
    const tipo = ((membro && membro.tipo) || '').toLowerCase();
    if (tipo.indexOf('crian') >= 0) return 'crianca';
    if (tipo.indexOf('rot') >= 0) return 'rotativo';
    return 'ativo';
  }

  private toInputDate(data: any): string {
    if (!data) return '';
    const valor = new Date(data);
    if (Number.isNaN(valor.getTime())) return '';
    return `${valor.getFullYear()}-${`${valor.getMonth() + 1}`.padStart(2, '0')}-${`${valor.getDate()}`.padStart(2, '0')}`;
  }
}
