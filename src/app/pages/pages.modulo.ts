import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTING } from './pages.routes';

// Modulos
import { SharedModule } from '../shared/shared.modulo';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonsAppModule } from '../commons/commons.app.module';

// Componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosListComponent } from './usuarios/usuariosList/usuarios-list.component';
import { UsuarioDetailComponent } from './usuarios/usuarioDetail/usuario-detail.component';



@NgModule({
    declarations: [
        DashboardComponent,
        ProfileComponent,
        UsuariosListComponent,
        UsuarioDetailComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        PAGES_ROUTING,
        SweetAlert2Module,
        CommonsAppModule // Modulos basicos (RouterModule,FormsModule,ReactiveFormsModule,HttpClientModule,etc)
    ]
})
export class PageModule { }
