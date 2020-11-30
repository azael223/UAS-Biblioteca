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
import { EquipoComputo } from '@models/equipoComputo.model';
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { RegRecElec } from '@models/regRecElec.model';
import { UsuarioRegRecElec } from '@models/usuarioRegRecElec.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-reg-rec-elec',
  templateUrl: './usuarios-reg-rec-elec.component.html',
  styleUrls: ['./usuarios-reg-rec-elec.component.scss'],
})
export class UsuariosRegRecElecComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();
  private instituciones: Institucion[];
  public equipos: EquipoComputo[];
  public filteredInstituciones: Observable<Institucion[]>;
  private model = MODELS.REG_REC_ELEC_USUARIOS;

  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UsuariosRegRecElecComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RegRecElec
  ) {}

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required]),
    sexo: new FormControl('M', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    institucion: new FormControl('', [Validators.required]),
    equipo: new FormControl('', [Validators.required]),
  });

  /*GETERS*/
  get isNameInvalid() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }
  get isEquipoInvalid() {
    return this.form.get('equipo').invalid && this.form.get('equipo').touched;
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
  getEquipos() {
    return this._api.getObjects(MODELS.EQUIPOS_COMPUTO);
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
    this.markFormGroupTouched(this.form);
    if (this.form.valid) {
      const newObject: UsuarioRegRecElec = {
        idInstitucion: (<Institucion>this.form.get('institucion').value).id,
        email: this.form.get('email').value,
        idEquipoComputo: this.form.get('equipo').value,
        idRegRecElec: this.data.id,
        nombre: this.form.get('nombre').value,
        sexo: this.form.get('sexo').value,
      };
      this.createUser(newObject);
    }
  }

  createUser(object: UsuarioRegRecElec) {
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
    this.getEquipos()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((equipos: EquipoComputo[]) => {
        this.equipos = equipos;
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
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
