import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ProcessoInscricao } from 'src/app/core/_models/processoInscricao.model';
import { CheckUsuarioService } from 'src/app/core/_services/check-usuario.service';
import { CheckHistoricoComponent } from './check-historico/check-historico.component';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  listaInscricaoCurso: ProcessoInscricao[];
  listaInscricaoCursoBackup: ProcessoInscricao[];

  constructor(
    private checkUsuarioService: CheckUsuarioService,
    private loadCtrl: LoadingController,
    public alertController: AlertController,
    private toastCtrl: ToastController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.inicio();
  }

  ionViewWillEnter() {
    this.inicio();
  }

  inicio() {
    this.capturaGeoLocalizacaoUsuario();
    this.buscarProcessosLiberados();
  }


  async buscarProcessosLiberados(){
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

    this.checkUsuarioService.buscarProcessosInscricaoLiberadosCheck().subscribe(res => {

      this.listaInscricaoCurso = res.dados;

      loading.dismiss();

    },err => {
      loading.dismiss();
    })
  }

  async checkinUsuario(processoInscricaoId){
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

    this.checkUsuarioService.checkUsuario(processoInscricaoId).subscribe(res => {

      if (!res.success){
        this.showMessage(res.dados);
        loading.dismiss();
        return;
      }

      this.mensagemConfirmacao();
      loading.dismiss();
      this.buscarProcessosLiberados();
    }, err => {
      loading.dismiss();
    })

  }

  capturaGeoLocalizacaoUsuario() {

    if ("geolocation" in navigator) {
      var latitude = 0;
      var longitude =0;

      const getPosition = positon =>  {
          latitude=  positon.coords.latitude;
          longitude= positon.coords.longitude;

          console.log(`Lat: ${latitude} Lng: ${longitude}`);

         this.checkUsuarioService.cadastrarLocalizacaoUsuario(latitude.toString(), longitude.toString()).subscribe(res => {
            if (!res.success)
              alert(res.dados);

            console.log(res);  
         })

      }

      const geoError = error => {
        console.log(error)
      }

      navigator.geolocation.getCurrentPosition(getPosition,geoError);

    } else {
      alert("Lamento, mas os serviços de geolocalização não são suportados pelo seu navegador.",
      );
    }
  }

  async mensagemConfirmacao() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Parabéns',
      subHeader: '',
      message: `Parabéns seu check in foi realizado com sucesso!`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showMessage(message) {
    const msg = await this.toastCtrl.create({ message: message, duration: 3000 });
    msg.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CheckHistoricoComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
