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
import { Institucion } from '@models/institucion.model';
import { GENEROS, MODELS, TIPOS } from '@models/Types';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { UsBiblioteca } from '@models/usBiblioteca.model';
import { ApiService } from '@services/api.service';
import { PaginationService } from 'app/core/services/pagination.service';
import { Column } from '@components/registro-view/registro-view.component';
import { forkJoin, pipe, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Carrera } from '@models/carrera.model';
import { AlertsService } from '@services/alerts.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuarios-registro-modal',
  templateUrl: './usuarios-registro-modal.component.html',
  styleUrls: ['./usuarios-registro-modal.component.scss'],
})
export class UsuariosRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _dialogRef: MatDialogRef<UsuariosRegistroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: RegBiblioteca,
    private _pagination: PaginationService,
    private _alerts: AlertsService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    { title: 'Genero', matColumnDef: 'genero', property: 'sexo' },
    { title: 'Tipo', matColumnDef: 'tipo', property: 'tipo' },
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
    { title: 'Creado En', matColumnDef: 'creadoEn', property: 'creadoEn' },
    {
      title: 'TerminadoEn',
      matColumnDef: 'terminadoEn',
      property: 'terminadoEn',
    },
  ];
  public usuarios: UsBiblioteca[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.US_BIBLIOTECAS;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderRows();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  getIndex(index: number) {
    return (this.index ? this.index : 1) * index - this.pages * this.index;
  }

  pagesChange(pageEvent: PageEvent) {
    this._pagination.pagination = pageEvent.pageSize;
    this.pages = pageEvent.pageSize;
    this.index = pageEvent.pageIndex;

    this.renderRows();
  }

  onNoClick() {
    this._dialogRef.close();
  }

  renderRows(firstLoad?: boolean) {
    let usuarios$ = this._api.getObjects(this.model, {
      where: { regBibliotecaId: this.dataIn.id, status: 'A' },
      limit: this.pages,
      skip: this.pages * this.index,
      include: [
        {
          relation: 'carrera',
          scope: {
            include: [{ relation: 'institucion' }],
          },
        },
      ],
    });
    let count$ = this._api.count(this.model, {
      where: { regBibliotecaId: this.dataIn.id, status: 'A' },
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
            (usuario: UsBiblioteca) =>
              <any>{
                ...usuario,
                carrera:
                  usuario.carrera && usuario.carrera.nombre
                    ? usuario.carrera.nombre
                    : '',
                tipo: TIPOS[usuario.tipo],
                sexo: GENEROS[usuario.sexo],
                institucion:
                  usuario.carrera &&
                  usuario.carrera.institucion &&
                  usuario.carrera.institucion.nombre
                    ? usuario.carrera.institucion.nombre
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
}
