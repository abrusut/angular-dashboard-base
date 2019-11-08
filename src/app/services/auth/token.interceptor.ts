/**
 * Created by Andres Brusutti on 09/05/2018.
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {UsuarioService} from '../usuario/usuario.service';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public userService: UsuarioService, public router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const req: any = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userService.token}`
      }
    });

    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // redirect to the login route
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
