import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MODELS } from '@models/Types';
import { RegCubiculos } from '@models/regCubiculos.model';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddRegistroCubiculoComponent } from '../../components/add-registro-cubiculo/add-registro-cubiculo.component';
import { CubiculosRegistroModalComponent } from '../../components/cubiculos-registro-modal/cubiculos-registro-modal.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public registros: RegCubiculos[];
  public displayedColumns = ['pos', 'ur', 'biblioteca', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  private model = MODELS.REG_CUBICULOS;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService,
    private _pagination: PaginationService
  ) {}

  count() {
    return this._api.count(this.model);
  }

  renderRows(firstLoad?: boolean) {
    let count$ = this._api.count(this.model, { status: 'A' });
    let registros$ = this._api.getObjects(this.model, {
      where: { status: 'A' },
      order: 'creadoEn DESC',
      limit: this.pages,
      skip: this.pages * this.index,
    });
    forkJoin([count$, registros$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.registros = res[1];
          if (firstLoad) this.table.renderRows();
        },
        () => {
          this._alerts.error('Verifique su conexión');
        }
      );
  }

  deleteObject(object: RegCubiculos) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el registro ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .updateObject(
              <RegCubiculos>{ id: object.id, status: 'I' },
              this.model
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Registro ${object.id} eliminado.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(`Error al eliminar registro ${object.id}.`);
              }
            );
        }
      });
  }


  view(object: any) {
    const dialog = this._dialog.open(CubiculosRegistroModalComponent, {
      data: object,
      width: '100%',
      height: '75%',
    });
    dialog
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((res) => {});
  }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;
    console.log(pageEvent);
    this.renderRows();
  }

  openDialog(data?: RegCubiculos) {
    const dialogRef = this._dialog.open(AddRegistroCubiculoComponent, {
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
