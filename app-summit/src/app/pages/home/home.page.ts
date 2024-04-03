import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { InscricaoUsuario } from 'src/app/core/_models/inscricaoUsuario.model';
import { ModeloBase } from 'src/app/core/_models/modelo-base';
import { InscricaoUsuarioService } from 'src/app/core/_services/inscricaoUsuario.service';
import { CheckoutComponent } from '../checkout/checkout.component';
import { SecurityUtil } from 'src/app/core/utils/security.util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  listaInscricaoCurso: InscricaoUsuario[];
  listaInscricaoCursoBackup: InscricaoUsuario[];
  dataAtual: Date = new Date();

  constructor(
    private inscricaoUsuarioService: InscricaoUsuarioService, 
    public alertController: AlertController, 
    private loadCtrl: LoadingController,
    public modalController: ModalController) { }

  ngOnInit(): void {
    this.buscarMinhasInscoes(null);
  }

  ionViewWillEnter() {
    this.buscarMinhasInscoes(null);
  }

  async buscarMinhasInscoes(event) {

    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();


    this.inscricaoUsuarioService.buscaCursoIsncrito().subscribe(
      res => {
        let dados = res.dados;
        dados.forEach(element => {
          element.processoInscricao.dataFinal = new Date(element.processoInscricao.dataFinal);
          element.processoInscricao.dataInicial = new Date(element.processoInscricao.dataInicial);
          element.processoInscricao.dataInicalPagto = new Date(element.processoInscricao.dataInicalPagto);
          element.processoInscricao.dataFinalPagto = new Date(element.processoInscricao.dataFinalPagto);
          element.processoInscricao.dataInicioVisualizacaoCurso = new Date(element.processoInscricao.dataInicioVisualizacaoCurso);
          element.processoInscricao.dataFinalVisualizacaoCurso  = new Date(element.processoInscricao.dataFinalVisualizacaoCurso);
          element.processoInscricao.naoTemDataVisualizacao = element.processoInscricao.dataInicioVisualizacaoCurso == null ? true : false;
        });
        this.listaInscricaoCurso = dados;
        this.listaInscricaoCursoBackup = dados;
        if (event !== null)
          event.target.complete();

        loading.dismiss();
      },
      err => {
        loading.dismiss();
      }
    )
  }

  async cancelarInscricao(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tem certeza que deseja cancelar sua inscrição',
      message: 'Caso cancele poderá efetuar inscrição novamente se estiver dentre os prazos!',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            this.inscricaoUsuarioService.cancelarInscricao(id).subscribe(
              res => {
                if (res.success) {
                  this.buscarMinhasInscoes(null);
                }
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  async filtro(evento) {
    this.listaInscricaoCurso = this.listaInscricaoCursoBackup;
    const searchTerm = evento.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listaInscricaoCurso = this.listaInscricaoCurso.filter(item => {
      if (item.processoInscricao.curso.titulo && searchTerm) {
        return (item.processoInscricao.curso.titulo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.processoInscricao.curso.titulo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });

  }

  async presentModal(inscricao: InscricaoUsuario) {
    const modal = await this.modalController.create({
      component: CheckoutComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': inscricao.id,
        'inscricao': inscricao
      }
    });

    modal.onDidDismiss()
    .then(() => {
      this.buscarMinhasInscoes(null);
    });

    return await modal.present();
  }


}
