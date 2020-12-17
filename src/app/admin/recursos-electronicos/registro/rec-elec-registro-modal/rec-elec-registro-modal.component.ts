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
import { EquipoComputo } from '@models/equipoComputo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { RegRecElec } from '@models/regRecElec.model';
import { UsuarioRegRecElec } from '@models/usuarioRegRecElec.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { PaginationService } from '@services/pagination.service';
import { Column } from 'app/admin/components/registro-view/registro-view.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-rec-elec-registro-modal',
  templateUrl: './rec-elec-registro-modal.component.html',
  styleUrls: ['./rec-elec-registro-modal.component.scss'],
})
export class RecElecRegistroModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: BibliotecaApiService,
    private _dialogRef: MatDialogRef<RecElecRegistroModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataIn: RegRecElec,
    private _pagination: PaginationService
  ) {}
  @ViewChild('table') table: MatTable<any>;

  public displayedUser: Column[] = [
    { title: 'Nombre', matColumnDef: 'nombre', property: 'nombre' },
    { title: 'Genero', matColumnDef: 'genero', property: 'sexo' },
    { title: 'Email', matColumnDef: 'email', property: 'email' },
    {
      title: 'Institucion',
      matColumnDef: 'institucion',
      property: 'institucion',
    },
    {
      title: 'Equipo Computo',
      matColumnDef: 'equipo',
      property: 'equipo',
    },
  ];
  public objects: UsuarioRegRecElec[];
  private onDestroy = new Subject<any>();
  public loaded = false;
  public index = 0;
  public pages = this._pagination.pagination;
  public totalPages = 0;
  public PAGES = this._pagination.PAGES;
  public model = MODELS.REG_REC_ELEC_USUARIOS;
  public instituciones: Institucion[];
  public equipos: EquipoComputo[];

  count() {
    return this._api.count(this.model);
  }

  getInstituciones() {
    return this._api.getObjects(MODELS.INSTITUCIONES);
  }

  getEquipos() {
    return this._api.getObjects(MODELS.EQUIPOS_COMPUTO);
  }

  getUsuarios() {
    return this._api.getObjects(this.model, {
      where: {
        idRegRecElec: this.dataIn.id,
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
          .subscribe((objects: UsuarioRegRecElec[]) => {
            this.getInstituciones()
              .pipe(takeUntil(this.onDestroy))
              .subscribe((instituciones: Institucion[]) => {
                this.getEquipos()
                  .pipe(takeUntil(this.onDestroy))
                  .subscribe((sequipos: EquipoComputo[]) => {
                    this.equipos = sequipos;
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

  dataTransform(objects: UsuarioRegRecElec[]) {
    let retObjects: any[] = [];
    objects.forEach((object) => {
      let retObject: any = { ...object };
      this.instituciones.some((inst) => {
        if (inst.id === object.idInstitucion) {
          retObject = { ...retObject, institucion: inst.nombre };
        }
      });
      this.equipos.some((inst) => {
        if (inst.id === object.idEquipoComputo) {
          retObject = { ...retObject, equipo: inst.nombre };
        }
      });
      if (object.sexo === 'M') {
        retObject = { ...retObject, sexo: 'Masculino' };
      } else if (object.sexo === 'F') {
        retObject = { ...retObject, sexo: 'Femenino' };
      }
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
