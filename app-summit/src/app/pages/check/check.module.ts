import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckComponent } from './check.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckPageRoutingModule } from './check-rounting.module';
import { CheckUsuarioService } from 'src/app/core/_services/check-usuario.service';
import { CheckHistoricoComponent } from './check-historico/check-historico.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CheckComponent,CheckHistoricoComponent],
  providers: [
    CheckUsuarioService
  ]
})
export class CheckModule { }
