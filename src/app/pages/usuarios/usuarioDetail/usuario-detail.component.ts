import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/domain/usuario.domain';
import { CommonService, UsuarioService } from 'src/app/services/service.index';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Message, SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Exception } from 'src/app/domain/exception.domain';

declare function init_plugins();

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.scss']
})
export class UsuarioDetailComponent implements OnInit {
  submitted = false;
  usuario: Usuario = {};
  public reactiveForm: FormGroup;
  public msgs: Message[];
  formCambioPassword: FormGroup;

  rolesDisponibles: SelectItem[] = [];
  selectedRoles: Array<string> = [];
  ROLES_ARRAY: any[] = environment.ROLES_ARRAY;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private commonService: CommonService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

   // convenience getter for easy access to form fields
   get f() { return this.reactiveForm.controls; }
   get fcp() { return this.formCambioPassword.controls; }

  ngOnInit() {
    init_plugins();


    this.ROLES_ARRAY.forEach(element => {
      this.rolesDisponibles.push({label: element, value: element});
    });

    this.formCambioPassword = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      newRetypedPassword: new FormControl(null, Validators.required)
    }, { validators: this.sonIguales( 'newPassword', 'newRetypedPassword' ) });

    this.reactiveForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        retypedPassword: ['', [Validators.required, Validators.minLength(6)]],
        fullName: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        roles: ['', Validators.required],
        enabled: ['']
      },
      { validators: this.sonIguales('password', 'retypedPassword') }
    );

    // Levanto el Usuario por parametro
    this.activatedRoute.params.subscribe(params => {
      const id: string = params.id;
      if (id !== undefined && id !== 'nuevo') {
        this.cargarUsuario(id);
      }
    });

  }

   // ==================================
  // Verifica Password Iguales
  // ==================================
  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }

  // ==================================
  // Cargar Usuario para Editar
  // ==================================
  cargarUsuario(id: string) {
    this.usuarioService
      .findUsuarioById(Number(id))
      .subscribe((usuario: Usuario) => {
        usuario.password = '';
        usuario.retypedPassword = '';
        this.usuario = usuario;
        this.reactiveForm.patchValue(this.usuario);

        // Si esta editando remuevo la obligatoriedad de password
        this.reactiveForm.get('password').setValidators(null);
        this.reactiveForm.get('password').setErrors(null);
        this.reactiveForm.get('password').updateValueAndValidity();
        this.reactiveForm.get('retypedPassword').setValidators(null);
        this.reactiveForm.get('retypedPassword').setErrors(null);
        this.reactiveForm.get('retypedPassword').updateValueAndValidity();
      });
  }

  // ==================================
  // Actualizacion Password
  // ==================================
  cambiarClaveUsuario() {
    if ( this.formCambioPassword.invalid ) {
      Swal.fire('Importante', 'Debe completar todo el formulario', 'warning');
      return;
    }

    console.log('Forma Valida', this.formCambioPassword.valid);
    console.log(this.formCambioPassword.value);

    const usuarioCambioPassword: Usuario = {};
    usuarioCambioPassword.id = this.usuario.id;
    usuarioCambioPassword.newPassword = this.formCambioPassword.value.newPassword;
    usuarioCambioPassword.newRetypedPassword = this.formCambioPassword.value.newRetypedPassword;
    usuarioCambioPassword.oldPassword = this.formCambioPassword.value.oldPassword;
    this.usuarioService.actualizarPasswordUsuario(usuarioCambioPassword)
      .subscribe( ( resp: any ) => {
        if ( resp ) {
          Swal.fire('Password Actualizada', this.usuario.fullName, 'success');
        }
      });

  }


  // ==================================
  // Guardar Usuario Nuevo
  // ==================================
  guardar() {
    this.submitted = true;
    if ( this.reactiveForm.invalid ) {
      Swal.fire('Importante', 'Debe completar todo el formulario', 'warning');
      return;
    }

    const idAux = this.usuario.id;
    this.usuario = this.reactiveForm.value;
    this.usuario.id = idAux;

    console.log("Object to save");
    console.log(JSON.stringify(this.reactiveForm.value));
    console.log(`Guardar Usuario ${this.reactiveForm.value} `);
    this.usuarioService.guardarUsuario(this.usuario).subscribe(
      (usuario: Usuario) => {
        this.msgs = [];
        this.msgs.push({
          severity: 'info',
          summary: `Usuario ${usuario.email} guardado`,
          detail: usuario.fullName
        });
        this.usuario = {};
        setTimeout(() => {
          this.router.navigate([`usuarios`]);
        }, 2000);
      },
      error => {
        const exception: Exception
              =  this.commonService.handlerError(error);
        this.msgs = [];
        this.msgs.push({
          severity: 'error',
          summary: `${exception.title}`,
          detail: exception.body
        });
      }
    );
  }

  cancelar() {
    if (this.usuario && this.usuario.id) {
      this.router.navigate([`usuarios`]);
    } else {
      this.reactiveForm.reset();
      this.submitted = false;
    }
  }
}
