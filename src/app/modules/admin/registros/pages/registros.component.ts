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
import { MODELS, TURNOS } from '@models/Types';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddRegistroComponent } from '../components/add-registro/add-registro.component';
import { UsuariosRegistroModalComponent } from '../components/usuarios-registro-modal/usuarios-registro-modal.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public registros: RegBiblioteca[];
  public displayedColumns = ['pos', 'ur', 'area', 'turno', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public turnos = TURNOS;
  private model = MODELS.REG_BIBLIOTECA;
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

  renderRows(firstLoad?: boolean) {
    const count$ = this._api.count(this.model, { status: 'A' });
    const registros$ = this._api.getObjects(this.model, {
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
        (error) => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  deleteObject(object: RegBiblioteca) {
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
            .updateObject({ id: object.id, status: 'I' }, this.model)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Registro ${object.id} eliminado`);
                this.renderRows();
              },
              (error) => {
                this._alerts.error(
                  `No se pudo eliminar el registro ${object.id}.`
                );
              }
            );
        }
      });
  }

  view(object: any) {
    console.log(object);
    const dialog = this._dialog.open(UsuariosRegistroModalComponent, {
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

  openDialog(data?: RegBiblioteca) {
    const dialogRef = this._dialog.open(AddRegistroComponent, {
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
