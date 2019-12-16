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

  rolesDisponibles = environment.ROLES_JERARQUIA;

  hasRole(role: string) {
    let tieneRol = false;
    if (this.usuarioService.usuario !== undefined
      && this.usuarioService.usuario.roles !== undefined
      && this.usuarioService.usuario.roles.length > 0) {
        // Si el rol coincide directamente
        if (this.usuarioService.usuario.roles.includes(role)) {
          tieneRol = true;
          return tieneRol;
        } else {
          // Analizo la jerarquia de roles
          if (this.rolesDisponibles[role] !== undefined) {
            let rolJerarquiaConfig: string[] = [];
            rolJerarquiaConfig = this.rolesDisponibles[role];

            // Recorro los roles del usuario a ver si alguno coincide o esta dentro de la jerarquia
            this.usuarioService.usuario.roles.forEach(rolUser => {
              const rolUserJerarquia: string[] = this.rolesDisponibles[rolUser];
              if (rolUserJerarquia !== undefined && rolUserJerarquia.includes(role)) {
                tieneRol = true;
              }
            });

            return tieneRol;
          } else {
            console.log(`El role requerido ${role}, no tiene jerarquia configurada en environment.`);
          }
        }

      } else {
        return false;
      }

  }

}
