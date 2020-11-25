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
import { EquipoComputo, STATUS_EQUIPO } from '@models/equipoComputo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddEquipoComponent } from './add-equipo/add-equipo.component';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
})
export class EquiposComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public equipos: EquipoComputo[];
  public displayedColumns = ['pos', 'name', 'status', 'options'];
  private onDestroy = new Subject<any>();
  public status = STATUS_EQUIPO;
  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getEquipos() {
    return this._api.getObjects(MODELS.EQUIPOS_COMPUTO);
  }

  openDialog(data?: EquipoComputo) {
    const dialog = this._dialog.open(AddEquipoComponent, {
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
    this.getEquipos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((objects: EquipoComputo[]) => {
        this.equipos = objects;
        this.table.renderRows();
      });
  }

  deleteObject(object: EquipoComputo) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el equipo "${object.nombre}?"`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(MODELS.EQUIPOS_COMPUTO, object.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data) => {
                if (data) {
                  this.openSnack(`Equipo "${object.nombre}" eliminado`);
                  this.renderRows();
                }
              },
              () => {
                this.openSnack(`Error al eliminar equipo "${object.nombre}"`);
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
    this.getEquipos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((equipos: EquipoComputo[]) => {
        this.equipos = equipos;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
