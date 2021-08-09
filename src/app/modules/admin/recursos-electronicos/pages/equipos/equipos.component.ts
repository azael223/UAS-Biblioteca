import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Equipo } from '@models/equipo.model';
import { MODELS, STATUS } from '@models/Types';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddEquipoComponent } from '../../components/add-equipo/add-equipo.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
})
export class EquiposComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public equipos: Equipo[];
  public displayedColumns = ['pos', 'name', 'statusEquipo', 'options'];
  private onDestroy = new Subject<any>();
  public status = STATUS;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public loaded = false;
  private model = MODELS.EQUIPOS;
  public filters: any = { status: 'A' };

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _pagination: PaginationService,
    private _alerts: AlertsService
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.renderRows();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  search(searchParam) {
    let like = { like: `%${searchParam}%` };
    this.filters.or = [{ nombre: like }];
    this.renderRows();
  }

  renderRows(firstLoad?: boolean) {
    this.loaded = false;
    this.totalPages = 0;
    this.equipos = [];
    const count$ = this._api.count(this.model, this.filters);
    const equipos$ = this._api.getObjects(this.model, {
      where: this.filters,
      order: 'creadoEn DESC',
      limit: this.pages,
      skip: this.pages * this.index,
    });
    forkJoin([count$, equipos$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.equipos = res[1];
          if (firstLoad) this.table.renderRows();
        },
        (error) => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  deleteObject(object: Equipo) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el equipo ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .updateObject(<Equipo>{ id: object.id, status: 'I' }, this.model)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Equipo ${object.id} eliminado.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(`Error al eliminar equipo ${object.id}.`);
              }
            );
        }
      });
  }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;

    this.renderRows();
  }
  openDialog(data?: Equipo) {
    const dialogRef = this._dialog.open(AddEquipoComponent, {
      width: '600px',
      data: data,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) this.renderRows();
      });
  }
}
