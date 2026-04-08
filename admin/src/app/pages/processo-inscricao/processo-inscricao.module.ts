import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ProcessoInscricaoService } from '../../@core/services/processo-inscricao.service';
import { InterceptService } from '../../@core/utils/intercept.service';
import { ComponentsModule } from '../components/components.module';
import { CursosService } from '../../@core/services/cursos.service';
import { ProcessoInscricaoComponent } from './processo-inscricao.component';
import { ProcessoInscricaoListaComponent } from './processo-inscricao-lista/processo-inscricao-lista.component';
import { ProcessoInscricaoCadastroComponent } from './processo-inscricao-cadastro/processo-inscricao-cadastro.component';
import { ProcessoInscricaoUsuariosComponent } from './processo-inscricao-usuarios/processo-inscricao-usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessoInscricaoComponent,
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      },
      {
        path: 'lista',
        component: ProcessoInscricaoListaComponent
      },
      {
        path: 'cadastro',
        component: ProcessoInscricaoCadastroComponent
      },
      {
        path: 'cadastro/add',
        component: ProcessoInscricaoCadastroComponent
      },
      {
        path: 'cadastro/edit/:id',
        component: ProcessoInscricaoCadastroComponent
      },
      {
        path: 'usuarios-inscritos/:idProcessoInscricao',
        component: ProcessoInscricaoUsuariosComponent
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
    ReactiveFormsModule,
    ComponentsModule,
    NbAlertModule
  ],
  declarations: [
    ProcessoInscricaoComponent,
    ProcessoInscricaoListaComponent,
    ProcessoInscricaoCadastroComponent,
    ProcessoInscricaoUsuariosComponent
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    ProcessoInscricaoService,
    CursosService
  ]
})
export class ProcessoInscricaoModule { }
