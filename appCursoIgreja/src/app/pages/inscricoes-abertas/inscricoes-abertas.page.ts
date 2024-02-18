import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { InscricaoUsuario } from 'src/app/core/_models/inscricaoUsuario.model';
import { ModeloBase } from 'src/app/core/_models/modelo-base';
import { ProcessoInscricao } from 'src/app/core/_models/processoInscricao.model';
import { InscricaoUsuarioService } from 'src/app/core/_services/inscricaoUsuario.service';
import { ProcessoInscricaoService } from 'src/app/core/_services/processoInscricao.service';
import { dateToString } from 'src/app/core/utils/date';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-inscricoes-abertas',
  templateUrl: './inscricoes-abertas.page.html',
  styleUrls: ['./inscricoes-abertas.page.scss'],
})
export class InscricoesAbertasPage implements OnInit {
  public listaInscricoesAbertas: ProcessoInscricao[];
  public listaInscricoesAbertasBackup: ProcessoInscricao[];

  constructor(
    private processoInscricao:  ProcessoInscricaoService,
    private loadCtrl: LoadingController,
    public alertController: AlertController,
    private inscricaoUsuarioService: InscricaoUsuarioService,
    private toastCtrl: ToastController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.buscarInscricoesAbertas(null);
  }

  ionViewWillEnter() {
    this.buscarInscricoesAbertas(null);
  }

  async buscarInscricoesAbertas(event) {
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

    this.processoInscricao.buscarCursosDisponivel().subscribe(
      res => {
        if (res.success){
          this.listaInscricoesAbertas = res.dados;
          this.listaInscricoesAbertasBackup = res.dados;
          console.log(res.dados);
        }

        if (event !== null)
          event.target.complete();
        loading.dismiss();

      },
      err => {
        loading.dismiss();
      }
    )
  }

  async filtro(evento) {
    this.listaInscricoesAbertas = this.listaInscricoesAbertasBackup;
    const searchTerm = evento.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listaInscricoesAbertas = this.listaInscricoesAbertas.filter(item => {
      if (item.curso.titulo && searchTerm) {
        return (item.curso.titulo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.curso.titulo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });

  }

 async inscrever(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tem certeza que deseja se inscrever para este curso',
      message: '',
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
            this.alertaAceitaTermoUso(id);
          }
        }
      ]
    });

    await alert.present();
	}

  mensagemTermo(idProcessoInscricao: number) {
    var texto = '';
    const dadosCurso = this.listaInscricoesAbertasBackup.filter(x => x.id == idProcessoInscricao)[0];

    texto = '- O <b>cadastro</b> será efetivado somente mediante pagamento da inscrição por uma das opções oferecidas na plataforma.<br>';
    texto+= '- O <b>acesso</b> ao sistema para as atividades do curso será liberado mediante a agenda programada para ciclos de formação:<br><br>';
    texto+= `${dadosCurso.curso.titulo}: ${dateToString(dadosCurso.dataInicioVisualizacaoCurso)} até ${dateToString(dadosCurso.dataFinalVisualizacaoCurso)} <br><br>`;
    texto+= '- O <b>certificado de conclusão</b> satisfatória será concedido mediante o percentual de 100% de acesso as atividades até a data programada para a conclusão do curso.';
    return texto;
  }

  async alertaAceitaTermoUso(id: number) {
		var inscricaoUsuario = new InscricaoUsuario();
		inscricaoUsuario.processoInscricaoId = id;
		inscricaoUsuario.status = 'AG';


    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `Termo de acordo Summit Academy ${new Date().getFullYear()}`,
      message: this.mensagemTermo(id),
      buttons: [
        {
          text: 'Não Aceito',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceito',
          handler: () => {
            this.inscreverUsuario(inscricaoUsuario);
          }
        }
      ]
    });

    await alert.present();
  }

  async inscreverUsuario(inscricaoUsuario: InscricaoUsuario) {
    const loading = await this.loadCtrl.create({ message: 'Aguarde...' });
    loading.present();

		this.inscricaoUsuarioService.cadastrarSemToken(inscricaoUsuario).subscribe(
		 res => {
				if (res.success) {
					let dados = res.dados;

					if (dados.processoInscricao.tipo === 'P') {
            this.presentModal(dados);
					}
					else {
            this.mensagemConfirmacao();
					}

				} else {
          this.showMessage(res.dados);
        }

        loading.dismiss();
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
    this.buscarInscricoesAbertas(null);
  }

  async mensagemConfirmacao() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Parabéns',
      subHeader: '',
      message: `Parabéns sua incrição foi realizado com sucesso. Vamos iniciar o curso...`,
      buttons: ['OK']
    });

    await alert.present();
    this.buscarInscricoesAbertas(null);
  }

  async showMessage(message) {
    const msg = await this.toastCtrl.create({ message: message, duration: 3000 });
    msg.present();
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
      this.buscarInscricoesAbertas(null);
    });

    return await modal.present();
  }

}
