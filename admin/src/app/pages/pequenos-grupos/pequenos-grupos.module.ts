import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { PequenoGrupoAdminService } from '../../@core/services/pequeno-grupo-admin.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { PequenosGruposComponent } from './pequenos-grupos.component';

const routes: Routes = [
  {
    path: '',
    component: PequenosGruposComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbTabsetModule,
  ],
  declarations: [PequenosGruposComponent],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
    PequenoGrupoAdminService,
  ],
})
export class PequenosGruposModule { }
