import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UsuarioService} from "../usuario/usuario.service";
import { resolve } from 'url';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(public usuarioService:UsuarioService, public router:Router)
  {

  }

  canActivate(): Promise<boolean> | boolean {
    console.log('Inicio de verifica token guard');
    let token = this.usuarioService.token;
    let payload = JSON.parse(atob( token.split('.')[1]));
    console.log(payload);

    let expirado = this.expirado(payload.exp)
    if(expirado){
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  expirado(fechaExpiracion:number)
  {
    let ahora = new Date().getTime() / 1000;

    if(fechaExpiracion < ahora){
      return true;
    }else{
      return false;
    }
  }

  verificaRenueva(fechaExpToken: number): Promise<boolean>{
    return new Promise( ( resolve, reject) =>{

      let tokenExp = new Date( fechaExpToken * 1000);
      let ahora = new Date();
      ahora.setTime( ahora.getTime() + (4 * 60 * 60) ); // Incrementa 4hs
      console.log(tokenExp);
      console.log(ahora);

      if(tokenExp.getTime() > ahora.getTime())
      {// el token no esta proximo a vencer devuelvo true
        resolve(true);
      }else{
        // renuvo el token
        this.usuarioService.renuevaToken()
            .subscribe( () => {
              resolve(true);
            },
            () => {
              reject(false);
              this.router.navigate(['/login']);
            } 
          
          );
      }

      resolve(true);
    });

  }


}
