import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cubiculo } from '@models/cubiculo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Types';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsCubiculos } from '@models/usCubiculos.model';
import { ApiService } from '@services/api.service';
import { FormLib } from 'app/core/libs/Form.lib';
import { forkJoin, Observable, Subject } from 'rxjs';
import { finalize, map, startWith, takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';
import { Carrera } from '@models/carrera.model';

@Component({
  selector: 'app-usuarios-reg-cubiculos',
  templateUrl: './usuarios-reg-cubiculos.component.html',
  styleUrls: ['./usuarios-reg-cubiculos.component.scss'],
})
export class UsuariosRegCubiculosComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  private instituciones: Institucion[] = [];
  public cubiculos: Cubiculo[];
  public filteredInstituciones: Observable<Institucion[]>;
  private carreras: Carrera[] = [];
  public filteredCarreras: Observable<Carrera[]>;
  private model = MODELS.US_CUBICULOS;

  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegCubiculosComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) private data: RegCubiculos
  ) {}

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    institucion: new FormControl('', [Validators.required]),
    carrera: new FormControl('', [Validators.required]),
    cubiculo: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    let cubiculos$ = this._api.getObjects(MODELS.CUBICULOS, {
      where: { status: 'A' },
    });
    let instituciones$ = this._api.getObjects(MODELS.INSTITUCIONES, {
      where: { stauts: 'A' },
      include: [
        {
          relation: 'carreras',
          scope: {
            where: { status: 'A' },
          },
        },
      ],
    });
    forkJoin([cubiculos$, instituciones$])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (res: any[]) => {
          this.cubiculos = res[0];
          this.instituciones = res[1];
          this.institucion.setValidators(this.institucionValidator(res[1]));
          this.setValuesChanges();
          this.filterInstituciones();
          this.filterCarreras();
          this.resetCarreras();
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
  /*GETERS*/
  get isNameInvalid() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }
  get isCubiculoInvalid() {
    return (
      this.form.get('cubiculo').invalid && this.form.get('cubiculo').touched
    );
  }

  get isInstitucionInvalid() {
    const institucion = this.form.get('institucion');
    return institucion.invalid && institucion.touched;
  }

  get isCarreraInvalid() {
    const carrera = this.form.get('carrera');
    return carrera.invalid && carrera.touched;
  }

  get carrera() {
    return this.form.get('carrera');
  }

  get institucion() {
    return this.form.get('institucion');
  }

  setValuesChanges() {
    this.institucion.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value: Institucion) => {
        if (this.institucion.valid) this.setCarreras(value.carreras);
        else this.resetCarreras();
      });
  }

  institucionValidator(instituciones: Institucion[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validOption = instituciones
        ? this.instituciones.some(
            (finstitucion: Institucion) =>
              control.value.nombre === finstitucion.nombre
          )
        : false;
      return !validOption ? { institucionInvalid: true } : null;
    };
  }

  carreraValidator(carreras: Carrera[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validOption = carreras
        ? this.carreras.some(
            (fcarrera: Carrera) => control.value.nombre === fcarrera.nombre
          )
        : false;
      return !validOption ? { carreraInvalid: true } : null;
    };
  }

  /* REQUESTS */
  resetCarreras() {
    this.carrera.setValidators([Validators.required]);
    this.carrera.setValue('');
    this.carrera.disable();
    this.carreras = [];
  }

  setCarreras(carreras) {
    this.carreras = carreras;
    this.carrera.setValidators([
      this.carreraValidator(carreras),
      Validators.required,
    ]);
    this.carrera.enable();
  }
  /* INSTITUCIONES FILTER */
  filterInstituciones() {
    this.filteredInstituciones = this.form.get('institucion').valueChanges.pipe(
      startWith(''),
      map((institucion: Institucion) => institucion.nombre),
      map((nombre: string) =>
        nombre ? this._filter(nombre) : this.instituciones.slice()
      )
    );
  }
  displayFn(institucion: Institucion) {
    return institucion && institucion.nombre ? institucion.nombre : undefined;
  }
  _filter(nombre: string) {
    const filterValue = nombre.toLowerCase();
    return this.instituciones.filter((institucion: Institucion) =>
      institucion.nombre.toLowerCase().includes(filterValue)
    );
  }
  /* CARRERAS FILTER */
  filterCarreras() {
    this.filteredCarreras = this.carrera.valueChanges.pipe(
      startWith(''),
      map((carrera: Carrera) => carrera.nombre),
      map((nombre: string) =>
        nombre ? this._filterCarrera(nombre) : this.carreras.slice()
      )
    );
  }
  displayCarrera(carrera: Carrera) {
    return carrera && carrera.nombre ? carrera.nombre : undefined;
  }
  _filterCarrera(nombre: string) {
    const filterValue = nombre.toLowerCase();
    return this.carreras.filter((carrera: Carrera) =>
      carrera.nombre.toLowerCase().includes(filterValue)
    );
  }

  /* */
  /* */
  performRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto.';
      FormLib.markFormGroupTouched(this.form);
      const newObject: UsCubiculos = {
        cubiculoId: this.form.get('cubiculo').value,
        regCubiculosId: this.data.id,
        carreraId: this.form.get('carrera').value.id,
        nombre: this.form.get('nombre').value,
      };
      this.createUser(newObject);
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createUser(object: UsCubiculos) {
    this._api
      .createObject(object, this.model)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  onNoClick(result?: boolean) {
    this._dialogRef.close(result);
  }
}
