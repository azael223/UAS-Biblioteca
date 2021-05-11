import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MODELS, TURNOS } from '@models/Models';
import { RegEquipos } from '@models/regEquipos';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { ConfirmDialogComponent } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddRegistroRecElecComponent } from './add-registro-rec-elec/add-registro-rec-elec.component';
import { RecElecRegistroModalComponent } from './rec-elec-registro-modal/rec-elec-registro-modal.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  @ViewChild('table') table: MatTable<any>;
  public objects: RegEquipos[];
  public displayedColumns = ['pos', 'area', 'turno', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public turnos = TURNOS;
  private model = MODELS.REG_EQUIPOS;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;

  constructor(
    private _api: BibliotecaApiService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _pagination: PaginationService
  ) {}

  count() {
    return this._api.count(this.model);
  }

  getRegistros() {
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
        this.getRegistros()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((objects: RegEquipos[]) => {
            this.objects = objects;
            this.loaded = true;
            if (firstLoad) {
              this.table.renderRows();
            }
          });
      });
  }

  deleteObject(object: RegEquipos) {
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
            .deleteObject(this.model, object.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                console.log(data);
                if (data && !data.error) {
                  this.openSnack(`RegBiblioteca ${object.id} eliminado`);
                  this.renderRows();
                } else {
                  this.openSnack(`RegBiblioteca  ${object.id} no se pudo eliminar`);
                }
              },
              () => {
                this.openSnack(`Error al eliminar registro ${object.id}`);
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

  view(object: any) {
    const dialog = this._dialog.open(RecElecRegistroModalComponent, {
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

  openSnack(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  openDialog(data?: RegEquipos) {
    const dialogRef = this._dialog.open(AddRegistroRecElecComponent, {
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
