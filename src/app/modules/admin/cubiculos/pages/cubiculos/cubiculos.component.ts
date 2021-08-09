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
import { Cubiculo } from '@models/cubiculo.model';
import { MODELS } from '@models/Types';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { forkJoin, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { AddCubiculoComponent } from '../../components/add-cubiculo/add-cubiculo.component';
import { AlertsService } from '@services/alerts.service';

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
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public loaded = false;
  private model = MODELS.CUBICULOS;
  public filters: any = { status: 'A' };

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService,
    private _pagination: PaginationService
  ) {}

  search(searchParam) {
    let like = { like: `%${searchParam}%` };
    this.filters.or = [{ nombre: like }];
    this.renderRows();
  }

  renderRows(firstLoad?: boolean) {
    this.loaded = false;
    let count$ = this._api.count(this.model, this.filters);
    let cubiculos$ = this._api.getObjects(this.model, {
      where: this.filters,
      order: 'creadoEn DESC',
      limit: this.pages,
      skip: this.pages * this.index,
    });
    forkJoin([count$, cubiculos$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.cubiculos = res[1];
          if (firstLoad) this.table.renderRows();
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  deleteObject(object: Cubiculo) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el cubiculo ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .updateObject(
              <Cubiculo>{ id: object.id, nombre: object.nombre },
              this.model
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Cubiculo ${object.id} eliminado.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(`Error al eliminar cubiculo ${object.id}.`);
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

  openDialog(data?: Cubiculo) {
    const dialogRef = this._dialog.open(AddCubiculoComponent, {
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
