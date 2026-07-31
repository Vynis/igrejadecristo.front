import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

import { MENU_ITEMS } from './pages-menu';
import { PermissaoService } from '../@core/services/permissao.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu: NbMenuItem[] = [];

  constructor(private permissaoService: PermissaoService) { }

  ngOnInit() {
    this.permissaoService.carregar().subscribe(() => {
      this.menu = this.filtrarMenu(MENU_ITEMS);
    });
  }

  private filtrarMenu(itens: NbMenuItem[]): NbMenuItem[] {
    return itens
      .map(item => ({
        ...item,
        children: item.children ? this.filtrarMenu(item.children) : null,
      }))
      .filter(item => {
        const permissao = item.data && item.data.permissao;
        const temPermissao = this.permissaoService.temPermissao(permissao);
        const temFilhos = item.children && item.children.length > 0;

        return temPermissao && (!item.children || temFilhos);
      });
  }
}
