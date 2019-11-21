import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Exception } from '../../domain/exception.domain';
import { HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  handlerError(err: any): Exception {
    let exception: Exception = {};
    exception.body = '';
    let commonsExceptionBody = 'Error procesando la peticion <br/>';
    let commonsExceptionTitle = 'Error en la aplicacion';
    exception.icon = 'error';
    console.log(err);
    if ( err && err !== undefined ) {
      if (err instanceof HttpErrorResponse) {
        exception.statusCode = err.status;
        exception.title = `Mensaje de la aplicacion `;
        console.error(`Mensaje de la aplicacion ${err.status} - ${err.statusText} - ${err.url}` );
      }
      if (err.error !== undefined && err.error.violations !== undefined && err.error.violations.length > 0) {

        err.error.violations.forEach(violation => {
          exception.body = ` ${violation.message} ` ;
        });
      }
      if (err.error !== undefined && err.error.code !== undefined && err.error.message !== undefined ) {
        if (this.isMessageForUser(err.error.message) ) {
          exception.body += ` ${err.error.code} - ${err.error.message}`;
        } else {
          console.error( ` Message for administrator ${err.error.code} - ${err.error.message}` );
        }
      }

    }

    if ( exception.body === undefined || (exception.body !== undefined && exception.body.length === 0 ))
    {
      exception.body = commonsExceptionBody;
    }
    if ( exception.title === undefined || (exception.title !== undefined && exception.title.length === 0 ))
    {
      exception.title = commonsExceptionTitle;
    }

    return exception;

  }

  isMessageForUser(message: string): boolean {
    const words = ['select', 'insert', 'from', 'update', 'delete'];
    let sendToUser = true;
    const messageArr = message.split(' ');
    if ( messageArr !== undefined && messageArr.length > 0) {
      words.forEach( element => {
        sendToUser = this.checkWords(messageArr, element);
        if (!sendToUser) {
          return false;
        }
      });
    }

    return sendToUser;

  }

  checkWords(arr, val) {
    return arr.some(function(arrVal) {
      return val !== arrVal;
    });
  }


}
