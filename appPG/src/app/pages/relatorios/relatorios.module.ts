import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RelatoriosPageRoutingModule } from './relatorios-routing.module';
import { RelatoriosPage } from './relatorios.page';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RelatoriosPageRoutingModule],
  declarations: [RelatoriosPage],
  providers: [PequenoGrupoService]
})
export class RelatoriosPageModule { }
