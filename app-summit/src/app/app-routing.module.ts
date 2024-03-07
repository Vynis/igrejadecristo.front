import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthorizedGuard } from './pages/guards/authorized.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/account/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/account/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/account/reset/reset.module').then(m => m.ResetPageModule)
  },
  {
    path: 'checkout',
    canActivate: [AuthorizedGuard],
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  // {
  //   path: '',
  //   canActivate: [AuthorizedGuard],
  //   loadChildren: () => import('./pages/tablinks/tablinks.module').then( m => m.TablinksPageModule)
  // },
  {
    path: 'reset',
    loadChildren: () => import('./pages/account/reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
