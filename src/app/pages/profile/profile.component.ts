import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../domain/usuario.domain';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  archivoASubir: File;
  imagenTemp: any;

  constructor(public usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario; // Usuario Logueado
  }

  // ==================================
  // Actualizacion datos del usuario
  // ==================================
  guardar(usuario: Usuario) {
    console.log(usuario);

    this.usuario.nombre = usuario.nombre;

    if (!this.usuario.google ) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario(this.usuario)
      .subscribe( ( resp: any ) => {
        if ( resp.ok ) {
          Swal.fire('Usuario Actualizado', usuario.nombre, 'success');
        }
      });
  }

  // ==================================
  // Subida de archivos
  // ==================================
  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.archivoASubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0) {
      Swal.fire('Solo Imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.archivoASubir = null;
      return;
    }

    this.archivoASubir = archivo;

    // Cargar vista previa
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
        // Imagen en base64
        this.imagenTemp = reader.result;
    };


  }

  subirArchivo() {
    this.usuarioService.cambiarImagen(this.archivoASubir, this.usuario.id)
      .then( (resp: any) => {
        if (resp.ok) {
          Swal.fire('Usuario Actualizado', this.usuario.nombre, 'success');
        }

      }).catch( (resp: any) => {
        Swal.fire('Error Actualizado Imagen', this.usuario.nombre, 'error');
    });


  }
}
