import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Exception } from '../../domain/exception.domain';
import { HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(private usuarioService: UsuarioService) { }

  hasRole(role: string) {
    if (this.usuarioService.usuario !== undefined
      && this.usuarioService.usuario.roles !== undefined
      && this.usuarioService.usuario.roles.length > 0) {
        for (let index = 0; index < this.usuarioService.usuario.roles.length; index++) {
          const rol = this.usuarioService.usuario.roles[index];
          if (rol === role) {
            return true;
          }
        }
      } else {
        return false;
      }

  }

}
