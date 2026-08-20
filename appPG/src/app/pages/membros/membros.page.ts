import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PequenoGrupoMembro } from 'src/app/core/_models/pequeno-grupo-membro.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';
import { MembroFormModalComponent } from './membro-form-modal.component';

@Component({ selector: 'app-membros', templateUrl: './membros.page.html', styleUrls: ['./membros.page.scss'] })
export class MembrosPage implements OnInit {
  membros: PequenoGrupoMembro[] = [];

  constructor(private service: PequenoGrupoService, private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.membros().subscribe(res => {
      if (res.success) this.membros = res.dados;
    });
  }

  editar(membro: PequenoGrupoMembro) { this.abrirModal(membro); }

  inativar(membro: PequenoGrupoMembro) {
    this.service.inativarMembro(membro.id).subscribe(res => {
      this.show(res.dados);
      this.carregar();
    });
  }

  async abrirModal(membro?: PequenoGrupoMembro) {
    const modal = await this.modalCtrl.create({
      component: MembroFormModalComponent,
      componentProps: { membro }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data && data.salvo) this.carregar();
    });

    await modal.present();
  }

  async show(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500 });
    toast.present();
  }
}
