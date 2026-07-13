import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { PequenoGrupoAdminService } from '../../@core/services/pequeno-grupo-admin.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { ComponentsModule } from '../components/components.module';
import { LiderBuscaDialogComponent } from './lider-busca-dialog/lider-busca-dialog.component';
import { LideresCadastroComponent } from './lideres-cadastro/lideres-cadastro.component';
import { LideresListaComponent } from './lideres-lista/lideres-lista.component';
import { NotificacoesCadastroComponent } from './notificacoes-cadastro/notificacoes-cadastro.component';
import { NotificacoesListaComponent } from './notificacoes-lista/notificacoes-lista.component';
import { PequenosGruposComponent } from './pequenos-grupos.component';
import { PgCadastroComponent } from './pg-cadastro/pg-cadastro.component';
import { PgListaComponent } from './pg-lista/pg-lista.component';
import { UsuarioBuscaDialogComponent } from './usuario-busca-dialog/usuario-busca-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: PequenosGruposComponent,
    children: [
      {
        path: '',
        redirectTo: 'pg/lista',
        pathMatch: 'full',
      },
      {
        path: 'pg/lista',
        component: PgListaComponent,
      },
      {
        path: 'pg/cadastro',
        component: PgCadastroComponent,
      },
      {
        path: 'pg/cadastro/add',
        component: PgCadastroComponent,
      },
      {
        path: 'pg/cadastro/edit/:id',
        component: PgCadastroComponent,
      },
      {
        path: 'lideres/lista',
        component: LideresListaComponent,
      },
      {
        path: 'lideres/cadastro',
        component: LideresCadastroComponent,
      },
      {
        path: 'lideres/cadastro/add',
        component: LideresCadastroComponent,
      },
      {
        path: 'lideres/cadastro/edit/:id',
        component: LideresCadastroComponent,
      },
      {
        path: 'notificacoes/lista',
        component: NotificacoesListaComponent,
      },
      {
        path: 'notificacoes/cadastro',
        component: NotificacoesCadastroComponent,
      },
      {
        path: 'notificacoes/cadastro/add',
        component: NotificacoesCadastroComponent,
      },
      {
        path: 'notificacoes/cadastro/edit/:id',
        component: NotificacoesCadastroComponent,
      },
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbDialogModule.forChild(),
    NbInputModule,
    NbSelectModule,
    ComponentsModule,
  ],
  declarations: [
    PequenosGruposComponent,
    PgListaComponent,
    PgCadastroComponent,
    LideresListaComponent,
    LideresCadastroComponent,
    NotificacoesListaComponent,
    NotificacoesCadastroComponent,
    LiderBuscaDialogComponent,
    UsuarioBuscaDialogComponent,
  ],
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
