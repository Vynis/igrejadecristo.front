import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UsuarioSistemaService } from './usuario-sistema.service';

@Injectable({ providedIn: 'root' })
export class PermissaoService {
  private permissoes: string[] = [];
  private perfis: string[] = [];
  private administrador = false;
  private carregado = false;
  private tokenCarregado = '';

  constructor(private usuarioSistemaService: UsuarioSistemaService) { }

  carregar(): Observable<boolean> {
    const tokenAtual = localStorage.getItem('auth_app_token') || '';

    if (this.carregado && this.tokenCarregado === tokenAtual)
      return of(true);

    return this.usuarioSistemaService.obterDadosUsuarioLogado().pipe(
      tap(usuario => {
        this.perfis = usuario?.perfis || [];
        this.permissoes = usuario?.permissoes || [];
        this.administrador = usuario?.administrador === true || this.permissoes.includes('*');
        this.carregado = true;
        this.tokenCarregado = tokenAtual;
      }),
      map(() => true),
      catchError(() => {
        this.limpar();
        return of(false);
      })
    );
  }

  temPermissao(chave: string): boolean {
    if (!chave)
      return true;

    return this.administrador || this.permissoes.includes('*') || this.permissoes.includes(chave);
  }

  temPerfil(perfil: string): boolean {
    return this.administrador || this.perfis.includes(perfil);
  }

  limpar() {
    this.permissoes = [];
    this.perfis = [];
    this.administrador = false;
    this.carregado = false;
    this.tokenCarregado = '';
  }
}
