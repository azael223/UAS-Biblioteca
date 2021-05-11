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
import { MODELS } from '@models/Models';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsCubiculos } from '@models/usCubiculos.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { FormLib } from 'app/libs/Form.lib';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-reg-cubiculos',
  templateUrl: './usuarios-reg-cubiculos.component.html',
  styleUrls: ['./usuarios-reg-cubiculos.component.scss'],
})
export class UsuariosRegCubiculosComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  private instituciones: Institucion[];
  public cubiculos: Cubiculo[];
  public filteredInstituciones: Observable<Institucion[]>;
  private model = MODELS.US_CUBICULOS;

  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegCubiculosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RegCubiculos
  ) {}

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    institucion: new FormControl('', [Validators.required]),
    cubiculo: new FormControl('', [Validators.required]),
  });

  /*GETERS*/
  get isNameInvalid() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }
  get isCubiculoInvalid() {
    return (
      this.form.get('cubiculo').invalid && this.form.get('cubiculo').touched
    );
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

  get isInstitucionInvalid() {
    const institucion = this.form.get('institucion');
    return institucion.invalid && institucion.touched;
  }

  /* REQUESTS */
  getInstituciones() {
    return this._api.getObjects(MODELS.INSTITUCIONES);
  }
  getCubiculos() {
    return this._api.getObjects(MODELS.CUBICULOS);
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

  /* */
  performRequest() {
    FormLib.markFormGroupTouched(this.form);
    if (this.form.valid) {
      const newObject: UsCubiculos = {
        cubiculoId: this.form.get('cubiculo').value,
        regCubiculosId: this.data.id,
        nombre: this.form.get('nombre').value,
      };
      this.createUser(newObject);
    }
  }

  createUser(object: UsCubiculos) {
    this._api
      .createObject(object, this.model)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            console.log(object);
            console.log(data);
            this.onNoClick(true);
          }
        },
        () => {}
      );
  }

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }

  ngOnInit(): void {
    this.getCubiculos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((cubiculos: Cubiculo[]) => {
        this.cubiculos = cubiculos;
        this.getInstituciones()
          .pipe(takeUntil(this.onDestroy))
          .subscribe((instituciones: Institucion[]) => {
            this.instituciones = instituciones;
            this.form
              .get('institucion')
              .setValidators(this.institucionValidator(instituciones));
            this.filterInstituciones();
          });
      });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
