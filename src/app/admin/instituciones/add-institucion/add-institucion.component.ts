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
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import * as moment from 'moment';
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-institucion',
  templateUrl: './add-institucion.component.html',
  styleUrls: ['./add-institucion.component.scss'],
})
export class AddInstitucionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddInstitucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Institucion
  ) {}
  @ViewChild('carreraInput') carreraInput: ElementRef;
  public form = this._fb.group({
    name: new FormControl('', [Validators.required]),
  });

  public loading = true;

  public carreras: Carrera[] = [];

  public carrera = new FormControl('', []);

  public updatedCarreras: Carrera[] = [];

  public deletedCarreras: Carrera[] = [];

  private onDestroy = new Subject<any>();

  ngOnInit(): void {
    this.getCarreras();
    if (this.data) {
      console.log(this.data);
      this.form.patchValue({
        name: this.data.nombre,
      });
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  get name() {
    return this.form.get('name').value;
  }

  get abbrv() {
    return this.form.get('abbrv').value;
  }

  get sortedCarreras() {
    return this.carreras.sort((a, b) =>
      a.nombre > b.nombre ? 1 : a.nombre < b.nombre ? -1 : 0
    );
  }

  getCarreras() {
    if (this.data && this.data.id) {
      this._api
        .getObjects(MODELS.CARRERAS, { idInstitucion: this.data.id })
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          (data: any) => {
            if (data) {
              this.carreras = data;
              this.loading = false;
            }
          },
          () => (this.loading = false)
        );
    } else {
      this.loading = false;
    }
  }

  openRequest() {
    if (this.form.valid) {
      const newInstitucion: Institucion = {
        nombre: this.name,
      };
      if (this.data) {
        const editInstitucion: Institucion = {
          ...this.data,
          ...newInstitucion,
          actualizadoEn: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        delete editInstitucion.creadoEn;
        this.editInstitucion(editInstitucion);
      } else {
        this.createInstitucion(newInstitucion);
      }
    }
  }

  manageCarreras() {
    let deleted = this.deleteCarreras();
    let added = this.addCarreras();
    let updated = this.updateCarreras();
    let request = [].concat(
      deleted ? deleted : [],
      added ? added : [],
      updated ? updated : []
    );
    if (request && request.length > 0) {
      forkJoin(request)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          (data) => {
            if (data) {
              this.openSnackBar(
                `Institución "${this.name} ${
                  this.data ? 'actualizada' : 'creada'
                }"`
              );
            }
            this.onNoClick();
          },
          () => {
            this.openSnackBar(
              `Error al ${this.data ? 'actualizar' : 'crear'} la institución "${
                this.name
              }"`
            );
          }
        );
    }
  }

  createInstitucion(institucion: Institucion) {
    this._api
      .createObject(institucion, MODELS.INSTITUCIONES)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (institucion: Institucion) => {
          if (institucion) {
            this.data = institucion;
            this.manageCarreras();
          }
        },
        () => {
          this.openSnackBar(`Error al crear la institución "${this.name}"`);
        }
      );
  }

  editInstitucion(institucion: Institucion) {
    this._api
      .updateObject(institucion, MODELS.INSTITUCIONES)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.manageCarreras();
          }
        },
        () => {
          this.openSnackBar(`Error al actualizar institución "${this.name}"`);
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

  addCarreras() {
    if (this.carreras && this.carreras.length > 0) {
      let adds = [];
      this.carreras.forEach((carrera) => {
        if (!(carrera && carrera.id)) {
          adds.push(
            this._api.createObject(
              { ...carrera, idInstitucion: this.data.id },
              MODELS.CARRERAS
            )
          );
        }
      });
      return adds;
    }
  }

  updateCarrera(carrera: Carrera, index?: number) {
    console.log(index);
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
    if (this.updatedCarreras && this.updatedCarreras.length > 0) {
      let updates = [];
      this.updatedCarreras.forEach((carrera) => {
        delete carrera.creadoEn;
        delete carrera.actualizadoEn;
        console.log(carrera);
        updates.push(
          this._api
            .updateObject(carrera, MODELS.CARRERAS)
            .pipe(takeUntil(this.onDestroy))
        );
      });
      return updates;
    }
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
    if (this.deletedCarreras && this.deletedCarreras.length > 0) {
      let deletes = [];
      this.deletedCarreras.forEach((carrera) => {
        deletes.push(
          this._api
            .deleteObject(MODELS.CARRERAS, carrera.id)
            .pipe(takeUntil(this.onDestroy))
        );
      });
      return deletes;
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  onNoClick() {
    this._dialogRef.close();
  }
}
