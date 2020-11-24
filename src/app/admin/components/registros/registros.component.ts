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
import { MODELS, TURNOS } from '@models/Models';
import { Registro } from '@models/registro.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddRegistroComponent } from './add-registro/add-registro.component';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public objects: Registro[];
  public displayedColumns = ['pos', 'ur', 'area', 'turno', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public turnos = TURNOS;

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getRegistros() {
    return this._api.getObjects(MODELS.REGISTROS);
  }
  getRegistro() {
    this._api
      .getObjects(MODELS.REGISTROS,{where:{id:2}})
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: Registro[]) => {
        console.log(data)
      });
  }

  renderRows() {
    this.getRegistros()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: Registro[]) => {
        this.objects = objects;
        this.table.renderRows();
      });
  }

  deleteObject(object: Registro) {
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
            .deleteObject(object, MODELS.REGISTROS)
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

  openDialog(data?: Registro) {
    const dialogRef = this._dialog.open(AddRegistroComponent, {
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
    this.getRegistro()
    this.getRegistros()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: Registro[]) => {
        this.objects = objects;
      });
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
