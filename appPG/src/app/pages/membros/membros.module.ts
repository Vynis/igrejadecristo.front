import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MembrosPageRoutingModule } from './membros-routing.module';
import { MembrosPage } from './membros.page';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, MembrosPageRoutingModule],
  declarations: [MembrosPage],
  providers: [PequenoGrupoService]
})
export class MembrosPageModule { }
