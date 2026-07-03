import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeuPgPage } from './meu-pg.page';

const routes: Routes = [{ path: '', component: MeuPgPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeuPgPageRoutingModule { }
