import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacaoLider } from 'src/app/core/_models/notificacao-lider.model';
import { NotificacaoLiderService } from 'src/app/core/_services/notificacao-lider.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss']
})
export class NotificacoesPage implements OnInit {
  notificacoes: NotificacaoLider[] = [];
  carregando = false;

  constructor(private notificacaoService: NotificacaoLiderService, private router: Router) { }

  ngOnInit() {
    this.carregar();
  }

  ionViewWillEnter() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.notificacaoService.notificacoes().subscribe(notificacoes => {
      this.notificacoes = notificacoes;
      this.carregando = false;
    }, () => {
      this.carregando = false;
    });
  }

  atualizar(event: any) {
    this.notificacaoService.notificacoes().subscribe(notificacoes => {
      this.notificacoes = notificacoes;
      event.target.complete();
    }, () => {
      event.target.complete();
    });
  }

  abrir(notificacao: NotificacaoLider) {
    if (notificacao.id > 0 && !notificacao.lida) {
      this.notificacaoService.marcarLida(notificacao.id).subscribe(() => this.carregar());
    }

    if (notificacao.acaoUrl) {
      this.router.navigateByUrl(notificacao.acaoUrl);
    }
  }
}
