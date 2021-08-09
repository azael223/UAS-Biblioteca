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
import { Carrera } from '@models/carrera.model';
import { Equipo } from '@models/equipo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Types';
import { RegEquipos } from '@models/regEquipos';
import { UsEquipos } from '@models/usEquipos.model';
import { ApiService } from '@services/api.service';
import { FormLib } from 'app/core/libs/Form.lib';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-usuarios-reg-rec-elec',
  templateUrl: './usuarios-reg-rec-elec.component.html',
  styleUrls: ['./usuarios-reg-rec-elec.component.scss'],
})
export class UsuariosRegRecElecComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegRecElecComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) private data: RegEquipos
  ) {}

  private onDestroy = new Subject<any>();
  private instituciones: Institucion[] = [];
  public equipos: Equipo[] = [];
  public filteredInstituciones: Observable<Institucion[]>;
  private carreras: Carrera[];
  public filteredCarreras: Observable<Carrera[]>;
  private model = MODELS.US_EQUIPOS;

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    sexo: new FormControl('M', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    institucion: new FormControl('', [Validators.required]),
    equipo: new FormControl('', [Validators.required]),
    carrera: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    let equipos$ = this._api.getObjects(MODELS.EQUIPOS, {
      where: { status: 'A', statusEquipo: 'A' },
    });
    let instituciones$ = this._api.getObjects(MODELS.INSTITUCIONES, {
      where: { status: 'A' },
      include: [
        {
          relation: 'carreras',
          scope: { where: { status: 'A' } },
        },
      ],
    });
    forkJoin([equipos$, instituciones$])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (res: any[]) => {
          this.equipos = res[0];
          this.instituciones = res[1];
          this.institucion.setValidators([
            this.institucionValidator(this.instituciones),
            Validators.required,
          ]);
          this.setValuesChanges();
          this.filterInstituciones();
          this.filterCarreras();
          this.resetCarreras();
        },
        (error) => {
          this._alerts.error('Error al buscar instituciones y equipos..');
        }
      );
  }
  setValuesChanges() {
    this.institucion.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value: Institucion) => {
        if (this.institucion.valid) this.setCarreras(value.carreras);
        else this.resetCarreras();
      });
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
  get isEquipoInvalid() {
    return this.form.get('equipo').invalid && this.form.get('equipo').touched;
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

  get equipo() {
    return this.form.get('equipo');
  }

  get isInstitucionInvalid() {
    const institucion = this.form.get('institucion');
    return institucion.invalid && institucion.touched;
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
    this.carrera.enable();
    this.carrera.setValidators([
      this.carreraValidator(carreras),
      Validators.required,
    ]);
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
  performRequest() {
    try {
      FormLib.markFormGroupTouched(this.form);
      if (this.form.invalid) throw 'Formulario incorrecto.';
      let { institucion, carrera, equipo, ...obj } = this.form.value;
      const newObject: UsEquipos = {
        ...obj,
        equipoId: this.equipo.value.id,
        regEquiposId: this.data.id,
        carreraId: this.carrera.value.id,
      };
      this.createUser(newObject);
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createUser(object: UsEquipos) {
    let updateEquipo$ = this._api.updateObject(
      { id: object.equipoId, statusEquipo: 'I' },
      MODELS.EQUIPOS
    );
    const createUser$ = this._api.createObject(object, this.model);
    forkJoin([updateEquipo$, createUser$])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this._alerts.success('Usuario registrado.');
          this.onNoClick(true);
        },
        (error) => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }
}
