import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/domain/usuario.domain';
import { CommonService, UsuarioService } from 'src/app/services/service.index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  usuario: Usuario = {};
  public reactiveForm: FormGroup;
  public msgs: Message[];

  rolesDisponibles: SelectItem[];
  selectedRoles: string[];
  ROLES_ARRAY: any[] = environment.ROLES_ARRAY;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private commonService: CommonService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    init_plugins();

    this.rolesDisponibles = [
      {label: 'Seleccionar Roles', value: null}
    ];
    this.ROLES_ARRAY.forEach(element => {
      this.rolesDisponibles.push({label: element, value: element});
    });

    this.reactiveForm = this.fb.group(
      {
        username: [null, [Validators.required, Validators.minLength(4)]],
        password: [null, Validators.required],
        retypedPassword: [null, Validators.required],
        fullName: [null, [Validators.required, Validators.minLength(4)]],
        email: [null, Validators.required],
        roles: [null, Validators.required]
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

  cargarUsuario(id: string) {
    this.usuarioService
      .findUsuarioById(Number(id))
      .subscribe((usuario: Usuario) => {
        usuario.password = '';
        usuario.retypedPassword = '';
        this.usuario = usuario;

        this.reactiveForm.patchValue(this.usuario);
      });
  }

  guardar() {
    const idAux = this.usuario.id;
    this.usuario = this.reactiveForm.value;
    this.usuario.id = idAux;

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
    }
  }
}
