import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { EquipoComputo } from '@models/equipoComputo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
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
  public displayedColumns = ['pos', 'name', 'abbrv','options'];
  private onDestroy = new Subject<any>();

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

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
        this.getInstituciones()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((instituciones: Institucion[]) => {
            this.instituciones = instituciones;
            this.table.renderRows()
          });
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
