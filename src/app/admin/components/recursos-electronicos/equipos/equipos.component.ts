import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { EquipoComputo, STATUS_EQUIPO } from '@models/equipoComputo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
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
  public displayedColumns = ['pos', 'name', 'status','options'];
  private onDestroy = new Subject<any>();

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

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
        this.getEquipos()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((equipos: EquipoComputo[]) => {
            this.equipos = equipos;
            this.table.renderRows();
          });
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
