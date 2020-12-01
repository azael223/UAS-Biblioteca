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
import { Registro } from '@models/registro.model';
import { UsuarioRegistro } from '@models/usuarioRegistro.model';
import { Institucion } from '@models/institucion.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MODELS } from '@models/Models';
import { FormLib } from 'app/libs/Form.lib';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.scss'],
})
export class UsuariosRegistroComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();
  private instituciones: Institucion[];
  public filteredInstituciones: Observable<Institucion[]>;
  private model = MODELS.REG_USUARIOS;

  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Registro
  ) {}

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    sexo: new FormControl('M', [Validators.required]),
    tipo: new FormControl('I', [Validators.required]),
    institucion: new FormControl('', [Validators.required]),
  });

  /*GETERS*/
  get isNameInvalid() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
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
      const newObject: UsuarioRegistro = {
        idInstitucion: (<Institucion>this.form.get('institucion').value).id,
        idRegistro: this.data.id,
        nombre: this.form.get('nombre').value,
        sexo: this.form.get('sexo').value,
        tipo: this.form.get('tipo').value,
      };
      this.createUser(newObject);
    }
  }

  createUser(object: UsuarioRegistro) {
    this._api
      .createObject(object, this.model)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            console.log(object)
            console.log(data)
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
    this.getInstituciones()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((instituciones: Institucion[]) => {
        this.instituciones = instituciones;
        console.log(this.data)
        this.form
          .get('institucion')
          .setValidators(this.institucionValidator(instituciones));
        this.filterInstituciones();
      });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
