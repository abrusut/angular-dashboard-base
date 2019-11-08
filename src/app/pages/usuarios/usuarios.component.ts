import { Component, OnInit } from '@angular/core';
import {Usuario} from '../../domain/usuario.domain';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {ModalUploadService} from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe( (resp: any) => {
        this.cargarUsuarios();
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.findAllUsuarios(this.desde)
      .subscribe( (resp: any) => {

        this.usuarios = resp.usuarios;
        this.totalRegistros = resp.total;
        this.cargando = false;
        console.log(resp);
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if ( desde > this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    console.log( termino );

    if (termino.length <= 0) {
      this.cargarUsuarios();
    }

    this.cargando = true;
    this.usuarioService.findUsuarios(termino)
      .subscribe( (resp: any) => {

        this.usuarios = resp.usuarios;
        this.totalRegistros = resp.usuarios.length;
        this.cargando = false;
        console.log(resp);
      });
  }

  borrar(usuario: Usuario) {

    if ( usuario.id === this.usuarioService.usuario.id) { // Esta intentando borrar el usuario que esta logueado
      Swal.fire('No puede Borrar Usuario', 'No puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    })
    .then((result) => {
      if (result.value) {
        this.usuarioService.borrarUsuario(usuario.id)
            .subscribe( (resp: any) => {
              Swal.fire('Usuario Borrado', usuario.nombre, 'success');
              this.cargarUsuarios();
            });
      }
    });
  }

  guardar( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe( (resp: any) => {
        Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
        console.log(resp);
      });

  }
}
