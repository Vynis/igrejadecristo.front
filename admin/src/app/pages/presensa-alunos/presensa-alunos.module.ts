import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresensaAlunosComponent } from './presensa-alunos.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbInputModule, NbButtonModule, NbSelectModule, NbTabsetModule, NbAlertModule } from '@nebular/theme';
import { ComponentsModule } from '../components/components.module';
import { InterceptService } from '../../@core/utils/intercept.service';
import { PresencaUsuarioService } from '../../@core/services/presenca-usuario.service';

const routes: Routes = [
	{
		path: '',
		component: PresensaAlunosComponent,
		children: [
			{
				path: '',
				redirectTo: 'lista',
				pathMatch: 'full'
			},
			{
				path: 'lista',
				component: PresensaAlunosComponent
			},			
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
  declarations: [PresensaAlunosComponent],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
        useClass: InterceptService,
      multi: true
    },
    PresencaUsuarioService
    ]
})
export class PresensaAlunosModule { }
