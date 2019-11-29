import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Usuario } from '../../domain/usuario.domain';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, LazyLoadEvent, MenuItem, SortEvent, SortMeta } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';
import { Input } from '@angular/compiler/src/core';
declare function init_plugins();
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  @ViewChild('filterNombreOrDniInput', { static: true }) filterNombreOrDniInput: ElementRef<any>;
  public inputObservable: Observable<any>;

  itemsRecordsPerPage: MenuItem[];
  cantidadRegistrosPorPaginaList: any;
  selectedItem: Usuario;
  filterNombreOrDni: string;
  totalRecords: number;
  nroFilasPorPagina: number = environment.REGISTROS_PER_PAGE;
  paginaActual = 0;

  loading = false;
  usuarios: Usuario[] = [];
  cols: any[];

  multiSortMeta: SortMeta[];

  constructor(public usuarioService: UsuarioService,
              private route: ActivatedRoute,
              private router: Router,
              public modalUploadService: ModalUploadService) {
                this.itemsRecordsPerPage = [
                  {label: '5', icon: 'pi pi-bars',
                  command: () => {
                    this.onChangeRecordsPerPage(5);
                  }},
                  {label: '10', icon: 'pi pi-bars',
                    command: () => {
                      this.onChangeRecordsPerPage(10);
                    }},
                  {label: '20', icon: 'pi pi-bars',
                    command: () => {
                      this.onChangeRecordsPerPage(20);
                    }},
                  {label: '30', icon: 'pi pi-bars',
                  command: () => {
                    this.onChangeRecordsPerPage(30);
                  }},
                  {label: '50', icon: 'pi pi-bars',
                  command: () => {
                    this.onChangeRecordsPerPage(50);
                  }},
                  {label: '100', icon: 'pi pi-bars',
                    command: () => {
                    this.onChangeRecordsPerPage(100);
                  }}
                ];

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
    init_plugins();
    // this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe( (resp: any) => {
        this.cargarUsuarios();
    });
    this.inputObservable = fromEvent(this.filterNombreOrDniInput.nativeElement, 'input');
    this.inputObservable.pipe(
         debounceTime(1000))
         .subscribe(element => {
            console.log( `carga usuarios: ${element.target.value}`);
            this.usuarioService.findAllUsuarios(this.paginaActual, this.nroFilasPorPagina, element.target.value, undefined)
              .subscribe( (resp: any) => {
                  this.loading = false;
                  this.usuarios = resp['hydra:member'];
                  this.totalRecords = resp['hydra:totalItems'];

                  console.log(resp);
                });
          });
  }

  ngAfterViewInit() {

  }

  ordenarTabla(event: SortEvent) {
    console.log(event);
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
    this.paginaActual = (event.first / this.nroFilasPorPagina) + 1;
    this.multiSortMeta = event.multiSortMeta;

    this.cargarUsuarios();
  }

  onChangeRecordsPerPage(value: any) {
    this.nroFilasPorPagina = value;
    console.log(`Ver registros por pagina ${this.nroFilasPorPagina}`);
    this.cargarUsuarios();
 }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.findAllUsuarios(
      this.paginaActual, this.nroFilasPorPagina, this.filterNombreOrDni, this.multiSortMeta)
      .subscribe( (resp: any) => {
        this.loading = false;
        this.usuarios = resp['hydra:member'];
        this.totalRecords = resp['hydra:totalItems'];

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
