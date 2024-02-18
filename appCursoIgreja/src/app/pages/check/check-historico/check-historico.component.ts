import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PresencaUsuario } from 'src/app/core/_models/presenca-usuario.model';
import { CheckUsuarioService } from 'src/app/core/_services/check-usuario.service';

@Component({
  selector: 'app-check-historico',
  templateUrl: './check-historico.component.html',
  styleUrls: ['./check-historico.component.scss']
})
export class CheckHistoricoComponent implements OnInit {

  listaPresencaUsuario: PresencaUsuario[] = [];

  constructor(
    public modalController: ModalController,
    private checkUsuarioService: CheckUsuarioService,
    private loadCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.listarHistorico();
  }

  async listarHistorico() {
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

    this.checkUsuarioService.buscarHistoricoUsuario().subscribe(res => {

      this.listaPresencaUsuario = res.dados;

      loading.dismiss();
    },
    err => {
      console.log(err);
      loading.dismiss();
    }
    )
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
