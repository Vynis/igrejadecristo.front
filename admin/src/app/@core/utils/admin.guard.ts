import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissaoService } from '../services/permissao.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissaoService: PermissaoService
  ) { }

  canActivate(): Observable<boolean> {
    return this.permissaoService.carregar().pipe(
      map(() => {
        if (this.permissaoService.temPerfil('Administrador'))
          return true;

        this.router.navigateByUrl('/pages/dashboard');
        return false;
      })
    );
  }
}
