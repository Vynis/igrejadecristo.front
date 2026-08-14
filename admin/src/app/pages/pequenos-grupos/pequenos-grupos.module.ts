import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { PequenoGrupoAdminService } from '../../@core/services/pequeno-grupo-admin.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { PermissaoGuard } from '../../@core/utils/permissao.guard';
import { ComponentsModule } from '../components/components.module';
import { CheckinsListaComponent } from './checkins-lista/checkins-lista.component';
import { LiderBuscaDialogComponent } from './lider-busca-dialog/lider-busca-dialog.component';
import { LideresCadastroComponent } from './lideres-cadastro/lideres-cadastro.component';
import { LideresListaComponent } from './lideres-lista/lideres-lista.component';
import { MembrosCadastroComponent } from './membros-cadastro/membros-cadastro.component';
import { MembrosListaComponent } from './membros-lista/membros-lista.component';
import { NotificacoesCadastroComponent } from './notificacoes-cadastro/notificacoes-cadastro.component';
import { NotificacoesListaComponent } from './notificacoes-lista/notificacoes-lista.component';
import { PequenosGruposComponent } from './pequenos-grupos.component';
import { PgCadastroComponent } from './pg-cadastro/pg-cadastro.component';
import { PgListaComponent } from './pg-lista/pg-lista.component';
import { RelatorioGeralComponent } from './relatorio-geral/relatorio-geral.component';
import { RelatoriosCadastroComponent } from './relatorios-cadastro/relatorios-cadastro.component';
import { RelatoriosListaComponent } from './relatorios-lista/relatorios-lista.component';
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
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.pg.visualizar' },
        component: PgListaComponent,
      },
      {
        path: 'pg/cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.pg.criar' },
        component: PgCadastroComponent,
      },
      {
        path: 'pg/cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.pg.criar' },
        component: PgCadastroComponent,
      },
      {
        path: 'pg/cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.pg.editar' },
        component: PgCadastroComponent,
      },
      {
        path: 'lideres/lista',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.lideres.visualizar' },
        component: LideresListaComponent,
      },
      {
        path: 'lideres/cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.lideres.criar' },
        component: LideresCadastroComponent,
      },
      {
        path: 'lideres/cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.lideres.criar' },
        component: LideresCadastroComponent,
      },
      {
        path: 'lideres/cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.lideres.editar' },
        component: LideresCadastroComponent,
      },
      {
        path: 'notificacoes/lista',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.notificacoes.visualizar' },
        component: NotificacoesListaComponent,
      },
      {
        path: 'notificacoes/cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.notificacoes.criar' },
        component: NotificacoesCadastroComponent,
      },
      {
        path: 'notificacoes/cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.notificacoes.criar' },
        component: NotificacoesCadastroComponent,
      },
      {
        path: 'notificacoes/cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.notificacoes.editar' },
        component: NotificacoesCadastroComponent,
      },
      {
        path: 'membros/lista',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.visualizar' },
        component: MembrosListaComponent,
      },
      {
        path: 'membros/lista/:pgId',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.visualizar' },
        component: MembrosListaComponent,
      },
      {
        path: 'membros/cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.criar' },
        component: MembrosCadastroComponent,
      },
      {
        path: 'membros/cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.criar' },
        component: MembrosCadastroComponent,
      },
      {
        path: 'membros/cadastro/add/:pgId',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.criar' },
        component: MembrosCadastroComponent,
      },
      {
        path: 'membros/cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.membros.editar' },
        component: MembrosCadastroComponent,
      },
      {
        path: 'relatorios/lista',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.relatorios.visualizar' },
        component: RelatoriosListaComponent,
      },
      {
        path: 'relatorios/cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.relatorios.editar' },
        component: RelatoriosCadastroComponent,
      },
      {
        path: 'relatorio-geral',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.relatoriogeral.visualizar' },
        component: RelatorioGeralComponent,
      },
      {
        path: 'checkins',
        canActivate: [PermissaoGuard],
        data: { permissao: 'pequenosgrupos.checkins.visualizar' },
        component: CheckinsListaComponent,
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
    NbCheckboxModule,
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
    MembrosListaComponent,
    MembrosCadastroComponent,
    RelatoriosListaComponent,
    RelatoriosCadastroComponent,
    RelatorioGeralComponent,
    CheckinsListaComponent,
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
