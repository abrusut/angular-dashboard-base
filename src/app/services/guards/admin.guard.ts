import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UsuarioService} from '../usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { SecurityService } from './security.service';


@Injectable()
export class AdminGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService, public router: Router,
              public securityService: SecurityService) {

  }

  canActivate() {
    if ( this.securityService.hasRole('ROLE_SUPER_ADMIN') ) {
      return true;
    } else {
      console.log('Bloqueado por AdminGuard');
      this.usuarioService.logout();
      return false;
    }
  }
}
