import { Component, OnInit } from '@angular/core';
import { MeuPgResponse } from 'src/app/core/_models/pequeno-grupo.model';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Component({
  selector: 'app-meu-pg',
  templateUrl: './meu-pg.page.html',
  styleUrls: ['./meu-pg.page.scss']
})
export class MeuPgPage implements OnInit {
  dados: MeuPgResponse;

  constructor(private pequenoGrupoService: PequenoGrupoService) { }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.pequenoGrupoService.meuPg().subscribe(res => {
      if (res.success) {
        this.dados = res.dados;
      }
    });
  }
}
