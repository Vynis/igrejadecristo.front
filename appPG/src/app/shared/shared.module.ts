import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotificacaoBellComponent } from './notificacao-bell/notificacao-bell.component';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  declarations: [NotificacaoBellComponent],
  exports: [NotificacaoBellComponent]
})
export class SharedModule { }
