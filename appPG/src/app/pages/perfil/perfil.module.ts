import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PerfilPageRoutingModule } from './perfil-routing.module';
import { PerfilPage } from './perfil.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({ imports: [CommonModule, IonicModule, SharedModule, PerfilPageRoutingModule], declarations: [PerfilPage] })
export class PerfilPageModule { }
