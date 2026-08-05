import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { PequenoGrupoMembro } from 'src/app/core/_models/pequeno-grupo-membro.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({ selector: 'app-membros', templateUrl: './membros.page.html', styleUrls: ['./membros.page.scss'] })
export class MembrosPage implements OnInit {
  form: FormGroup;
  membros: PequenoGrupoMembro[] = [];
  editando = false;

  constructor(private fb: FormBuilder, private service: PequenoGrupoService, private toastCtrl: ToastController) {
    this.form = this.fb.group({
      id: [0], nome: [''], dataNascimento: [''], telefone: [''], email: [''], tipo: ['Ativo'],
      cep: [''], ruaAvenida: [''], numero: [''], bairro: [''], cidade: [''], estado: [''], complemento: [''], observacao: [''], status: ['A']
    });
  }

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.membros().subscribe(res => {
      if (res.success) this.membros = res.dados;
    });
  }

  salvar() {
    const membro = this.form.value as PequenoGrupoMembro;
    const request = this.editando ? this.service.atualizarMembro(membro) : this.service.cadastrarMembro(membro);
    request.subscribe(res => {
      this.show(res.success ? 'Membro salvo com sucesso.' : res.dados);
      if (res.success) { this.novo(); this.carregar(); }
    });
  }

  editar(membro: PequenoGrupoMembro) {
    this.editando = true;
    this.form.patchValue(membro);
  }

  inativar(membro: PequenoGrupoMembro) {
    this.service.inativarMembro(membro.id).subscribe(res => {
      this.show(res.dados);
      this.carregar();
    });
  }

  novo() {
    this.editando = false;
    this.form.reset({ id: 0, tipo: 'Ativo', status: 'A' });
  }

  async show(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500 });
    toast.present();
  }
}
