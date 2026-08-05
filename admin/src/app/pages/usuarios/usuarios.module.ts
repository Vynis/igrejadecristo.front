import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { InterceptService } from '../../@core/utils/intercept.service';
import { ComponentsModule } from '../components/components.module';
import { UsuarioService } from '../../@core/services/usuario.service';
import { PermissaoGuard } from '../../@core/utils/permissao.guard';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosListaComponent } from './usuarios-lista/usuarios-lista.component';
import { UsuariosCadastroComponent } from './usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosProcessosInscricaoComponent } from './usuarios-processos-inscricao/usuarios-processos-inscricao.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      },
      {
        path: 'lista',
        component: UsuariosListaComponent
      },
      {
        path: 'cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'alunos.criar' },
        component: UsuariosCadastroComponent
      },
      {
        path: 'cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'alunos.criar' },
        component: UsuariosCadastroComponent
      },
      {
        path: 'cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'alunos.editar' },
        component: UsuariosCadastroComponent
      },
      {
        path: 'processos-inscricao/:idUsuario',
        canActivate: [PermissaoGuard],
        data: { permissao: 'alunos.visualizar_inscricoes' },
        component: UsuariosProcessosInscricaoComponent
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
    UsuariosComponent,
    UsuariosListaComponent,
    UsuariosCadastroComponent,
    UsuariosProcessosInscricaoComponent
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    UsuarioService
  ]
})
export class UsuariosModule { }
