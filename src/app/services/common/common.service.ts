import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Exception } from '../../domain/exception.domain';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  handlerError(err: any): Exception {
    let exception: Exception = {};
    exception.body = 'Error procesando la peticion';
    exception.title = 'Error en la aplicacion';
    exception.icon = 'error';

    if ( err && err !== undefined ) {
      if (err instanceof HttpErrorResponse) {
        exception.statusCode = err.status;
        console.error(`${err.status} - ${err.statusText} - ${err.url}` );
      }
      if (err.error !== undefined && err.error.violations !== undefined && err.error.violations.length>0) {

        err.error.violations.forEach(violation => {
          exception.body += ` ${violation.message} ` ;
        });

      }

    }

    return exception;

  }


}
