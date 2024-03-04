import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { InscricaoUsuario } from 'src/app/core/_models/inscricaoUsuario.model';
import { ModeloBase } from 'src/app/core/_models/modelo-base';
import { InscricaoUsuarioService } from 'src/app/core/_services/inscricaoUsuario.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Input() id: number;
  @Input() inscricao: InscricaoUsuario;

  constructor(
    public modalController: ModalController ,
    private inscricaoUsuarioService: InscricaoUsuarioService, 
    public alertController: AlertController, 
    private loadCtrl: LoadingController, ) { }

  ngOnInit(): void {
   console.log(this.inscricao)
  }

  async gerarPagamento(metodoPagto: string) {
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

    this.inscricaoUsuarioService.gerarPagamentoSemToken(this.id,metodoPagto).subscribe(
      res => {
        if (res.success) {
          this.mensagemTransacao(res);
        }
        loading.dismiss();
        this.dismiss();
      }
    );

  }

  async mensagemTransacao(res: ModeloBase) {
    window.open(res.dados, '_blank');

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Parabéns',
      subHeader: 'O pagamento foi gerado com sucesso',
      message: `Caso a página de pagamento não foi aberta pelo seu navegador <a href=\'${res.dados}\'  target="_blank"  >clique aqui.</a>`,
      buttons: ['OK']
    });

    await alert.present();
  }



  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }





}
