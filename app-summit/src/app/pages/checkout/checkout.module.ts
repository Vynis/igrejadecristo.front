import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { InscricaoUsuarioService } from 'src/app/core/_services/inscricaoUsuario.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CheckoutRoutingModule
  ],
  declarations: [CheckoutComponent],
  providers: [
    InscricaoUsuarioService
  ]
})
export class CheckoutModule { }
