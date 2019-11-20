import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTING } from './pages.routes';

// Modulos
import { SharedModule } from '../shared/shared.modulo';
import { PipesModule } from '../pipes/pipes.module';


// Componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    declarations: [
        DashboardComponent,
        ProfileComponent,
        UsuariosComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        PipesModule,
        PAGES_ROUTING,
        SweetAlert2Module
    ]
})
export class PageModule { }
