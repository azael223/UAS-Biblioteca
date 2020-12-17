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
import { MODELS } from '@models/Models';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsuarioRegCubiculo } from '@models/usuarioRegCubiculo.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { Column } from 'app/admin/components/registro-view/registro-view.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cubiculos-registro-modal',
  templateUrl: './cubiculos-registro-modal.component.html',
  styleUrls: ['./cubiculos-registro-modal.component.scss'],
})
export class CubiculosRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: BibliotecaApiService,
    private _dialogRef: MatDialogRef<CubiculosRegistroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: RegCubiculos,
    private _pagination: PaginationService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    {
      title: 'Institucion',
      matColumnDef: 'institucion',
      property: 'institucion',
    },
    {
      title: 'Cubiculo',
      matColumnDef: 'cubiculo',
      property: 'cubiculo',
    },
  ];
  public objects: UsuarioRegCubiculo[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.REG_CUBICULOS_USUARIOS;
  public instituciones: Institucion[];
  public cubiculos: Cubiculo[];

  count() {
    return this._api.count(this.model);
  }

  getInstituciones() {
    return this._api.getObjects(MODELS.INSTITUCIONES);
  }

  getCubiculos() {
    return this._api.getObjects(MODELS.CUBICULO);
  }

  getUsuarios() {
    return this._api.getObjects(this.model, {
      where: {
        idRegistroCubiculo: this.dataIn.id,
      },
      take: this.pages,
      skip: this.pages * this.index,
    });
  }
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
    this.count()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((count: any) => {
        this.totalPages = count;
        this.getUsuarios()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((objects: UsuarioRegCubiculo[]) => {
            this.getInstituciones()
              .pipe(takeUntil(this.onDestroy))
              .subscribe((instituciones: Institucion[]) => {
                this.getCubiculos()
                  .pipe(takeUntil(this.onDestroy))
                  .subscribe((scubiculos: Cubiculo[]) => {
                    this.cubiculos = scubiculos;
                    this.instituciones = instituciones;
                    this.objects = this.dataTransform(objects);
                    console.log(objects);
                    this.loaded = true;

                    if (firstLoad) {
                      this.table.renderRows();
                    }
                  });
              });
          });
      });
  }

  dataTransform(objects: UsuarioRegCubiculo[]) {
    let retObjects: any[] = [];
    objects.forEach((object) => {
      let retObject: any = { ...object };
      this.instituciones.some((inst) => {
        if (inst.id === object.idInstitucion) {
          retObject = { ...retObject, institucion: inst.nombre };
        }
      });
      this.cubiculos.some((inst) => {
        if (inst.id === object.idCubiculo) {
          retObject = { ...retObject, cubiculo: inst.nombre };
        }
      });
      retObjects.push(retObject);
    });
    return retObjects;
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
