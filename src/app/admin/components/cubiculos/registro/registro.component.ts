import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MODELS } from '@models/Models';
import { RegCubiculos } from '@models/regCubiculos.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddRegistroCubiculoComponent } from './add-registro-cubiculo/add-registro-cubiculo.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit,AfterViewInit,OnDestroy {

  @ViewChild('table') table: MatTable<any>;
  public objects: RegCubiculos[];
  public displayedColumns = ['pos', 'ur', 'biblioteca', 'date','options'];
  private onDestroy = new Subject<any>();

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getCubiculos() {
    return this._api.getObjects(MODELS.REG_CUBICULOS);
  }

  renderRows() {
    this.getCubiculos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: RegCubiculos[]) => {
        this.objects = objects;
        this.table.renderRows();
      });
  }

  deleteObject(object: RegCubiculos) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el registro ${moment(object.creadoEn).format('YYYY/MM/DD')}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(object, MODELS.REG_CUBICULOS)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data) => {
                if (data) {
                  this.openSnack(`Registro "${moment(object.creadoEn).format('YYYY/MM/DD')}" eliminado`);
                  this.renderRows();
                }
              },
              () => {
                this.openSnack(
                  `Error al eliminar registro "${moment(object.creadoEn).format('YYYY/MM/DD')}"`
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

  openDialog(data?: RegCubiculos) {
    const dialogRef = this._dialog.open(AddRegistroCubiculoComponent, {
      width: '1000px',
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
    this.getCubiculos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: RegCubiculos[]) => {
        this.objects = objects;
      });
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
