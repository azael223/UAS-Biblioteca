import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Cubiculo } from '@models/cubiculo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Types';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsCubiculos } from '@models/usCubiculos.model';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { Column } from '@components/registro-view/registro-view.component';
import { forkJoin, Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cubiculos-registro-modal',
  templateUrl: './cubiculos-registro-modal.component.html',
  styleUrls: ['./cubiculos-registro-modal.component.scss'],
})
export class CubiculosRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _dialogRef: MatDialogRef<CubiculosRegistroModalComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) public dataIn: RegCubiculos,
    private _pagination: PaginationService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    {
      title: 'Institución',
      matColumnDef: 'institucion',
      property: 'institucion',
    },
    {
      title: 'Carrera',
      matColumnDef: 'carrera',
      property: 'carrera',
    },
    {
      title: 'Cubiculo',
      matColumnDef: 'cubiculo',
      property: 'cubiculo',
    },
    {
      title: 'Creado En',
      matColumnDef: 'creadoEn',
      property: 'creadoEn',
    },
    {
      title: 'Terminado En',
      matColumnDef: 'terminadoEn',
      property: 'terminadoEn',
    },
  ];
  public usuarios: UsCubiculos[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.US_CUBICULOS;

  getIndex(index: number) {
    return (this.index ? this.index : 1) * index - this.pages * this.index;
  }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;
    console.log(pageEvent);
    this.renderRows();
  }

  onNoClick() {
    this._dialogRef.close();
  }

  renderRows(firstLoad?: boolean) {
    let usuarios$ = this._api.getObjects(this.model, {
      where: { regCubiculosId: this.dataIn.id, stauts: 'A' },
      limit: this.pages,
      skip: this.pages * this.index,
      include: [
        {
          relation: 'carrera',
          scope: {
            include: [{ relation: 'institucion' }],
          },
        },
        'cubiculo',
      ],
    });
    let count$ = this._api.count(this.model, {
      where: { regCubiculosId: this.dataIn.id, status: 'A' },
    });
    forkJoin([count$, usuarios$])
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          this.totalPages = res[0].count;
          this.usuarios = res[1].map(
            (usuario: UsCubiculos) =>
              <any>{
                ...usuario,
                cubiculo:
                  usuario.cubiculo && usuario.cubiculo.nombre
                    ? usuario.cubiculo.nombre
                    : '',
                institucion:
                  usuario.carrera &&
                  usuario.carrera.institucion &&
                  usuario.carrera.institucion.nombre
                    ? usuario.carrera.institucion.nombre
                    : '',
                carrera:
                  usuario.carrera && usuario.carrera.nombre
                    ? usuario.carrera.nombre
                    : '',
                creadoEn: formatDate(usuario.creadoEn, 'medium', 'es-MX'),
                terminadoEn: formatDate(usuario.terminadoEn, 'medium', 'es-MX'),
              }
          );
          if (firstLoad) this.table.renderRows();
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
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
