import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursoModel } from '../../../@core/models/curso.model';
import { ProcessoInscricaoLiberarCursosModel } from '../../../@core/models/processo-inscricao-liberar-cursos.model';
import { ProcessoInscricaoModel } from '../../../@core/models/processo-inscricao.model';
import { ProcessoInscricaoService } from '../../../@core/services/processo-inscricao.service';

@Component({
  selector: 'app-processo-inscricao-liberar-cursos',
  templateUrl: './processo-inscricao-liberar-cursos.component.html',
  styleUrls: ['./processo-inscricao-liberar-cursos.component.scss']
})
export class ProcessoInscricaoLiberarCursosComponent implements OnInit {
  idProcessoInscricao: number;
  processoInscricao: ProcessoInscricaoModel;
  cursos: CursoModel[] = [];
  cursosSelecionados: number[] = [];
  carregando = false;
  salvando = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private processoInscricaoService: ProcessoInscricaoService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idProcessoInscricao = Number(params.idProcessoInscricao);
      this.carregarDados();
    });
  }

  carregarDados() {
    this.carregando = true;

    this.processoInscricaoService.buscarCursosLiberacao(this.idProcessoInscricao).subscribe(res => {
      this.carregando = false;

      if (!res || !res.success) {
        this.toast.error('Erro ao carregar cursos para liberação');
        return;
      }

      const dados: ProcessoInscricaoLiberarCursosModel = res.dados;
      this.processoInscricao = dados.processoInscricao;
      this.cursos = dados.cursos || [];
      this.cursosSelecionados = dados.cursosLiberadosIds || [];
    }, () => {
      this.carregando = false;
      this.toast.error('Erro ao carregar cursos para liberação');
    });
  }

  cursoMarcado(cursoId: number): boolean {
    return this.cursosSelecionados.includes(cursoId);
  }

  alterarCurso(cursoId: number, marcado: boolean) {
    if (marcado) {
      if (!this.cursoMarcado(cursoId))
        this.cursosSelecionados.push(cursoId);

      return;
    }

    this.cursosSelecionados = this.cursosSelecionados.filter(x => x !== cursoId);
  }

  salvar() {
    this.salvando = true;

    this.processoInscricaoService.salvarCursosLiberacao(this.idProcessoInscricao, this.cursosSelecionados).subscribe(res => {
      this.salvando = false;

      if (!res || !res.success) {
        this.toast.error(res && res.dados ? res.dados : 'Erro ao salvar liberação de cursos');
        return;
      }

      this.toast.success('Liberação de cursos atualizada com sucesso!');
      this.router.navigateByUrl('/pages/processo-inscricao/lista');
    }, () => {
      this.salvando = false;
      this.toast.error('Erro ao salvar liberação de cursos');
    });
  }
}
