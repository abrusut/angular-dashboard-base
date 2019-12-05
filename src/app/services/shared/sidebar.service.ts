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
        id: 1,
        titulo: 'Principal',
        icono: 'fas fa-fw fa-folder',
        url: '/dashboard' ,
        submenu: [
          { titulo: 'Dashboard', url: '/dashboard'  },
          { titulo: 'Profile', url: '/profile'  }
        ],
        roles: []
      },
      {
        id: 2,
        titulo: 'Mantenimientos',
        icono: 'fas fa-fw fa-folder',
        url: '/usuarios',
        submenu: [
          { titulo: 'Usuarios List', url: '/usuarios'  },
          { titulo: 'Usuarios ABM', url: '/usuarios/nuevo'  }
        ],
        roles: ['ROLE_SUPER_ADMIN']
      }
    ];
  }
}
