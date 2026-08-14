import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PequenoGrupoMembro } from 'src/app/core/_models/pequeno-grupo-membro.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({
  selector: 'app-membro-form-modal',
  templateUrl: './membro-form-modal.component.html',
  styleUrls: ['./membro-form-modal.component.scss']
})
export class MembroFormModalComponent implements OnInit {
  @Input() membro: PequenoGrupoMembro;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: PequenoGrupoService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      id: [0], nome: [''], dataNascimento: [''], telefone: [''], email: [''], tipo: ['Ativo'],
      cep: [''], ruaAvenida: [''], numero: [''], bairro: [''], cidade: [''], estado: [''], complemento: [''], observacao: [''], status: ['A']
    });
  }

  ngOnInit() {
    if (this.membro) this.form.patchValue(this.membro);
  }

  get editando() { return !!(this.membro && this.membro.id); }

  salvar() {
    const membro = this.form.value as PequenoGrupoMembro;
    const request = this.editando ? this.service.atualizarMembro(membro) : this.service.cadastrarMembro(membro);

    request.subscribe(res => {
      if (res.success) {
        this.show('Membro salvo com sucesso.');
        this.modalCtrl.dismiss({ salvo: true });
        return;
      }

      this.show(res.dados);
    });
  }

  fechar() { this.modalCtrl.dismiss(); }

  async show(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500 });
    toast.present();
  }
}
