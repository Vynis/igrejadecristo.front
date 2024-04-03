import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PresencaUsuarioService } from '../../@core/services/presenca-usuario.service';
import { PresencaUsuarioModel } from '../../@core/models/presenca-usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-presensa-alunos',
  templateUrl: './presensa-alunos.component.html',
  styleUrls: ['./presensa-alunos.component.scss']
})
export class PresensaAlunosComponent implements OnInit {
  formulario: FormGroup;
  contTodos: number = 0;
  contRealizados: number = 0;
  contRestantes: number = 0;
  listaAulas: any[];
  listaTodasPresencas: any[];
  listaTodasPresencasCopy: any[];
  listaRealizados: any[];
  listaRealizadosCopy: any[];
  listaNaoRealizados: any[];
  listaNaoRealizadosCopy: any[];
  valorFiltroTodos: string = '';

  constructor(
    private presencaUsuarioService: PresencaUsuarioService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {



    this.buscarAulas();
  }

  buscarAulas() {
    this.presencaUsuarioService.buscarAulasDisponiveis().subscribe(
      res => {
        if (!res.success)
          return;

        this.listaAulas = res.dados;
        var ultimoRegistro = this.listaAulas[0];

        this.createForm(ultimoRegistro.dataAula);
        this.buscarPresencas();
      }
    )
  }

  createForm(data) {

    this.formulario = this.fb.group({
      dataAula: [data, [Validators.required] ]
    });
  }

  buscarPresencas() {
    this.presencaUsuarioService.buscarTodosPresencaUsuario(this.formulario.controls.dataAula.value).subscribe(
      res => {
        if (!res.success)
          return;

        this.listaTodasPresencas = res.dados;
        this.listaTodasPresencasCopy = this.listaTodasPresencas;
        this.contTodos = this.listaTodasPresencas.length;

        this.listaRealizados = this.listaTodasPresencas.filter(x => x.status === 'P');
        this.contRealizados = this.listaRealizados.length;
        this.listaRealizadosCopy = this.listaRealizados;
        this.listaNaoRealizados = this.listaTodasPresencas.filter(x => x.status === 'N');
        this.contRestantes = this.listaNaoRealizados.length;
        this.listaNaoRealizadosCopy = this.listaNaoRealizados;

      }
    )
  }

  onKeyTodos(event: any){

    if (event.target.value.length > 3)
      this.listaTodasPresencas = this.listaTodasPresencasCopy.filter(x => x.nome.toUpperCase().includes(event.target.value.toUpperCase()) );
    else 
      this.listaTodasPresencas = this.listaTodasPresencasCopy;

  }

  onKeyRealizados(event: any){

    if (event.target.value.length > 3)
      this.listaRealizados = this.listaRealizadosCopy.filter(x => x.nome.toUpperCase().includes(event.target.value.toUpperCase()) );
    else 
      this.listaRealizados = this.listaRealizadosCopy;

  }

  onKeyRestantes(event: any){

    if (event.target.value.length > 3)
      this.listaNaoRealizados = this.listaNaoRealizadosCopy.filter(x => x.nome.toUpperCase().includes(event.target.value.toUpperCase()) );
    else 
      this.listaNaoRealizados = this.listaNaoRealizadosCopy;

  }

  realizarCheckIn(dados) {
    Swal.fire({
      title: `Tem certeza que deseja realizar o check-in do aluno? `,
      text: `Será realizado o check-in do aluno ${dados.nome}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(
      res => {
        if (res.isConfirmed){
          var model = new PresencaUsuarioModel();

          model.processoInscricaoId = dados.processoInscricaoId;
          model.usuarioId = dados.id;
          model.dataRegistro = dados.dataAula;

          this.presencaUsuarioService.inserirCheckInUsuario(model).subscribe(
            res => {
              if (!res.success)
                return;

                this.buscarPresencas();
            }
          )


        }
      }
    )
  }


  desfazerCheckIn(dados) {
    Swal.fire({
      title: `Tem certeza que deseja desfazer o check-in do aluno? `,
      text: `Será excluído o check-in do aluno ${dados.nome}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then(
      res => {
        if (res.isConfirmed){
          this.presencaUsuarioService.deletarCheckInUsuario(dados.id,dados.processoInscricaoId,dados.dataAula).subscribe(
            res => {
              if (!res.success)
                return;

                this.buscarPresencas();
            }
          )


        }
      }
    )
  }

}
