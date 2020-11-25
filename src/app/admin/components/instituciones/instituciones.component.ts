import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { EquipoComputo } from '@models/equipoComputo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
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
  public displayedColumns = ['pos', 'name', 'abbrv', 'options'];
  private onDestroy = new Subject<any>();

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getInstituciones() {
    return this._api.getObjects(MODELS.INSTITUCIONES);
  }

  openDialog(data?: EquipoComputo) {
    const dialog = this._dialog.open(AddInstitucionComponent, {
      width: '1000px',
      data: data,
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {
        this.renderRows();
      });
  }

  renderRows() {
    this.getInstituciones()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((instituciones: Institucion[]) => {
        this.instituciones = instituciones;
        this.table.renderRows();
      });
  }

  deleteObject(object: Institucion) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar la institución "${object.nombre}?"`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(MODELS.INSTITUCIONES, object.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data) => {
                if (data) {
                  this.openSnack(`Institución "${object.nombre}" eliminada`);
                  this.renderRows();
                }
              },
              () => {
                this.openSnack(
                  `Error al eliminar institución "${object.nombre}"`
                );
              }
            );
        }
      });
  }

  openSnack(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getInstituciones()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((instituciones: Institucion[]) => {
        this.instituciones = instituciones;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
