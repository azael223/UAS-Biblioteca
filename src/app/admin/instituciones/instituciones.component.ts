import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Equipo } from '@models/equipo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddInstitucionComponent } from './add-institucion/add-institucion.component';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss'],
})
export class InstitucionesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public instituciones: Institucion[];
  public displayedColumns = ['pos', 'name', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  private model = MODELS.INSTITUCIONES;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _pagination: PaginationService
  ) {}

  count() {
    return this._api.count(this.model);
  }

  getInstituciones() {
    return this._api.getObjects(this.model, {
      order: { creadoEn: 'DESC' },
      take: this.pages,
      skip: this.pages * this.index,
    });
  }

  renderRows(firstLoad?: boolean) {
    this.count()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((count: any) => {
        this.totalPages = count;
        this.getInstituciones()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((objects: Institucion[]) => {
            this.instituciones = objects;
            this.loaded = true;
            if (firstLoad) {
              this.table.renderRows();
            }
          });
      });
  }

  deleteObject(object: Institucion) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar la institucion ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(this.model, object.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                console.log(data);
                if (data && !data.error) {
                  this.openSnack(`Institucion ${object.id} eliminado`);
                  this.renderRows();
                } else {
                  this.openSnack(`La institucion ${object.id} no se pudo eliminar`);
                }
              },
              () => {
                this.openSnack(`Error al eliminar la institucion ${object.id}`);
              }
            );
        }
      });
  }

  // getIndex(index: number) {
  //   return (
  //     this.totalPages -
  //     (this.index ? this.index : 1) * index -
  //     this.pages * this.index
  //   );
  // }


  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;
    console.log(pageEvent);
    this.renderRows();
  }

  openSnack(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  openDialog(data?: Institucion) {
    const dialogRef = this._dialog.open(AddInstitucionComponent, {
      width: '600px',
      data: data,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        this.renderRows();
      });
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
