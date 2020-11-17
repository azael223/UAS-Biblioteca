import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Cubiculo } from '@models/cubiculo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

  getCubiculos() {
    return this._api.getObjects(MODELS.CUBICULO);
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
        this.getCubiculos()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((cubiculos: Cubiculo[]) => {
            this.cubiculos = cubiculos;
            this.table.renderRows();
          });
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
