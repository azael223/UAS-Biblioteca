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
import { MODELS, PERMISOS } from '@models/Types';
import { Usuario } from '@models/usuario.model';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
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
  public displayedColumns = ['pos', 'username', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  private model = MODELS.USUARIOS;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public filters: any = { status: 'A' };

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _pagination: PaginationService,
    private _alerts: AlertsService,
    private _auth: AuthService
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
    this.filters.or = [{ username: like }];
    this.renderRows();
  }

  renderRows(firstLoad?: boolean) {
    this.loaded = false;
    this.totalPages = 0;
    this.usuarios = [];
    let usuario = this._auth.getAuth().usuario;
    let admin: any = {};
    if (!usuario.permisos.includes(PERMISOS.ADMIN))
      admin = { permisos: { neq: ['ADMIN'] } };

    let count$ = this._api.count(this.model, { ...this.filters, ...admin });
    let usuarios$ = this._api.getObjects(this.model, {
      where: { ...this.filters, ...admin },
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
}
