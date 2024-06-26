
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/core/_models/usurario.model';
import { SecurityUtil } from 'src/app/core/utils/security.util';


@Component({
  selector: 'app-tablinks',
  templateUrl: './tablinks.page.html',
  styleUrls: ['./tablinks.page.scss'],
})
export class TablinksPage implements OnInit {
  public user: Usuario ;
  
  constructor() { 
    this.user = new Usuario();
  }

  ngOnInit() {
    this.user = SecurityUtil.getUsuario();
  }

}
