import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ConfirmPasswordValidator } from 'src/app/core/utils/confirm-password.validator';
import { AuthService } from './../../../core/_services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  public etapa: number = 1; // 1 = Solicitar código, 2 = Validar código, 3 = Nova senha

  public formSolicitar: FormGroup;
  public formCodigo: FormGroup;
  public formSenha: FormGroup;

  public emailOuCpf: string = '';
  public emailMascarado: string = '';
  public tokenTemporario: string = '';
  public codigoLegado: string = '';

  public hideSenha: boolean = true;
  public hideConfirmar: boolean = true;

  constructor(
    private fb: FormBuilder,
    private routeActive: ActivatedRoute,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.verificarParametrosEntrada();
  }

  initForms() {
    this.formSolicitar = this.fb.group({
      emailOuCpf: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.formCodigo = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });

    this.formSenha = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(4)]],
      confirmarSenha: ['', [Validators.required]]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  verificarParametrosEntrada() {
    // 1. Verifica se veio algum termo da tela de login (?termo=...)
    this.routeActive.queryParams.subscribe(params => {
      if (params && params['termo']) {
        this.formSolicitar.get('emailOuCpf').setValue(params['termo']);
      }
    });

    // 2. Verifica se veio com :id na rota (link legado ou token temporário direto)
    this.routeActive.params.subscribe(async params => {
      if (params && params['id']) {
        const idParam = params['id'];
        const loading = await this.loadCtrl.create({ message: 'Validando credenciais...' });
        await loading.present();

        this.authService.validaRecuperacaoSenha(idParam).subscribe(
          res => {
            loading.dismiss();
            if (res && res.success) {
              this.codigoLegado = idParam;
              this.etapa = 3; // Vai direto para nova senha
            } else {
              this.showMessage('Link de recuperação inválido ou expirado. Solicite um novo código.');
              this.etapa = 1;
            }
          },
          err => {
            loading.dismiss();
            this.showMessage('Erro ao validar link. Solicite um novo código.');
            this.etapa = 1;
          }
        );
      }
    });
  }

  toggleHideSenha() {
    this.hideSenha = !this.hideSenha;
  }

  toggleHideConfirmar() {
    this.hideConfirmar = !this.hideConfirmar;
  }

  // ==========================================
  // ETAPA 1: Solicitar Código
  // ==========================================
  async solicitarCodigo() {
    if (this.formSolicitar.invalid) return;

    this.emailOuCpf = this.formSolicitar.get('emailOuCpf').value.trim();

    const loading = await this.loadCtrl.create({ message: 'Enviando código de verificação...' });
    await loading.present();

    this.authService.solicitarCodigoRecuperacao(this.emailOuCpf).subscribe(
      res => {
        loading.dismiss();
        if (res && res.success) {
          this.emailMascarado = res.dados?.emailMascarado || this.emailOuCpf;
          this.showMessage('Código enviado com sucesso! Verifique seu e-mail.');
          this.formCodigo.reset();
          this.etapa = 2;
        } else {
          this.showMessage(res?.mensagem || 'Não foi possível enviar o código. Verifique os dados digitados.');
        }
      },
      err => {
        loading.dismiss();
        const msg = err?.error?.mensagem || 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
        this.showMessage(msg);
      }
    );
  }

  // ==========================================
  // ETAPA 2: Validar Código
  // ==========================================
  async validarCodigo() {
    if (this.formCodigo.invalid) return;

    const codigo = this.formCodigo.get('codigo').value.trim();

    const loading = await this.loadCtrl.create({ message: 'Validando código...' });
    await loading.present();

    this.authService.validarCodigoRecuperacao(this.emailOuCpf, codigo).subscribe(
      res => {
        loading.dismiss();
        if (res && res.success) {
          this.tokenTemporario = res.dados?.tokenTemporario;
          this.showMessage('Código validado com sucesso!');
          this.formSenha.reset();
          this.etapa = 3;
        } else {
          this.showMessage(res?.mensagem || 'Código incorreto ou expirado.');
        }
      },
      err => {
        loading.dismiss();
        const msg = err?.error?.mensagem || 'Erro ao validar código. Tente novamente.';
        this.showMessage(msg);
      }
    );
  }

  async reenviarCodigo() {
    if (!this.emailOuCpf) {
      this.etapa = 1;
      return;
    }

    const loading = await this.loadCtrl.create({ message: 'Reenviando novo código...' });
    await loading.present();

    this.authService.solicitarCodigoRecuperacao(this.emailOuCpf).subscribe(
      res => {
        loading.dismiss();
        if (res && res.success) {
          this.emailMascarado = res.dados?.emailMascarado || this.emailMascarado;
          this.showMessage('Novo código enviado para seu e-mail!');
          this.formCodigo.reset();
        } else {
          this.showMessage(res?.mensagem || 'Erro ao reenviar código.');
        }
      },
      err => {
        loading.dismiss();
        this.showMessage('Erro ao reenviar código.');
      }
    );
  }

  voltarEtapa1() {
    this.etapa = 1;
  }

  // ==========================================
  // ETAPA 3: Salvar Nova Senha
  // ==========================================
  async salvarNovaSenha() {
    if (this.formSenha.invalid) return;

    const novaSenha = this.formSenha.get('senha').value;

    const loading = await this.loadCtrl.create({ message: 'Salvando sua nova senha...' });
    await loading.present();

    // Se temos tokenTemporario (fluxo novo com código)
    if (this.tokenTemporario) {
      this.authService.redefinirSenhaComCodigo(this.tokenTemporario, novaSenha).subscribe(
        res => {
          loading.dismiss();
          if (res && res.success) {
            this.showMessage('Senha alterada com sucesso! Entre com sua nova senha.');
            this.navCtrl.navigateRoot('/login');
          } else {
            this.showMessage(res?.mensagem || 'Erro ao alterar a senha. Tente novamente.');
          }
        },
        err => {
          loading.dismiss();
          const msg = err?.error?.mensagem || 'Erro ao alterar a senha.';
          this.showMessage(msg);
        }
      );
    } else if (this.codigoLegado) {
      // Se veio pelo link legado com :id
      this.authService.alterarSenha(this.codigoLegado, novaSenha).subscribe(
        res => {
          loading.dismiss();
          if (res && res.success) {
            this.showMessage('Senha alterada com sucesso! Entre com sua nova senha.');
            this.navCtrl.navigateRoot('/login');
          } else {
            this.showMessage('Senha não foi alterada. Favor contate nossa equipe de apoio.');
          }
        },
        err => {
          loading.dismiss();
          this.showMessage('Erro ao alterar senha.');
        }
      );
    } else {
      loading.dismiss();
      this.showMessage('Sessão expirada. Por favor, reinicie a recuperação.');
      this.etapa = 1;
    }
  }

  voltarParaLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3500,
      position: 'bottom'
    });
    toast.present();
  }
}
