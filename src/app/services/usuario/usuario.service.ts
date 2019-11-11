import { Usuario } from '../../domain/usuario.domain';
import { URL_SERVICIOS } from '../../config/config';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap, mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import {
  HttpClient,
  HttpParams,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import { UserLogin } from '../../domain/userLogin.domain';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) {
    // console.log("Servicio de usuarios");
    this.cargarStorage();
  }

  renuevaToken() {
    let url: string = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http
      .get(url)
      .pipe(
        map((resp: any) => {
          this.token = resp.token;
          localStorage.setItem('token', this.token);
          console.log('Token renovado automaticamente ');
          return true;
        } ),
        catchError( (error: HttpErrorResponse) => {
          console.log(error);
          this.router.navigate(['/login']);
          Swal.fire(
            'No se pudo renovar token',
            'No fue posible renovar token',
            'error'
          );
          return throwError(error);
        })
      );
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = ' ';
      this.usuario = null;
      this.menu = [];
    }
  }

  estaLogueado() {
    return this.usuario && this.token && this.token.length > 5 ? true : false;
  }

  saveLocalStorage(token: string, usuario: Usuario) {
    this.usuario = usuario;
    this.token = token;
    // this.menu = menu;
    localStorage.setItem('id', usuario.id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  logout() {
    this.usuario = null;
    this.token = null;
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  login(usuario: UserLogin, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('username', usuario.username);
    } else {
      localStorage.removeItem('username');
    }

    const url: string = URL_SERVICIOS + '/login_check';

    return this.http.post(url, usuario).pipe(
      map((data: any) => {
        const user: Usuario = data.user;

        this.saveLocalStorage(data.token, user);
        console.log(data);
        return true;
        console.log('entra ' + data);
        localStorage.setItem('token', data.token);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    this.log('error', error);
    return throwError(error);
  }

  private log(level: string, message: any): void {
    console[level](message);
  }

  private createHttpParams(values: { [index: string]: any }): HttpParams {
    let params: HttpParams = new HttpParams();

    Object.keys(values).forEach((key: string) => {
      const value: any = values[key];
      if (value !== undefined) {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  crearUsuario(usuario: Usuario) {
    const url: string = URL_SERVICIOS + '/usuario';

    return this.http
      .post(url, usuario)
      .pipe(
          map((resp: any) => {
            return resp.usuario;
          }),
          catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  actualizarUsuario(usuario: Usuario) {
    let url: string = URL_SERVICIOS + '/usuario/' + usuario.id;
    url += '?token=' + this.token;

    return this.http
      .put(url, usuario)
      .pipe(
        map((resp: any) => {
          if (usuario.id === this.usuario.id) {
            // SI el usuario es el mismo logueado actualizo las variables de storage
            const usuarioDB: Usuario = usuario; // La respuesta del backend me devuelve el usuario actualizado
            this.saveLocalStorage(
              this.token,
              usuarioDB
            );
          }
          return resp;
        }),
        catchError(error => {
          Swal.fire(error.error.mensaje, error.error.errors.message, 'error');
          return throwError(error);
        })
      );
  }

  cambiarImagen(file: File, id: string) {
    return new Promise((resolve, reject) => {
      this.subirArchivoService
        .subirArchivo(file, 'usuarios', id)
        .then((resp: any) => {
          // actualizo la imagen del usuario logueado
          this.usuario.img = resp.usuario.img;
          // Actualizo datos del usuario en storage (para que se vean los cambios en front)
          this.saveLocalStorage(this.token, this.usuario);
          console.log(resp);
          resolve(resp);
        })
        .catch((resp: any) => {
          reject(resp);
          console.log('Error subiendo archivo ', resp);
        });
    });
  }

  findAllUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  findUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/colleccion/usuarios/' + termino;
    return this.http.get(url);
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url);
  }
}
