import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {SettingsService,
        SidebarService,
        SharedService,
        UsuarioService,
        AdminGuard,
        LoginGuardGuard,
        VerificaTokenGuard,
        SubirArchivoService,
        ModalUploadService,
        CommonService
} from './service.index';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard,
    SubirArchivoService,
    ModalUploadService,
    CommonService
  ]
})
export class ServiceModule { }
