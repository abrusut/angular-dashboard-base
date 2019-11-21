import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Usuario } from '../../domain/usuario.domain';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, LazyLoadEvent } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  @ViewChild('filterNombreOrDniInput', {static: false}) filterNombreOrDniInput: ElementRef;
  public inputObservable: Observable<string>;

  selectedItem: Usuario;
  filterNombreOrDni: string;
  totalRecords: number;
  nroFilasPorPagina: number = environment.REGISTROS_PER_PAGE;
  paginaActual = 0;

  loading = false;
  usuarios: Usuario[] = [];
  cols: any[];
  yearTimeout: any;

  constructor(public usuarioService: UsuarioService,
              private route: ActivatedRoute,
              private router: Router,
              public modalUploadService: ModalUploadService) {
                this.cols = [
                  { field: 'username', header: 'User' },
                  { field: 'name', header: 'Nombre' },
                  { field: 'email', header: 'Email' },
                  { field: 'enabled', header: 'Activo' },
                  { field: 'confirmationToken', header: 'Confirmation Token' },
                  { field: 'roles', header: 'Roles' },
                  { field: 'passwordChangeDate', header: 'Cambio Password' },
                  { field: 'accion', header: 'Acciones' }
                ];
              }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe( (resp: any) => {
        this.cargarUsuarios();
    });
  }

  ngAfterViewInit() {
    this.inputObservable = fromEvent(this.filterNombreOrDniInput.nativeElement, 'input');
    this.inputObservable.pipe(
         debounceTime(1000))
         .subscribe(value => {
           console.log( `carga usuarios: ${value}`);
           this.cargarUsuarios();
          });
  }


  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  editarUsuario(id: string) {
    console.log(` Editar Usuario ${id}`);
    this.router.navigate([`pacientes/pacienteabm/${id}`]);
  }

  loadUsuariosLazy(event: LazyLoadEvent) {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    this.paginaActual = event.first;
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.findAllUsuarios(
      this.paginaActual, this.nroFilasPorPagina, this.filterNombreOrDni)
      .subscribe( (resp: any) => {
        this.loading = false;
        this.usuarios = resp.usuarios;
        this.totalRecords = resp.total;

        console.log(resp);
      });
  }

  buscar(termino: string) {
    console.log( termino );

    if (termino.length <= 0) {
      this.cargarUsuarios();
    }

    this.loading = true;
    this.usuarioService.findUsuarios(termino)
      .subscribe( (resp: any) => {
        this.loading = false;
        this.totalRecords =  resp.totalElements;
        this.usuarios = resp.usuarios;

        console.log(resp);
      });
  }

  borrar(usuario: Usuario) {

    if ( usuario.id === this.usuarioService.usuario.id) { // Esta intentando borrar el usuario que esta logueado
      Swal.fire('No puede Borrar Usuario', 'No puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    })
    .then((result) => {
      if (result.value) {
        this.usuarioService.borrarUsuario(usuario.id)
            .subscribe( (resp: any) => {
              Swal.fire('Usuario Borrado', usuario.name, 'success');
              this.cargarUsuarios();
            });
      }
    });
  }


}
