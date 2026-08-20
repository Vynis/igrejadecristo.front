import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificacoesPageRoutingModule } from './notificacoes-routing.module';
import { NotificacoesPage } from './notificacoes.page';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, NotificacoesPageRoutingModule],
  declarations: [NotificacoesPage]
})
export class NotificacoesPageModule { }
