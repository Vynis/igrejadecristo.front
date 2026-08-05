import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbSelectModule } from '@nebular/theme';
import { PermissoesAdminService } from '../../@core/services/permissoes-admin.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { PermissaoGuard } from '../../@core/utils/permissao.guard';
import { PermissoesComponent } from './permissoes.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PermissaoGuard],
    data: { permissao: 'permissoes.visualizar' },
    component: PermissoesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbSelectModule
  ],
  declarations: [PermissoesComponent],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    PermissoesAdminService
  ]
})
export class PermissoesModule { }
