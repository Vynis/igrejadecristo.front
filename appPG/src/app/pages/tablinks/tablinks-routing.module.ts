import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablinksPage } from './tablinks.page';
import { LiderPgGuard } from '../guards/lider-pg.guard';

const routes: Routes = [
  {
    path: 'tablinks',
    component: TablinksPage,
    children: [
      {
        path: 'meu-pg',
        canActivate: [LiderPgGuard],
        loadChildren: () => import('../meu-pg/meu-pg.module').then(m => m.MeuPgPageModule)
      },
      {
        path: 'membros',
        canActivate: [LiderPgGuard],
        loadChildren: () => import('../membros/membros.module').then(m => m.MembrosPageModule)
      },
      {
        path: 'relatorios',
        canActivate: [LiderPgGuard],
        loadChildren: () => import('../relatorios/relatorios.module').then(m => m.RelatoriosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: '/tablinks/meu-pg',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tablinks/meu-pg',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablinksPageRoutingModule {}
