import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MembrosPageRoutingModule } from './membros-routing.module';
import { MembrosPage } from './membros.page';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, SharedModule, MembrosPageRoutingModule],
  declarations: [MembrosPage],
  providers: [PequenoGrupoService]
})
export class MembrosPageModule { }
