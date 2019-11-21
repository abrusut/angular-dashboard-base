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
        submenu: [
          { titulo: 'Dashboard', url: '/dashboard'  },
          { titulo: 'Profile', url: '/profile'  }
        ]
      },
      {
        titulo: 'Mantenimientos',
        icono: 'fas fa-fw fa-folder',
        submenu: [
          { titulo: 'Usuarios', url: '/usuarios'  }
        ]
      }
    ];
  }
}
