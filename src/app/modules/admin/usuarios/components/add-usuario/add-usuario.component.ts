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
import { MODELS } from '@models/Types';
import { Usuario } from '@models/usuario.model';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    @Inject(MAT_DIALOG_DATA) public data?: Cubiculo
  ) {}

  private onDestroy = new Subject<any>();

  public form = this._fb.group({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    rol: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  get username() {
    return this.form.get('username').value;
  }

  openRequest() {
    if (this.form.valid) {
      const usuario: Usuario = this.form.value;
      if (this.data) {
        const editUsuario: Usuario = {
          ...this.data,
          ...usuario,
        };
        delete editUsuario.creadoEn;
        this.editCubiculo(editUsuario);
      } else {
        this.createCubiculo(usuario);
      }
    }
  }

  createCubiculo(cubiculo: Usuario) {
    this._api
      .createObject(cubiculo, MODELS.USUARIOS)
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
  editCubiculo(cubiculo: Usuario) {
    this._api
      .updateObject(cubiculo, MODELS.USUARIOS)
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

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }
}
