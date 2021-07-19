import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Carrera } from '@models/carrera.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Types';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import * as moment from 'moment';
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-institucion',
  templateUrl: './add-institucion.component.html',
  styleUrls: ['./add-institucion.component.scss'],
})
export class AddInstitucionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddInstitucionComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) public data?: Institucion
  ) {}
  @ViewChild('carreraInput') carreraInput: ElementRef;
  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
  });

  public loading = true;

  public carreras: Carrera[] = [];

  public carrera = new FormControl('', []);

  public updatedCarreras: Carrera[] = [];

  public deletedCarreras: Carrera[] = [];

  private onDestroy = new Subject<any>();

  ngOnInit(): void {
    if (this.data) this.carreras = this.data.carreras || [];
    this.loading = false;
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  get nombre() {
    return this.form.get('nombre').value;
  }

  get abbrv() {
    return this.form.get('abbrv').value;
  }

  get sortedCarreras() {
    return this.carreras.sort((a, b) =>
      a.nombre > b.nombre ? 1 : a.nombre < b.nombre ? -1 : 0
    );
  }

  openRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto.';

      if (this.data) {
        this.editInstitucion({ ...this.form.value, id: this.data.id });
      } else {
        this.createInstitucion(this.form.value);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createInstitucion(institucion: Institucion) {
    let create$ = this._api.createObject(
      <Institucion>{ nombre: institucion.nombre },
      MODELS.INSTITUCIONES
    );
    create$.pipe(takeUntil(this.onDestroy)).subscribe(
      (institucion: Institucion) => {
        this._alerts.success('Institución creada con éxito.');
        let carreras$ = this.addCarreras(institucion.id);
        if (!carreras$.length) this.onNoClick();
        if (carreras$.length)
          forkJoin(carreras$)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (res) => {
                this._alerts.success('Carreras creadas con éxito.');
                this.onNoClick();
              },
              (err) => {
                this._alerts.error('Error al crear carreras.');
              }
            );
      },
      (err) => {
        this._alerts.error(
          `Error al crear la institución "${institucion.nombre}".`
        );
      }
    );
  }

  editInstitucion(institucion: Institucion) {
    let edit$ = this._api.updateObject(
      {
        id: institucion.id,
        nombre: institucion.nombre,
      },
      MODELS.INSTITUCIONES
    );
    edit$.pipe(takeUntil(this.onDestroy)).subscribe(
      (institucionE: Institucion) => {
        this._alerts.success('Institución actualizada con éxito.');
        let newCarreras$ = this.addCarreras(institucion.id);
        let updatedCarreras$ = this.updateCarreras();
        let deletedCarreras$ = this.deleteCarreras();
        let carreras$ = [
          ...newCarreras$,
          ...updatedCarreras$,
          deletedCarreras$,
        ];
        if (!carreras$.length) this.onNoClick();
        if (carreras$.length)
          forkJoin(carreras$)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(
              (res: any[]) => {
                this._alerts.success('Carreras actualizadas con éxito.');
                this.onNoClick();
              },
              (error) => {
                this._alerts.error('Error al actualizar Carreras.');
              }
            );
      },
      (error) => {
        this._alerts.error(
          `Error al editar la institución "${institucion.nombre}".`
        );
      }
    );
  }

  addCarrera() {
    if (this.carrera.value) {
      this.carreras.push({ nombre: this.carrera.value });
      this.carreraInput.nativeElement.focus();
      this.carrera.reset();
    }
  }

  addCarreras(institucionId: number) {
    return this.carreras
      .filter((carrera) => !carrera.id)
      .map((carrera) =>
        this._api.createObject(
          <Carrera>{ nombre: carrera.nombre, institucionId },
          MODELS.CARRERAS
        )
      );
  }

  updateCarrera(carrera: Carrera, index?: number) {
    if (carrera && carrera.id) {
      let indexFound = this.updatedCarreras.findIndex(
        (carreraU) => (carreraU.id = carrera.id)
      );
      if (indexFound !== -1) {
        this.updatedCarreras[indexFound] = carrera;
      } else {
        this.updatedCarreras.push(carrera);
      }
    } else {
      if (index) {
        this.carreras[index] = carrera;
      }
    }
  }

  updateCarreras() {
    return this.updatedCarreras.map((carrera) =>
      this._api.updateObject(
        <Carrera>{ id: carrera.id, nombre: carrera.nombre },
        MODELS.CARRERAS
      )
    );
  }

  deleteCarrera(carrera: Carrera) {
    let index = this.carreras.findIndex(
      (carreraF: Carrera) => carrera === carreraF
    );
    if (index !== -1) {
      this.carreras.splice(index, 1);
      if (carrera && carrera.id) {
        this.deletedCarreras.push(carrera);
      }
    }
  }

  deleteCarreras() {
    return this._api.updateObjects({ status: 'I' }, MODELS.CARRERAS, {
      id: { inq: this.deletedCarreras.map((carrera) => carrera.id) },
    });
  }

  onNoClick() {
    this._dialogRef.close();
  }
}
