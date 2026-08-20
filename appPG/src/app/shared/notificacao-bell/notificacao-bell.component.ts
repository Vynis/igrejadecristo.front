import { Component, OnInit } from '@angular/core';
import { NotificacaoLiderService } from 'src/app/core/_services/notificacao-lider.service';

@Component({
  selector: 'app-notificacao-bell',
  templateUrl: './notificacao-bell.component.html',
  styleUrls: ['./notificacao-bell.component.scss']
})
export class NotificacaoBellComponent implements OnInit {
  quantidade = 0;

  constructor(private notificacaoService: NotificacaoLiderService) { }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.notificacaoService.resumo().subscribe(resumo => {
      this.quantidade = resumo.quantidadeNaoLidas;
    });
  }
}
