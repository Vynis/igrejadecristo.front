import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SecurityUtil } from 'src/app/core/utils/security.util';
import { Usuario } from 'src/app/core/_models/usurario.model';

@Component({ selector: 'app-perfil', templateUrl: './perfil.page.html', styleUrls: ['./perfil.page.scss'] })
export class PerfilPage implements OnInit {
  usuario: Usuario;

  constructor(private navCtrl: NavController) { }

  ngOnInit() { this.usuario = SecurityUtil.getUsuario(); }

  sair() {
    SecurityUtil.clear();
    this.navCtrl.navigateRoot('/login');
  }
}
