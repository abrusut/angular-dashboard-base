import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import {LoginGuardGuard} from '../services/guards/login-guard.guard';
import {AdminGuard} from '../services/guards/admin.guard';
import {ProfileComponent} from './profile/profile.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {VerificaTokenGuard} from '../services/guards/verifica-token.guard';


/**
 *   La "data" de cada ruta se usa para agregar meta tags dinamicamente y
 *   setear el titulo de la pagina en la que estoy
 *   Esto se usa en BreadcrumsComponent
 */
const PAGES_ROUTES: Routes = [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard', description: 'Dashboard de la APP' },
       // canActivate: [ VerificaTokenGuard ]
      },
      { path: 'account-settings', component: AccountSettingComponent,
        data: { titulo: 'Ajustes de Tema' , description: 'Ajustes de Tema de la APP' }  },
      {
        path: 'profile', component: ProfileComponent,
        data: { titulo: 'Profile', description: 'Perfil del usuario de la APP' }
      },
      // Mantenimientos
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Usuarios',
                description: 'Mantenimiento de usuarios de la APP' },
        canActivate: [ AdminGuard ]
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
  ];

export const PAGES_ROUTING: ModuleWithProviders = RouterModule.forChild(PAGES_ROUTES);

