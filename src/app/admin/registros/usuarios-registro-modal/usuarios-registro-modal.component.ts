import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { Registro } from '@models/registro.model';
import { UsuarioRegistro } from '@models/usuarioRegistro.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { Column } from 'app/admin/components/registro-view/registro-view.component';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-registro-modal',
  templateUrl: './usuarios-registro-modal.component.html',
  styleUrls: ['./usuarios-registro-modal.component.scss'],
})
export class UsuariosRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: BibliotecaApiService,
    private _dialogRef: MatDialogRef<UsuariosRegistroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: Registro,
    private _pagination: PaginationService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    { title: 'Genero', matColumnDef: 'genero', property: 'sexo' },
    { title: 'Tipo', matColumnDef: 'tipo', property: 'tipo' },
    {
      title: 'Institucion',
      matColumnDef: 'institucion',
      property: 'institucion',
    },
  ];
  public objects: UsuarioRegistro[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.REG_USUARIOS;
  public instituciones: Institucion[];

  count() {
    return this._api.count(this.model);
  }

  getInstituciones() {
    return this._api.getObjects(MODELS.INSTITUCIONES);
  }

  getUsuarios() {
    return this._api.getObjects(this.model, {
      where: {
        idRegistro: this.dataIn.id,
      },
      take: this.pages,
      skip: this.pages * this.index,
    });
  }
  getIndex(index: number) {
    return (this.index ? this.index : 1) * index - this.pages * this.index;
  }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;
    console.log(pageEvent);
    this.renderRows();
  }

  onNoClick() {
    this._dialogRef.close();
  }

  renderRows(firstLoad?: boolean) {
    this.count()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((count: any) => {
        this.totalPages = count;
        this.getUsuarios()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((objects: Registro[]) => {
            this.getInstituciones()
              .pipe(takeUntil(this.onDestroy))
              .subscribe((instituciones: Institucion[]) => {
                this.instituciones = instituciones;
                this.objects = this.dataTransform(objects);
                console.log(objects);
                this.loaded = true;

                if (firstLoad) {
                  this.table.renderRows();
                }
              });
          });
      });
  }

  dataTransform(objects: UsuarioRegistro[]) {
    let retObjects: any[] = [];
    objects.forEach((object) => {
      let retObject: any = { ...object };
      this.instituciones.some((inst) => {
        if (inst.id === object.idInstitucion) {
          retObject = { ...retObject, institucion: inst.nombre };
        }
      });
      if (object.sexo === 'M') {
        retObject = { ...retObject, sexo: 'Masculino' };
      } else if (object.sexo === 'F') {
        retObject = { ...retObject, sexo: 'Femenino' };
      }
      if (object.tipo === 'I') {
        retObject = { ...retObject, tipo: 'Interno' };
      } else if (object.tipo === 'E') {
        retObject = { ...retObject, tipo: 'Externo' };
      }
      retObjects.push(retObject);
    });
    return retObjects;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderRows();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
