import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckComponent } from './check.component';
import { CheckHistoricoComponent } from './check-historico/check-historico.component';

const routes: Routes = [
  {
    path: '',
    component: CheckComponent,
  },
  {
    path: 'check-historico',
    component: CheckHistoricoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckPageRoutingModule {}