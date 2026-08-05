import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SecurityUtil } from 'src/app/core/utils/security.util';
import { PequenoGrupoService } from 'src/app/core/_services/pequeno-grupo.service';

@Injectable()
export class LiderPgGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private pequenoGrupoService: PequenoGrupoService
  ) { }

  canActivate(): Observable<boolean> {
    return this.pequenoGrupoService.meuPg().pipe(
      map(res => {
        if (res.success) {
          return true;
        }

        this.bloquear('Usuário sem permissão para acessar o módulo de PG.');
        return false;
      }),
      catchError(() => {
        this.bloquear('Acesso ao módulo de PG não autorizado.');
        return of(false);
      })
    );
  }

  private async bloquear(message: string) {
    SecurityUtil.clear();
    const toast = await this.toastCtrl.create({ message, duration: 3000 });
    toast.present();
    this.router.navigate(['/login']);
  }
}
