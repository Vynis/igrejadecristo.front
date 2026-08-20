import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MeuPgPageRoutingModule } from './meu-pg-routing.module';
import { MeuPgPage } from './meu-pg.page';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, MeuPgPageRoutingModule],
  declarations: [MeuPgPage],
  providers: [PequenoGrupoService]
})
export class MeuPgPageModule { }
