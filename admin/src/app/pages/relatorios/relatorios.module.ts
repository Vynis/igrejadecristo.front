import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosComponent } from './relatorios.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbInputModule, NbButtonModule, NbSelectModule, NbTabsetModule, NbAlertModule } from '@nebular/theme';
import { ComponentsModule } from '../components/components.module';
import { RelatoriosInscricoesComponent } from './relatorios-inscricoes/relatorios-inscricoes.component';
import { RelatorioService } from '../../@core/services/relatorio.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { RelatoriosPresencaComponent } from './relatorios-presenca/relatorios-presenca.component';
import { ProcessoInscricaoService } from '../../@core/services/processo-inscricao.service';

const routes: Routes = [
	{
		path: '',
		component: RelatoriosComponent,
		children: [
			{
				path: '',
				redirectTo: 'relatorio-inscricoes',
				pathMatch: 'full'
			},
      {
        path: 'relatorio-inscricoes',
        component: RelatoriosInscricoesComponent
      },
      {
        path: 'relatorio-presenca',
        component: RelatoriosPresencaComponent
      }
		]
	}
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbTabsetModule,
    ReactiveFormsModule,
    NbSelectModule,
    ComponentsModule,
    NbAlertModule
  ],
  declarations: [RelatoriosComponent, RelatoriosInscricoesComponent, RelatoriosPresencaComponent],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
        useClass: InterceptService,
      multi: true
    },
    RelatorioService,
    ProcessoInscricaoService
  ]
})
export class RelatoriosModule { }
