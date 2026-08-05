import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { InterceptService } from '../../@core/utils/intercept.service';
import { ComponentsModule } from '../components/components.module';
import { UsuarioSistemaService } from '../../@core/services/usuario-sistema.service';
import { PermissaoGuard } from '../../@core/utils/permissao.guard';
import { UsuariosSistemaComponent } from './usuarios-sistema.component';
import { UsuariosSistemaListaComponent } from './usuarios-sistema-lista/usuarios-sistema-lista.component';
import { UsuariosSistemaCadastroComponent } from './usuarios-sistema-cadastro/usuarios-sistema-cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosSistemaComponent,
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full'
      },
      {
        path: 'lista',
        component: UsuariosSistemaListaComponent
      },
      {
        path: 'cadastro',
        canActivate: [PermissaoGuard],
        data: { permissao: 'usuariosistema.criar' },
        component: UsuariosSistemaCadastroComponent
      },
      {
        path: 'cadastro/add',
        canActivate: [PermissaoGuard],
        data: { permissao: 'usuariosistema.criar' },
        component: UsuariosSistemaCadastroComponent
      },
      {
        path: 'cadastro/edit/:id',
        canActivate: [PermissaoGuard],
        data: { permissao: 'usuariosistema.editar' },
        component: UsuariosSistemaCadastroComponent
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
    UsuariosSistemaComponent,
    UsuariosSistemaListaComponent,
    UsuariosSistemaCadastroComponent
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    UsuarioSistemaService
  ]
})
export class UsuariosSistemaModule { }
