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
        icono: 'mdi mdi-gauge',
        submenu: [
          { titulo: 'Dashboard', url: '/dashboard'  },
          { titulo: 'Progress', url: '/progress'  },
          { titulo: 'Graficos', url: '/graficas1'  },
          { titulo: 'Promesas', url: '/promesas'  },
          { titulo: 'rxjs', url: '/rxjs'  }
        ]
      },
      {
        titulo: 'Mantenimientos',
        icono: 'mdi mdi-folder-lock-open',
        submenu: [
          { titulo: 'Usuarios', url: '/usuarios'  },
          { titulo: 'Hospitales', url: '/hospitales' },
          { titulo: 'Medicos', url: '/medicos'  }

        ]
      }
    ];
  }
}
