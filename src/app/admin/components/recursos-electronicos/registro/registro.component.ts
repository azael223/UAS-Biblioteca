import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MODELS, TURNOS } from '@models/Models';
import { RegRecElec } from '@models/regRecElec.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddRegistroRecElecComponent } from './add-registro-rec-elec/add-registro-rec-elec.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @ViewChild('table') table: MatTable<any>;
  public objects: RegRecElec[];
  public displayedColumns = ['pos', 'area','turno', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public turnos=TURNOS

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getCubiculos() {
    return this._api.getObjects(MODELS.REG_REC_ELEC);
  }

  renderRows() {
    this.getCubiculos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: RegRecElec[]) => {
        this.objects = objects;
        this.table.renderRows();
      });
  }

  deleteObject(object: RegRecElec) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el registro ${moment(object.creadoEn).format(
          'YYYY/MM/DD'
        )}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(object, MODELS.REG_REC_ELEC)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data) => {
                if (data) {
                  this.openSnack(
                    `Registro "${moment(object.creadoEn).format(
                      'YYYY/MM/DD'
                    )}" eliminado`
                  );
                  this.renderRows();
                }
              },
              () => {
                this.openSnack(
                  `Error al eliminar registro "${moment(object.creadoEn).format(
                    'YYYY/MM/DD'
                  )}"`
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

  openDialog(data?: RegRecElec) {
    const dialogRef = this._dialog.open(AddRegistroRecElecComponent, {
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
      .subscribe((objects: RegRecElec[]) => {
        this.objects = objects;
      });
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
