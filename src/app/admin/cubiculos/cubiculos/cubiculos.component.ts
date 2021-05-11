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
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public loaded = false;
  private model = MODELS.CUBICULOS;

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _pagination: PaginationService
  ) {}

  count() {
    return this._api.count(this.model);
  }

  getEquipos() {
    return this._api.getObjects(this.model, {
      order: { creadoEn: 'DESC' },
      take: this.pages,
      skip: this.pages * this.index,
    });
  }

  renderRows(firstLoad?: boolean) {
    this.count()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((count: any) => {
        this.totalPages = count;
        this.getEquipos()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((objects: Cubiculo[]) => {
            this.cubiculos = objects;
            this.loaded = true;
            if (firstLoad) {
              this.table.renderRows();
            }
          });
      });
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
            .deleteObject(this.model, object.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                console.log(data);
                if (data && !data.error) {
                  this.openSnack(`Cubiculo ${object.id} eliminado`);
                  this.renderRows();
                } else {
                  this.openSnack(
                    `El cubiculo ${object.id} no se pudo eliminar`
                  );
                }
              },
              () => {
                this.openSnack(`Error al eliminar cubiculo ${object.id}`);
              }
            );
        }
      });
  }

  // getIndex(index: number) {
  //   return (
  //     this.totalPages -
  //     (this.index ? this.index : 1) * index -
  //     this.pages * this.index
  //   );
  // }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;
    console.log(pageEvent);
    this.renderRows();
  }

  openSnack(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
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
