import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../domain/usuario.domain';
import { UserLogin } from '../../domain/userLogin.domain';

declare function init_plugins();
declare const gapi: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: string = '';
  userLogin: UserLogin = {};
  recuerdame: boolean = false;
  auth2: any;
  error: any = null;

  constructor(public router: Router,
              public usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.user = localStorage.getItem('user') || '';
    if ( this.user.length > 0) // Si tengo algo en localStorage es por que ya se logueo y puso recordar
    {
      this.recuerdame = true;
    }
  }

  googleInit(){
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '512406415762-70vv5qf9e20fhle0ijebnrsfj3na5ufb.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSigIn( document.getElementById('btnGoogle'));
    });
  }

  attachSigIn(element)
  {
    this.auth2.attachClickHandler( element, {}, ( googleUser ) => {
      const profile = googleUser.getBasicProfile();
      console.log('Profile Google', profile);

      const token = googleUser.getAuthResponse().id_token;
      console.log('Token Google', token);

      // Login
      this.usuarioService.loginGoogle(token)
        .subscribe(resp => {
          // Login success
          console.log('Respuesta login google', resp);
          window.location.href = '#/dashboard'; // hago redireccion manual para que cargue bien el css
        });
    });
  }

  ingresar(forma: NgForm) {
    if ( forma.invalid ) {
      return;
    }
    console.log('Forma valida', forma.valid);
    console.log('Forma', forma.value);

    this.userLogin.username = forma.value.username;
    this.userLogin.password = forma.value.password;

    this.usuarioService.login(this.userLogin, forma.value.recuerdame)
      .subscribe( ( loginCorrecto: any ) => {
        console.log(loginCorrecto);
        this.router.navigate(['/dashboard']);

      },
        error => {
          this.error = error.error;
          Swal.fire('Error en el Login', this.error.message, 'error');
          console.log(this.error.message);
          console.log('ERRORRR' + error); // error path
        }
      );
  }
}
