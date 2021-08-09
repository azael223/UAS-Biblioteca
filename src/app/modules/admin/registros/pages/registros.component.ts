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
import { MODELS, TIPOS, TURNOS } from '@models/Types';
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
import {
  ReportConfig,
  ReporteUsuariosComponent,
} from '@components/reporte-usuarios/reporte-usuarios.component';
import { formatDate } from '@angular/common';
import { UsBiblioteca } from '@models/usBiblioteca.model';
import {
  DateRangeFilter,
  SelectFilter,
} from '@components/filters-button/filters-button.component';

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
  public filters: any = { status: 'A' };

  public creadoEnFilter: DateRangeFilter = {
    prop: 'creadoEn',
    title: 'Creado En',
  };

  public turnoFilter: SelectFilter = {
    items: [
      { nombre: 'Matutino', value: 'M' },
      { nombre: 'Vespertino', value: 'V' },
      { nombre: 'Nocturno', value: 'N' },
    ],
    bind: 'nombre',
    title: 'Turno',
    value: 'value',
    prop: 'turno',
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
      { value: 'DIRECCIÓN DEL SISTEMA DE GESTIÓN', class: 'title-1' },
      {
        value: 'DIRECCIÓN GENERAL DEL SISTEMA BIBLIOTECARIO',
        class: 'title-2',
      },
      {
        value: 'REGISTRO DE USUARIOS PARA BIBLIOTECA CENTRAL',
        class: 'title-3',
      },
    ],
    columns: [
      { header: { name: 'N' }, prop: 'num', class: 'flex-2' },
      {
        header: { name: 'Nombre del usuario' },
        prop: 'nombre',
        class: 'flex-50',
      },
      { header: { name: 'Sexo' }, prop: 'sexo', class: 'flex-3' },
      { header: { name: 'Escuela/Institución' }, prop: 'escuela' },
      { header: { name: 'Tipo de usuario' }, prop: 'tipo', class: 'flex-8' },
      { header: { name: 'Hora' }, prop: 'hora', class: 'flex-6' },
    ],
    dataset: [{}],
    info: [],
    filename: '',
  };

  onChangeFilters(filters: any) {
    delete this.filters.creadoEn;
    delete this.filters.turno;
    if (filters.creadoEn) this.filters.creadoEn = filters.creadoEn;
    if (filters.turno) this.filters.turno = filters.turno;
    this.renderRows();
  }

  search(searchParam) {
    let like = { like: `%${searchParam}%` };
    this.filters.or = [{ ur: like }, { biblioteca: like }];
    this.renderRows();
  }

  renderRows(firstLoad?: boolean) {
    this.loaded = false;
    const count$ = this._api.count(this.model, this.filters);
    const registros$ = this._api.getObjects(this.model, {
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

  viewDoc(registro: RegBiblioteca) {
    this._api
      .getObjects(MODELS.REG_BIBLIOTECA, {
        limit: 1,
        where: { id: registro.id },
        order: 'creadoEn DESC',
        include: [
          {
            relation: 'usBibliotecas',
            scope: {
              where: { status: 'A' },
              include: [
                {
                  relation: 'carrera',
                  scope: { include: [{ relation: 'institucion' }] },
                },
              ],
            },
          },
        ],
      })
      .subscribe(
        (res: RegBiblioteca[]) => {
          let registro = res[0];
          this.config.filename = `registros_${registro.id}_${formatDate(
            registro.creadoEn,
            'dd-MM-YYYY',
            'en-MX'
          )}`;
          this.config.info = [
            { title: 'UR', value: registro.ur },
            { title: 'Area', value: registro.area },
            { title: 'Turno', value: TURNOS[registro.turno] },
            {
              title: 'Fecha',
              value: formatDate(registro.creadoEn, 'dd/MM/YYYY', 'en-MX'),
            },
          ];
          this.config.dataset = [];
          if (registro.usBibliotecas)
            this.config.dataset = registro.usBibliotecas.map(
              (us: UsBiblioteca, index) =>
                <any>{
                  num: index + 1,
                  nombre: us.nombre,
                  sexo: us.sexo,
                  escuela: `${
                    us.carrera && us.carrera.institucion
                      ? us.carrera.institucion.nombre
                      : ''
                  } / ${us.carrera ? us.carrera.nombre : ''}`,
                  tipo: TIPOS[us.tipo],
                  hora: formatDate(us.creadoEn, 'h:mm a', 'es-MX'),
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
    const dialog = this._dialog.open(UsuariosRegistroModalComponent, {
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
