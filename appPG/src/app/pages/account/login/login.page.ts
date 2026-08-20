import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { finalize, tap } from 'rxjs/operators';
import { SecurityUtil } from 'src/app/core/utils/security.util';
import { AuthService } from 'src/app/core/_services/auth.service';
import { NotificacaoLiderService } from 'src/app/core/_services/notificacao-lider.service';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public hide = true;
  public form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private authService: AuthService,
    private pequenoGrupoService: PequenoGrupoService,
    private notificacaoService: NotificacaoLiderService
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
  }

  ngOnInit() {

  }

  toggleHide() {
    this.hide = !this.hide;
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
          SecurityUtil.set(res.dados);
          this.validarLiderPg(loading);

        } else {
          this.showError('Login inválido. E-mail/CPF ou senha incorretos.');
        }
      },
      err => {
        this.showError('Login inválido. E-mail/CPF ou senha incorretos.');
        loading.dismiss();
      }
    );

  }

  validarLiderPg(loading) {
    this.pequenoGrupoService.meuPg().subscribe(res => {
      loading.dismiss();

      if (res.success) {
        this.navCtrl.navigateRoot('/tablinks/meu-pg');
        this.avisarRelatorioPendente();
        return;
      }

      SecurityUtil.clear();
      this.showError('Acesso permitido apenas para líderes de PG ativos.');
    }, () => {
      loading.dismiss();
      SecurityUtil.clear();
      this.showError('Não foi possível validar seu acesso à área do líder de PG.');
    });
  }

  avisarRelatorioPendente() {
    this.notificacaoService.resumo().subscribe(async resumo => {
      if (!resumo.relatorioSemanalPendente) {
        return;
      }

      const alert = await this.alertCtrl.create({
        header: 'Relatório semanal pendente',
        message: 'Você ainda não preencheu o relatório da reunião desta semana do PG.',
        buttons: [
          {
            text: 'Lembrar depois',
            role: 'cancel'
          },
          {
            text: 'Preencher agora',
            handler: () => this.navCtrl.navigateRoot('/tablinks/relatorios')
          }
        ]
      });

      alert.present();
    });
  }

  async showError(message) {
    const error = await this.toastCtrl.create({ message: message, duration: 3000 });
    error.present();
  }

  async resetPassword() {
    if (this.form.controls['email'].invalid) {
      this.showError("E-mail/CPF inválido");
      return;
    }

    const loading = await this.loadCtrl.create({ message: 'Solicitando recuperação de senha...' });
    loading.present();

    this.authService.requestPassword(this.form.controls['email'].value).pipe(
			tap(response => {
        loading.dismiss();
				if (response.success) {
					if (response.dados.possuiEmail)
						this.showError('Email enviado com sucesso!');
					else
						this.showError('A solicitação foi enviada para nossa equipe. Em breve entraremos em contato.');
				} else {
					this.showError('Não existe e-mail/CPF cadastrado em nossa base de dados.');
				}
			}),
			finalize(() => {
        loading.dismiss();
			})
		).subscribe();
  }

  cadastro() {
    this.showError('Cadastro deve ser solicitado à administração.');
  }

}
