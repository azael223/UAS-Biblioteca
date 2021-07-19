import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ɵConsole,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { UsBiblioteca } from '@models/usBiblioteca.model';
import { Institucion } from '@models/institucion.model';
import { ApiService } from '@services/api.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MODELS } from '@models/Types';
import { FormLib } from 'app/core/libs/Form.lib';
import { Carrera } from '@models/carrera.model';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.scss'],
})
export class UsuariosRegistroComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegistroComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) private data: RegBiblioteca
  ) {}

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    sexo: new FormControl('M', [Validators.required]),
    tipo: new FormControl('I', [Validators.required]),
    institucion: new FormControl('', [Validators.required]),
    carrera: new FormControl('', [Validators.required]),
  });

  private onDestroy = new Subject<any>();
  private instituciones: Institucion[] = [];
  public filteredInstituciones: Observable<Institucion[]>;
  private carreras: Carrera[] = [];
  public filteredCarreras: Observable<Carrera[]>;
  private model = MODELS.US_BIBLIOTECAS;

  ngOnInit(): void {
    let instituciones$ = this._api.getObjects(MODELS.INSTITUCIONES, {
      where: { status: 'A' },
      include: [
        {
          relation: 'carreras',
          scope: { where: { status: 'A' } },
        },
      ],
    });
    instituciones$.pipe(takeUntil(this.onDestroy)).subscribe(
      (instituciones: Institucion[]) => {
        this.instituciones = instituciones;
        this.institucion.setValidators([
          this.institucionValidator(instituciones),
          Validators.required,
        ]);
        this.setValuesChanges();
        this.filterInstituciones();
        this.filterCarreras();
        this.resetCarreras()
      },
      (error) => {
        this._alerts.error('Error al buscar instituciones.');
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
    this.filteredInstituciones = this.institucion.valueChanges.pipe(
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
  performRequest() {
    try {
      FormLib.markFormGroupTouched(this.form);
      if (this.form.invalid) throw 'Formulario incorrecto.';
      let { carrera, institucion, ...obj } = this.form.value;
      const newObject: UsBiblioteca = {
        ...obj,
        regBibliotecaId: this.data.id,
        carreraId: carrera.id,
      };
      this.createUser(newObject);
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createUser(object: UsBiblioteca) {
    this._api
      .createObject(object, this.model)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success('Usuario registrado.');
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }
}
