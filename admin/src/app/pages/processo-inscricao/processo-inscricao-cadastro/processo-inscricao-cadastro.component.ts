import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursoModel } from '../../../@core/models/curso.model';
import { PaginationfilterModel } from '../../../@core/models/paginationfilter.model';
import { ProcessoInscricaoModel } from '../../../@core/models/processo-inscricao.model';
import { CursosService } from '../../../@core/services/cursos.service';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';

@Component({
  selector: 'app-processo-inscricao-cadastro',
  templateUrl: './processo-inscricao-cadastro.component.html',
  styleUrls: ['./processo-inscricao-cadastro.component.scss']
})
export class ProcessoInscricaoCadastroComponent implements OnInit {
  tituloPagina: string = 'Cadastro de Processo de Inscrição';
  formulario: FormGroup;
  processoInscricao: ProcessoInscricaoModel;
  existeErro: boolean = false;
  listaCursos: CursoModel[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private processoInscricaoService: ProcessoInscricaoService,
    private cursoService: CursosService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buscarCursos();
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.tituloPagina = `Editar Processo de Inscrição - Nº ${id}`;
        this.buscaPorId(id);
      } else {
        this.createForm(new ProcessoInscricaoModel());
      }
    });
  }

  createForm(model: ProcessoInscricaoModel) {
    this.processoInscricao = model;

    this.formulario = this.fb.group({
      id: [model.id, [Validators.required]],
      cursoId: [model.cursoId, [Validators.required]],
      status: [model.status, [Validators.required]],
      tipo: [model.tipo, [Validators.required]],
      configuraPeriodo: [model.configuraPeriodo, [Validators.required]],
      ciclo: [model.ciclo, [Validators.required]],
      ano: [model.ano, [Validators.required]],
      dataInicial: [this.toInputDateTime(model.dataInicial), [Validators.required]],
      dataFinal: [this.toInputDateTime(model.dataFinal), [Validators.required]],
      valor: [model.valor, [Validators.required]],
      valorPixBoleto: [model.valorPixBoleto],
      dataInicalPagto: [this.toInputDateTime(model.dataInicalPagto)],
      dataFinalPagto: [this.toInputDateTime(model.dataFinalPagto)],
      dataInicioVisualizacaoCurso: [this.toInputDateTime(model.dataInicioVisualizacaoCurso)],
      dataFinalVisualizacaoCurso: [this.toInputDateTime(model.dataFinalVisualizacaoCurso)],
      limiteVagas: [model.limiteVagas],
      descricaoPagto: [model.descricaoPagto],
      diaSemanaCurso: [model.diaSemanaCurso || 'segunda-feira'],
      horarioListaPresencaInicial: [this.toInputTime(model.horarioListaPresencaInicial), [Validators.required]],
      horarioListaPresencaFinal: [this.toInputTime(model.horarioListaPresencaFinal), [Validators.required]],
      dataInicioPresencial: [this.toInputDateTime(model.dataInicioPresencial)],
      dataFinalPresencial: [this.toInputDateTime(model.dataFinalPresencial)],
      descricao: [model.descricao]
    });
  }

  validacao(): boolean {
    this.existeErro = false;
    const controls = this.formulario.controls;

    if (this.formulario.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAllAsTouched());
      this.existeErro = true;
      return false;
    }

    if (new Date(controls.dataInicial.value) > new Date(controls.dataFinal.value)) {
      this.existeErro = true;
      this.toast.error('Data inicial não pode ser maior que a data final.');
      return false;
    }

    return true;
  }

  prepararModel(): ProcessoInscricaoModel {
    const controls = this.formulario.controls;
    const model = new ProcessoInscricaoModel();

    model.id = this.processoInscricao.id;
    model.cursoId = Number(controls.cursoId.value);
    model.status = controls.status.value;
    model.tipo = controls.tipo.value;
    model.configuraPeriodo = controls.configuraPeriodo.value;
    model.ciclo = controls.ciclo.value;
    model.ano = controls.ano.value;
    model.dataInicial = controls.dataInicial.value;
    model.dataFinal = controls.dataFinal.value;
    model.valor = Number(controls.valor.value);
    model.valorPixBoleto = controls.valorPixBoleto.value === '' || controls.valorPixBoleto.value === null ? null : Number(controls.valorPixBoleto.value);
    model.dataInicalPagto = controls.dataInicalPagto.value || null;
    model.dataFinalPagto = controls.dataFinalPagto.value || null;
    model.dataInicioVisualizacaoCurso = controls.dataInicioVisualizacaoCurso.value || null;
    model.dataFinalVisualizacaoCurso = controls.dataFinalVisualizacaoCurso.value || null;
    model.limiteVagas = controls.limiteVagas.value === '' || controls.limiteVagas.value === null ? 0 : Number(controls.limiteVagas.value);
    model.descricaoPagto = controls.descricaoPagto.value;
    model.diaSemanaCurso = controls.diaSemanaCurso.value;
    model.horarioListaPresencaInicial = controls.horarioListaPresencaInicial.value;
    model.horarioListaPresencaFinal = controls.horarioListaPresencaFinal.value;
    model.dataInicioPresencial = controls.dataInicioPresencial.value || null;
    model.dataFinalPresencial = controls.dataFinalPresencial.value || null;
    model.descricao = controls.descricao.value;
    model.curso = null;

    return model;
  }

  salvar() {
    if (this.validacao() === false)
      return;

    const model = this.prepararModel();

    if (model.id > 0) {
      this.atualizar(model);
      return;
    }

    this.adcionar(model);
  }

  adcionar(model: ProcessoInscricaoModel) {
    this.processoInscricaoService.adicionar(model).subscribe(result => {
      if (!result || !result.success) {
        this.toast.error('Erro ao realizar o cadastro');
        return;
      }

      this.toast.success('Cadastro realizado com sucesso!');
      this.router.navigateByUrl('/pages/processo-inscricao/lista');
    });
  }

  atualizar(model: ProcessoInscricaoModel) {
    this.processoInscricaoService.atualizar(model).subscribe(result => {
      if (!result || !result.success) {
        this.toast.error('Erro ao realizar atualização');
        return;
      }

      this.toast.success('Atualização realizada com sucesso!');
      this.router.navigateByUrl('/pages/processo-inscricao/lista');
    });
  }

  buscaPorId(id: number) {
    this.processoInscricaoService.obterPorId(id).subscribe(res => {
      if (!res.success) {
        this.toast.error('Erro a buscar dados!');
        return;
      }

      this.createForm(res.dados);
    });
  }

  buscarCursos() {
    const parametros = new PaginationfilterModel();
    parametros.filtro = [];

    this.cursoService.obterDadosFiltro(parametros).subscribe(res => {
      if (!res.success)
        return;

      this.listaCursos = res.dados;
    });
  }

  private toInputDateTime(data: any): string {
    if (!data)
      return '';

    const valorData = new Date(data);

    if (Number.isNaN(valorData.getTime()))
      return '';

    const ano = valorData.getFullYear();
    const mes = `${valorData.getMonth() + 1}`.padStart(2, '0');
    const dia = `${valorData.getDate()}`.padStart(2, '0');
    const hora = `${valorData.getHours()}`.padStart(2, '0');
    const minuto = `${valorData.getMinutes()}`.padStart(2, '0');

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }

  private toInputTime(horario: any): string {
    if (!horario)
      return '00:00';

    if (typeof horario === 'string' && horario.length >= 5)
      return horario.substring(0, 5);

    return '00:00';
  }
}
