import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { PequenoGrupoRelatorio } from 'src/app/core/_models/pequeno-grupo-relatorio.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({ selector: 'app-relatorios', templateUrl: './relatorios.page.html', styleUrls: ['./relatorios.page.scss'] })
export class RelatoriosPage implements OnInit {
  form: FormGroup;
  relatorios: PequenoGrupoRelatorio[] = [];
  editando = false;

  constructor(private fb: FormBuilder, private service: PequenoGrupoService, private toastCtrl: ToastController) {
    this.form = this.fb.group({
      id: [0], dataReuniao: [''], semanaReferencia: [''], quantidadeAtivos: [0], quantidadeRotativos: [0],
      quantidadeCriancas: [0], quantidadeVisitantes: [0], observacao: [''], status: ['Rascunho']
    });
  }

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.relatorios().subscribe(res => {
      if (res.success) this.relatorios = res.dados;
    });
  }

  salvar() {
    const relatorio = this.form.value as PequenoGrupoRelatorio;
    const request = this.editando ? this.service.atualizarRelatorio(relatorio) : this.service.cadastrarRelatorio(relatorio);
    request.subscribe(res => {
      this.show(res.success ? 'Relatório salvo com sucesso.' : res.dados);
      if (res.success) { this.novo(); this.carregar(); }
    });
  }

  editar(relatorio: PequenoGrupoRelatorio) {
    this.editando = true;
    this.form.patchValue(relatorio);
  }

  enviar(relatorio: PequenoGrupoRelatorio) {
    this.service.enviarRelatorio(relatorio.id).subscribe(res => {
      this.show(res.dados);
      this.carregar();
    });
  }

  novo() {
    this.editando = false;
    this.form.reset({ id: 0, quantidadeAtivos: 0, quantidadeRotativos: 0, quantidadeCriancas: 0, quantidadeVisitantes: 0, status: 'Rascunho' });
  }

  async show(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500 });
    toast.present();
  }
}
