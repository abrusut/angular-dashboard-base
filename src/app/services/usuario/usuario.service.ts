import { Usuario } from '../../domain/usuario.domain';
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
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { Exception } from 'src/app/domain/exception.domain';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService,
    public commonService: CommonService
  ) {
    // console.log("Servicio de usuarios");
    this.cargarStorage();
  }

  renuevaToken() {
    let url: string = environment.URL_API + '/login/renuevatoken';
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
          this.commonService.handlerError(error);
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

    const url: string = environment.URL_API + '/login_check';

    return this.http.post(url, usuario).pipe(
      map((data: any) => {
        const user: Usuario = data.user;
        this.saveLocalStorage(data.token, user);
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
    const url: string = environment.URL_API + '/usuario';

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
    const url: string = environment.URL_API + '/users/' + usuario.id;

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
          return true;
        }),
        catchError(error => {
          const exception: Exception
              =  this.commonService.handlerError(error);
          Swal.fire(exception.title, exception.statusCode + ' ' + exception.body, 'error');
          return throwError(error);
        })
      );
  }

  actualizarPasswordUsuario(usuario: Usuario) {
    const url: string = environment.URL_API + '/users/' + this.usuario.id + '/reset-password';

    return this.http
      .put(url, usuario)
      .pipe(
        map((resp: any) => {
          if (usuario.id === this.usuario.id && resp.token !== undefined) {
            this.token = resp.token;
            // SI el usuario es el mismo logueado actualizo las variables de storage
            const usuarioDB: Usuario = usuario; // La respuesta del backend me devuelve el usuario actualizado
            this.saveLocalStorage(
              this.token,
              usuarioDB
            );
          }
          return true;
        }),
        catchError(error => {
          const exception: Exception
              =  this.commonService.handlerError(error);
          Swal.fire(exception.title, exception.statusCode + ' ' + exception.body, 'error');
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
    const url = environment.URL_API + '/users?desde=' + desde;
    return this.http.get(url);
  }

  findUsuarios(termino: string) {
    const url = environment.URL_API + '/busqueda/colleccion/usuarios/' + termino;
    return this.http.get(url);
  }

  borrarUsuario(id: string) {
    let url = environment.URL_API + '/users/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url);
  }
}
