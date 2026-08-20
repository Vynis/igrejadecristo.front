import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { PermissaoGuard } from '../@core/utils/permissao.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
      canActivate: [PermissaoGuard],
      data: { permissao: 'dashboard.visualizar' },
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'cursos',
      canActivate: [PermissaoGuard],
      data: { permissao: 'cursos.visualizar' },
      loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosModule),
    },
    {
      path: 'processo-inscricao',
      canActivate: [PermissaoGuard],
      data: { permissao: 'processoinscricao.visualizar' },
      loadChildren: () => import('./processo-inscricao/processo-inscricao.module').then(m => m.ProcessoInscricaoModule),
    },
    {
      path: 'usuarios',
      canActivate: [PermissaoGuard],
      data: { permissao: 'alunos.visualizar' },
      loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    },
    {
      path: 'usuarios-sistema',
      canActivate: [PermissaoGuard],
      data: { permissao: 'usuariosistema.visualizar' },
      loadChildren: () => import('./usuarios-sistema/usuarios-sistema.module').then(m => m.UsuariosSistemaModule),
    },
    {
      path: 'permissoes',
      canActivate: [PermissaoGuard],
      data: { permissao: 'permissoes.visualizar' },
      loadChildren: () => import('./permissoes/permissoes.module').then(m => m.PermissoesModule),
    },
    {
      path: 'relatorios',
      canActivate: [PermissaoGuard],
      data: { permissao: 'relatorios.visualizar' },
      loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosModule),
    },
    {
      path: 'presenca-alunos',
      canActivate: [PermissaoGuard],
      data: { permissao: 'presenca.visualizar' },
      loadChildren: () => import('./presensa-alunos/presensa-alunos.module').then(m => m.PresensaAlunosModule),
    },
    {
      path: 'pequenos-grupos',
      canActivate: [PermissaoGuard],
      data: { permissao: 'pequenosgrupos.visualizar' },
      loadChildren: () => import('./pequenos-grupos/pequenos-grupos.module').then(m => m.PequenosGruposModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
