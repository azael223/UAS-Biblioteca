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
import { MODELS, TIPOS, TURNOS } from '@models/Types';
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
import { UsCubiculos } from '@models/usCubiculos.model';
import { formatDate } from '@angular/common';
import {
  ReportConfig,
  ReporteUsuariosComponent,
} from '@components/reporte-usuarios/reporte-usuarios.component';
import { DateRangeFilter } from '@components/filters-button/filters-button.component';

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
  public filters: any = { status: 'A' };
  public creadoEnFilter: DateRangeFilter = {
    prop: 'creadoEn',
    title: 'Creado En',
  };
  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService,
    private _pagination: PaginationService
  ) {}
  public config: ReportConfig = {
    title: [
      { value: 'UNIVERSIDAD AUTÓNOMA DE SINALOA', class: 'title-1' },
      {
        value: 'DIRECCIÓN GENERAL DEL SISTEMA BIBLIOTECARIO',
        class: 'title-2',
      },
      {
        value: 'USO DE CUBICULOS DE ESTUDIO',
        class: 'title-3',
      },
    ],
    columns: [
      { header: { name: 'N' }, prop: 'num', class: 'flex-2' },
      {
        header: { name: 'Nombre' },
        prop: 'nombre',
        class: 'flex-40',
      },
      { header: { name: 'Escuela/carrera' }, prop: 'escuela' },
      { header: { name: 'Fecha' }, prop: 'fecha', class: 'flex-7' },
      { header: { name: 'Cubículo' }, prop: 'cubiculo', class: 'flex-7' },
      { header: { name: 'Entrada' }, prop: 'entrada', class: 'flex-7' },
      { header: { name: 'Salida' }, prop: 'salida', class: 'flex-7' },
    ],
    dataset: [{}],
    info: [],
    filename: '',
  };

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.renderRows();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  onChangeFilters(filters: any) {
    delete this.filters.creadoEn;
    if (filters.creadoEn) this.filters.creadoEn = filters.creadoEn;
    this.renderRows();
  }

  search(searchParam) {
    let like = { like: `%${searchParam}%` };
    this.filters.or = [{ ur: like }, { biblioteca: like }];
    this.renderRows();
  }

  renderRows(firstLoad?: boolean) {
    this.loaded = false;
    let count$ = this._api.count(this.model, this.filters);
    let registros$ = this._api.getObjects(this.model, {
      where: this.filters,
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
  viewDoc(registro: RegCubiculos) {
    this._api
      .getObjects(MODELS.REG_CUBICULOS, {
        limit: 1,
        where: { id: registro.id },
        order: 'creadoEn DESC',
        include: [
          {
            relation: 'usCubiculos',
            scope: {
              where: { status: 'A' },
              include: [
                {
                  relation: 'carrera',
                  scope: { include: [{ relation: 'institucion' }] },
                },
                { relation: 'cubiculo' },
              ],
            },
          },
        ],
      })
      .subscribe(
        (res: RegCubiculos[]) => {
          let registro = res[0];
          this.config.filename = `cubiculos_${registro.id}_${formatDate(
            registro.creadoEn,
            'dd-MM-YYYY',
            'en-MX'
          )}`;
          this.config.info = [
            { title: 'UR', value: registro.ur },
            { title: 'Biblioteca', value: registro.biblioteca },
          ];
          this.config.dataset = [];
          if (registro.usCubiculos)
            this.config.dataset = registro.usCubiculos.map(
              (us: UsCubiculos, index) =>
                <any>{
                  num: index + 1,
                  nombre: us.nombre,
                  escuela: `${
                    us.carrera && us.carrera.institucion
                      ? us.carrera.institucion.nombre
                      : ''
                  } / ${us.carrera ? us.carrera.nombre : ''}`,
                  fecha: formatDate(us.creadoEn, 'dd/MM/YYYY', 'en-MX'),
                  cubiculo: us.cubiculo ? us.cubiculo.nombre : '',
                  entrada: formatDate(us.creadoEn, 'h:mm a', 'es-MX'),
                  salida: formatDate(us.terminadoEn, 'h:mm a', 'es-MX'),
                }
            );
          this._dialog
            .open(ReporteUsuariosComponent, {
              data: this.config,
              width: '100%',
              height: '90%',
            })
            .afterClosed()
            .pipe(takeUntil(this.onDestroy));
        },
        (error) => {
          this._alerts.error(
            'Error al buscar registro, verifique su conexión.'
          );
        }
      );
  }

  view(object: any) {
    const dialog = this._dialog.open(CubiculosRegistroModalComponent, {
      data: object,
      width: '100%',
      height: '90%',
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
}
