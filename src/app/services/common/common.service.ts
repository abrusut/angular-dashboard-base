import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Exception } from '../../domain/exception.domain';
import { HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  handlerError(err: any): Exception {
    let exception: Exception = {};
    exception.body = 'Error procesando la peticion <br/>';
    exception.title = 'Error en la aplicacion';
    exception.icon = 'error';
    console.log(err);
    if ( err && err !== undefined ) {
      if (err instanceof HttpErrorResponse) {
        exception.statusCode = err.status;
        exception.title = `Error ${exception.statusCode} en la aplicacion `;
        console.error(`${err.status} - ${err.statusText} - ${err.url}` );
      }
      if (err.error !== undefined && err.error.violations !== undefined && err.error.violations.length > 0) {

        err.error.violations.forEach(violation => {
          exception.body += ` ${violation.message} ` ;
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
      return val === arrVal;
    });
  }


}
