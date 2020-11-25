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
import { Cubiculo } from '@models/cubiculo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AddCubiculoComponent } from './add-cubiculo/add-cubiculo.component';

@Component({
  selector: 'app-cubiculos',
  templateUrl: './cubiculos.component.html',
  styleUrls: ['./cubiculos.component.scss'],
})
export class CubiculosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('table') table: MatTable<any>;
  public cubiculos: Cubiculo[];
  public displayedColumns = ['pos', 'name', 'options'];
  private onDestroy = new Subject<any>();

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  getCubiculos() {
    return this._api.getObjects(MODELS.CUBICULO);
  }

  renderRows() {
    this.getCubiculos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((cubiculos: Cubiculo[]) => {
        this.cubiculos = cubiculos;
        this.table.renderRows();
      });
  }

  deleteObject(cubiculo: Cubiculo) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el cubiculo "${cubiculo.nombre}?"`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .deleteObject(MODELS.CUBICULO, cubiculo.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data) => {
                if (data) {
                  console.log(cubiculo);
                  this.openSnack(`Cubiculo "${cubiculo.nombre}" eliminado`);
                  this.renderRows();
                }
              },
              () => {
                this.openSnack(
                  `Error al eliminar cubiculo "${cubiculo.nombre}"`
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

  openDialog(data?: Cubiculo) {
    const dialogRef = this._dialog.open(AddCubiculoComponent, {
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
      .subscribe((cubiculos: Cubiculo[]) => {
        this.cubiculos = cubiculos;
      });
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
