import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { GENEROS, MODELS, TURNOS } from '@models/Types';
import { RegEquipos } from '@models/regEquipos';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AddRegistroRecElecComponent } from '../../components/add-registro-rec-elec/add-registro-rec-elec.component';
import { RecElecRegistroModalComponent } from '../../components/rec-elec-registro-modal/rec-elec-registro-modal.component';
import { AlertsService } from '@services/alerts.service';
import {
  ReportConfig,
  ReporteUsuariosComponent,
} from '@components/reporte-usuarios/reporte-usuarios.component';
import { formatDate } from '@angular/common';
import { UsEquipos } from '@models/usEquipos.model';
import {
  DateRangeFilter,
  SelectFilter,
} from '@components/filters-button/filters-button.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {
  @ViewChild('table') table: MatTable<any>;
  public registros: RegEquipos[];
  public displayedColumns = ['pos', 'area', 'turno', 'date', 'options'];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public turnos = TURNOS;
  private model = MODELS.REG_EQUIPOS;
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
    private _pagination: PaginationService,
    private _alerts: AlertsService
  ) {}
  public config: ReportConfig = {
    title: [
      { value: 'UNIVERSIDAD AUTÓNOMA DE SINALOA', class: 'title-1' },
      {
        value: 'DIRECCIÓN GENERAL DEL SISTEMA BIBLIOTECARIO',
        class: 'title-1',
      },
      {
        value: 'RECURSOS ELECTRÓNICOS',
        class: 'title-1',
      },
    ],
    columns: [
      { header: { name: 'N' }, prop: 'num', class: 'flex-2' },
      {
        header: { name: 'Nombre' },
        prop: 'nombre',
        class: 'flex-30',
      },
      { header: { name: 'Sexo' }, prop: 'sexo', class: 'flex-3' },
      { header: { name: 'Escuela/carrera' }, prop: 'escuela' },
      {
        header: { name: 'Correo electrónico' },
        prop: 'correo',
        class: 'flex-20',
      },
      { header: { name: 'Equipo N' }, prop: 'equipo', class: 'flex-6' },
      { header: { name: 'Entrada' }, prop: 'entrada', class: 'flex-6' },
      { header: { name: 'Salida' }, prop: 'salida', class: 'flex-6' },
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
    delete this.filters.turno;
    if (filters.creadoEn) this.filters.creadoEn = filters.creadoEn;
    if (filters.turno) this.filters.turno = filters.turno;
    this.renderRows();
  }

  search(searchParam) {
    let like = { like: `%${searchParam}%` };
    this.filters.or = [{ area: like }];
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
            .updateObject(
              <RegEquipos>{ id: object.id, status: 'I' },
              this.model
            )
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (data: any) => {
                this._alerts.success(`Registro ${object.id} eliminado.`);
                this.renderRows();
              },
              () => {
                this._alerts.error(
                  `Error al eliminar el registro ${object.id}.`
                );
              }
            );
        }
      });
  }

  viewDoc(registro: RegEquipos) {
    this._api
      .getObjects(MODELS.REG_EQUIPOS, {
        limit: 1,
        where: { id: registro.id },
        order: 'creadoEn DESC',
        include: [
          {
            relation: 'usEquipos',
            scope: {
              where: { status: 'A' },
              include: [
                {
                  relation: 'carrera',
                  scope: { include: [{ relation: 'institucion' }] },
                },
                { relation: 'equipo' },
              ],
            },
          },
        ],
      })
      .subscribe(
        (res: RegEquipos[]) => {
          let registro = res[0];
          this.config.filename = `equipos_${registro.id}_${formatDate(
            registro.creadoEn,
            'dd-MM-YYYY',
            'en-MX'
          )}`;
          this.config.info = [
            { title: 'Area', value: registro.area },
            { title: 'Turno', value: registro.turno },
            {
              title: 'Fecha',
              value: formatDate(registro.creadoEn, 'dd/MM/YYYY', 'en-MX'),
            },
          ];
          this.config.dataset = [];
          if (registro.usEquipos)
            this.config.dataset = registro.usEquipos.map(
              (us: UsEquipos, index) =>
                <any>{
                  num: index + 1,
                  nombre: us.nombre,
                  sexo: us.sexo,
                  correo: us.email,
                  escuela: `${
                    us.carrera && us.carrera.institucion
                      ? us.carrera.institucion.nombre
                      : ''
                  } / ${us.carrera ? us.carrera.nombre : ''}`,
                  entrada: formatDate(us.creadoEn, 'h:mm a', 'es-MX'),
                  equipo: us.equipo ? us.equipo.nombre : '',
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
    const dialog = this._dialog.open(RecElecRegistroModalComponent, {
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
}
