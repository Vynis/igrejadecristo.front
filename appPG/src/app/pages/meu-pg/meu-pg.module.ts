import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MeuPgPageRoutingModule } from './meu-pg-routing.module';
import { MeuPgPage } from './meu-pg.page';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@NgModule({
  imports: [CommonModule, IonicModule, MeuPgPageRoutingModule],
  declarations: [MeuPgPage],
  providers: [PequenoGrupoService]
})
export class MeuPgPageModule { }
