import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cubiculo } from '@models/cubiculo.model';
import { MODELS, PERMISOS, PERMISOSDICT } from '@models/Types';
import { Usuario } from '@models/usuario.model';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss'],
})
export class AddUsuarioComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _alerts: AlertsService,
    private _dialogRef: MatDialogRef<AddUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Usuario
  ) {}
  public PERMISOS = PERMISOS;
  private onDestroy = new Subject<any>();
  public permisos = [];
  public permisosDict = PERMISOSDICT;
  public showPassword = false;
  public loading = true;
  public form = this._fb.group({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    permisos: new FormControl([]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
    if (!(this.data && this.data.permisos.includes(PERMISOS.ADMIN)))
      this.getPermisos();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  get username() {
    return this.form.get('username').value;
  }
  get permisosUsuario() {
    return this.form.get('permisos').value;
  }
  openRequest() {
    try {
      if (!this.form.get('permisos').value.length)
        throw 'Asigne al menos 1 permiso.';
      if (this.form.invalid) throw 'Formulario inválido.';
      const usuario: Usuario = this.form.value;
      if (this.data) {
        usuario.id = this.data.id;
        this.editUsuario(usuario);
      } else {
        this.createUsuario(usuario);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createUsuario(usuario: Usuario) {
    this._api
      .createObject(usuario, MODELS.USUARIOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Usuario "${this.username}" creado.`);
        },
        () => {
          this._alerts.error(`Error al crear usuario "${this.username}".`);
        }
      );
  }
  editUsuario(usuario: Usuario) {
    this._api
      .updateObject(usuario, MODELS.USUARIOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Usuario "${this.username}" actualizado.`);
        },
        () => {
          this._alerts.error(
            `Error al actualizar el usuario "${this.username}".`
          );
        }
      );
  }
  getPermisos() {
    this._api
      .getObjects(MODELS.PERMISOS)
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (permisos: string[]) => {
          this.permisos = permisos;
        },
        () => {
          this._alerts.error(
            'Error al buscar permisos, verifiquie su conexión.'
          );
        }
      );
  }

  updatePermiso(permiso: string) {
    if (this.permisosUsuario.includes(permiso))
      this.permisosUsuario.splice(
        this.permisosUsuario.findIndex((usPer) => usPer === permiso),
        1
      );
    else this.permisosUsuario.push(permiso);
  }

  checkPermiso(permiso: string) {
    return this.permisosUsuario.includes(permiso);
  }
  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }
}
