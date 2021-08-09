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
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Types';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddInstitucionComponent } from '../components/add-institucion/add-institucion.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss'],
})
export class InstitucionesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('table') table: MatTable<any>;
  public instituciones: Institucion[];
  public displayedColumns = ['pos', 'name', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  private model = MODELS.INSTITUCIONES;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
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
    let count$ = this._api.count(this.model, this.filters);
    let instituciones$ = this._api.getObjects(this.model, {
      where: this.filters,
      order: 'creadoEn DESC',
      limit: this.pages,
      skip: this.pages * this.index,
      include: ['carreras'],
    });
    forkJoin([count$, instituciones$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.instituciones = res[1];
          if (firstLoad) this.table.renderRows();
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  deleteObject(object: Institucion) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar la institucion ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .updateObject(
              <Institucion>{ id: object.id, status: 'I' },
              this.model
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Institución ${object.id} eliminada.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(
                  `Error al eliminar la institución ${object.id}.`
                );
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

  openDialog(data?: Institucion) {
    const dialogRef = this._dialog.open(AddInstitucionComponent, {
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
}
