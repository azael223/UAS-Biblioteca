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
import { GENEROS, MODELS } from '@models/Types';
import { RegEquipos } from '@models/regEquipos';
import { UsEquipos } from '@models/usEquipos.model';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { Column } from '@components/registro-view/registro-view.component';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { finalize } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-rec-elec-registro-modal',
  templateUrl: './rec-elec-registro-modal.component.html',
  styleUrls: ['./rec-elec-registro-modal.component.scss'],
})
export class RecElecRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _dialogRef: MatDialogRef<RecElecRegistroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: RegEquipos,
    private _alerts: AlertsService,
    private _pagination: PaginationService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    { title: 'Genero', matColumnDef: 'genero', property: 'sexo' },
    { title: 'Email', matColumnDef: 'email', property: 'email' },
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
      title: 'Equipo Computo',
      matColumnDef: 'equipo',
      property: 'equipo',
    },
    {
      title: 'Creado En',
      matColumnDef: 'creadoEn',
      property: 'creadoEn',
    },
    {
      title: 'Terminado En',
      matColumnDef: 'terminadoEn',
      property: 'termindoEn',
    },
  ];
  public usuarios: UsEquipos[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.US_EQUIPOS;

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
      where: { regEquiposId: this.dataIn.id, status: 'A' },
      limit: this.pages,
      skip: this.pages * this.index,
      include: [
        {
          relation: 'carrera',
          scope: {
            include: [{ relation: 'institucion' }],
          },
        },
        'equipo',
      ],
    });
    let count$ = this._api.count(this.model, {
      where: { regEquiposId: this.dataIn.id, status: 'A' },
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
            (usuario: UsEquipos) =>
              <any>{
                ...usuario,
                equipo:
                  usuario.equipo && usuario.equipo.nombre
                    ? usuario.equipo.nombre
                    : '',
                carrera:
                  usuario.carrera && usuario.carrera.nombre
                    ? usuario.carrera.nombre
                    : '',
                institucion:
                  usuario.carrera &&
                  usuario.carrera.institucion &&
                  usuario.carrera.institucion.nombre
                    ? usuario.carrera.institucion.nombre
                    : '',
                creadoEn: formatDate(usuario.creadoEn, 'medium', 'es-MX'),
                terminadoEn: formatDate(usuario.terminadoEn, 'medium', 'es-MX'),
                sexo: GENEROS[usuario.sexo],
              }
          );
          if (firstLoad) this.table.renderRows();
        },
        (error) => {
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
