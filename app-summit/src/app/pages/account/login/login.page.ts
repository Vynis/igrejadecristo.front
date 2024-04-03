import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { SecurityUtil } from 'src/app/core/utils/security.util';
import { AuthService } from 'src/app/core/_services/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  public hide = true;
  public form: FormGroup;



  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private authService: AuthService,
    private faio: FingerprintAIO,
    private plataform: Platform,
    public alertController: AlertController,
  ) { 
		this.form = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(320)
			])
			],
			password: ['', Validators.required]
		});
    
    this.authenticate();
  }

  toggleHide() {
    this.hide = !this.hide;
    
  }

  async authenticate() {

    try {
      await this.plataform.ready();
      const availabe = await this.faio.isAvailable();

      if (availabe === 'biometric') {
        
        if (SecurityUtil.getToken() !== null) {
          await this.faio.loadBiometricSecret({
            description: 'Summitt Academy precisa confirmar sua identidade',
          }).then((valor) => {
              var secret = valor.split('|');
              const email = secret[0];
              const senha = secret[1];

              this.loginSimplificado(email,senha);
          });  

        }

      }

    } 
    catch(e) {
      console.log(e);
    }

  }

  async loginSimplificado(email,senha) {
    const loading = await this.loadCtrl.create({ message: 'Autenticando...' });
    loading.present();

    this.authService.login(email,senha).subscribe(
      res => {
        if (res.success) { 
          this.redirecionaPagina(res);
        } else {
          this.showError('Login inválido. Email/Cpf ou Senha estão incorreto!');
        }
        loading.dismiss();
      },
      err => {
        this.showError('Login inválido. Email/Cpf ou Senha estão incorreto!');
        loading.dismiss();
      }
    );
  }

  async submit() {

    if (this.form.invalid)
      return;

    const loading = await this.loadCtrl.create({ message: 'Autenticando...' });
    loading.present();

    const controls = this.form.controls;

    const authData = {
			email: controls.email.value,
			password: controls.password.value
		};

    this.authService.login(authData.email,authData.password).subscribe(
      res => {
        if (res.success) { 

          if (this.plataform.is('pwa') || this.plataform.is('mobileweb') || this.plataform.is('desktop')){
            this.redirecionaPagina(res);
          }else {
            this.registerFingerPring(res);
          }

        } else {
          this.showError('Login inválido. Email/Cpf ou Senha estão incorreto!');
        }
        loading.dismiss();
      },
      err => {
        this.showError('Login inválido. Email/Cpf ou Senha estão incorreto!');
        loading.dismiss();
      }
    );

  }

  async showError(message) {
    const error = await this.toastCtrl.create({ message: message, duration: 3000 });
    error.present();
  }

  async resetPassword() {
    if (this.form.controls['email'].invalid) {
      this.showError("Email/CPF inválido");
      return;
    }

    const loading = await this.loadCtrl.create({ message: 'Restaurando sua senha...' });
    loading.present();

    this.authService.requestPassword(this.form.controls['email'].value).pipe(
			tap(response => {
        loading.dismiss();
				if (response.success) {
					if (response.dados.possuiEmail)
						this.showError('Email enviado com sucesso!');
					else
						this.showError('Foi enviado um solicitação para email de nossa equipe. Em breve entraremos em contato.');
				} else {
					this.showError('Não existe Email/Cpf cadastrado em nossa base de dados.');
				}
			}),
			finalize(() => {
        loading.dismiss();
			})
		).subscribe();
  }

  cadastro() {
    this.navCtrl.navigateRoot('/register');
  }

  redirecionaPagina(res) {
    SecurityUtil.set(res.dados);
    if (res.dados.usuario.dadosComp) 
      this.navCtrl.navigateRoot('/tablinks/home');
    else
      this.navCtrl.navigateRoot('/tablinks/meus-dados/endereco');
  }


  async registerFingerPring(res) {
    const controls = this.form.controls;


    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseja realizar o login de forma biometrica?',
      message: '',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.redirecionaPagina(res);
          }
        }, {
          text: 'Sim',
          handler: () => {
            

              this.faio.registerBiometricSecret({
                description: 'Summitt Academy precisa confirmar sua identidade',
                secret: `${controls.email.value}|${controls.password.value}` ,
                invalidateOnEnrollment: true,
                disableBackup: true
              }, ).then((val) => {
                this.showMessage('Cadastro biometrico realizado com sucesso!');

                this.redirecionaPagina(res);

              },
              (err) => this.showError(err) );



          }
        }
      ]
    });

    await alert.present();
	}


  async showMessage(message) {
    const msg = await this.toastCtrl.create({ message: message, duration: 3000 });
    msg.present();
  }

}
