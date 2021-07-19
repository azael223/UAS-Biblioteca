import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { MODELS } from '@models/Types';
import { Usuario } from '@models/usuario.model';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import { PaginationService } from '@services/pagination.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AddUsuarioComponent } from '../../components/add-usuario/add-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table: MatTable<any>;
  public usuarios: Usuario[];
  public displayedColumns = ['pos', 'username', 'rol', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  private model = MODELS.USUARIOS;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _pagination: PaginationService,
    private _alerts: AlertsService
  ) {}

  renderRows(firstLoad?: boolean) {
    let count$ = this._api.count(this.model);
    let usuarios$ = this._api.getObjects(this.model, {
      where: { stauts: 'A' },
      order: 'creadoEn DESC',
      limit: this.pages,
      skip: this.pages * this.index,
    });
    forkJoin([count$, usuarios$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.usuarios = res[1];
          if (firstLoad) this.table.renderRows();
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  deleteObject(object: Usuario) {
    const dialogRefd = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: `¡Cuidado!`,
        message: `¿Desea eliminar el usuario ${object.id}?`,
      },
    });
    dialogRefd
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this._api
            .updateObject(<Usuario>{ id: object.id, status: 'I' }, this.model)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Usuario ${object.id} eliminado.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(
                  `Error al eliminar el usuario ${object.id}.`
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

  openDialog(data?: Usuario) {
    const dialogRef = this._dialog.open(AddUsuarioComponent, {
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
