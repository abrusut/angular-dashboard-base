import { Injectable } from '@angular/core';
import {UsuarioService} from '../usuario/usuario.service';

@Injectable()
export class SidebarService {



  /**
   *  Trasladar esta logica a backend
   *
   **/
  menu: any[] = [];



  constructor( public usuarioService: UsuarioService) {

  }

  cargarMenu() {
    this.menu = [
      {
        titulo: 'Principal',
        icono: 'fas fa-fw fa-folder',
        url: '/dashboard' ,
        submenu: [
          { titulo: 'Dashboard', url: '/dashboard', icono: 'pi pi-home'  },
          { titulo: 'Profile', url: '/profile', icono: 'pi pi-user'  }
        ],
        roles: []
      },
      {
        titulo: 'Usuarios',
        icono: 'fas fa-fw fa-folder',
        url: '/usuarios',
        submenu: [
          { titulo: 'Listado', url: '/usuarios', icono: 'pi pi-users'  },
          { titulo: 'Nuevo', url: '/usuarios/nuevo', icono: 'pi pi-user-plus'  }
        ],
        roles: ['ROLE_SUPER_ADMIN']
      }
    ];
  }
}
