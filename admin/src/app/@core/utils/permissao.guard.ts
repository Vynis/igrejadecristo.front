import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissaoService } from '../services/permissao.service';

@Injectable({ providedIn: 'root' })
export class PermissaoGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissaoService: PermissaoService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const permissao = route.data && route.data.permissao;

    return this.permissaoService.carregar().pipe(
      map(() => {
        if (this.permissaoService.temPermissao(permissao))
          return true;

        this.router.navigateByUrl('/pages/dashboard');
        return false;
      })
    );
  }
}
