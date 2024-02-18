import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CronogramaModel } from './model/cronograma.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  hora: number = 0;
  minuto: number = 0;
  segundo: number = 59;

  secaoAtual: string = '';
  ordemAtual: number = 0;

  interval: any;
  ehCultoSantaCeia: boolean = false;

  cronograma: CronogramaModel[] = [
    {
      qtdMinutos: 10,
      secao: 'EU VEJO'
    },
    {
      qtdMinutos: 15,
      secao: 'LOUVOR'
    },
    {
      qtdMinutos: 7,
      secao: 'PEDIDO DE ORAÇÃO / BEM VINDOS / CONEXAO'
    },
    {
      qtdMinutos: 35,
      secao: 'PALAVRA'
    },
    {
      qtdMinutos: 5,
      secao: 'MOMENTO GRATIDAO'
    },
    {
      qtdMinutos: 2,
      secao: 'ORAÇÃO FINAL'
    }
  ]

  cronogramaComCeia: CronogramaModel[] = [
    {
      qtdMinutos: 10,
      secao: 'EU VEJO'
    },
    {
      qtdMinutos: 15,
      secao: 'LOUVOR'
    },
    {
      qtdMinutos: 7,
      secao: 'PEDIDO DE ORAÇÃO / BEM VINDOS / CONEXAO'
    },
    {
      qtdMinutos: 35,
      secao: 'PALAVRA'
    },
    {
      qtdMinutos: 5,
      secao: 'SANTA CEIA'
    },
    {
      qtdMinutos: 5,
      secao: 'MOMENTO GRATIDAO'
    },
    {
      qtdMinutos: 2,
      secao: 'ORAÇÃO FINAL'
    }
  ]
  


  ngAfterViewInit() {

    if (localStorage.getItem('cronograma') == null){
      localStorage.setItem("cronograma", JSON.stringify(this.cronograma));
    }

    if (localStorage.getItem('cronogramaComSeia') == null){
      localStorage.setItem("cronogramaComSeia", JSON.stringify(this.cronogramaComCeia));
    }
    
    var cronogramaDefault =  localStorage.getItem('cronograma');

    this.cronograma = cronogramaDefault !== null ? JSON.parse(cronogramaDefault) : new Array<CronogramaModel>();

    this.start();
  }



  start() {
    this.minuto = this.cronograma[this.ordemAtual].qtdMinutos - 1;

    this.interval = setInterval(() => {

        if (this.ordemAtual == this.cronograma.length){
          this.secaoAtual = 'FIM';
          return;
        }
        
        
        this.segundo -= 1;

        this.secaoAtual = this.cronograma[this.ordemAtual].secao;


        if (this.segundo < 0) {

          if (this.minuto == 0) {
            this.ordemAtual +=1;
            this.minuto = this.cronograma[this.ordemAtual].qtdMinutos - 1;
            this.segundo = 59;

          }else {
            console.log(this.segundo);
            this.segundo = 59;
            this.minuto -= 1;
          }
        }


    },1000);

  }


  restart(){

    clearInterval(this.interval);

    this.hora = 0;
    this.segundo = 59;

    this.start();
  }

  next(){

    clearInterval(this.interval);

    this.ordemAtual +=1;
    this.hora = 0;
    this.segundo = 59;

    this.start();
  }

  previos(){
    clearInterval(this.interval);

    this.ordemAtual -=1;
    this.hora = 0;
    this.segundo = 59;

    this.start();
  }

  cronogramaCeia(){

    clearInterval(this.interval);
    var cronogramaDefault = !this.ehCultoSantaCeia ? localStorage.getItem('cronogramaComSeia') : localStorage.getItem('cronograma');

    this.cronograma = cronogramaDefault !== null ? JSON.parse(cronogramaDefault) : new Array<CronogramaModel>();

    this.hora = 0;
    this.segundo = 59;
    this.ordemAtual = 0;
    this.ehCultoSantaCeia = !this.ehCultoSantaCeia;

    this.start();

  }



}
