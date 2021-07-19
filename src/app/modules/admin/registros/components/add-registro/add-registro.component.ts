import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS, TURNOS } from '@models/Types';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { ApiService } from '@services/api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-add-registro',
  templateUrl: './add-registro.component.html',
  styleUrls: ['./add-registro.component.scss'],
})
export class AddRegistroComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddRegistroComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) public data?: RegBiblioteca
  ) {}
  private onDestroy = new Subject<any>();
  public turnos = TURNOS;
  public form = this._fb.group({
    ur: new FormControl('', [Validators.required, Validators.minLength(2)]),
    area: new FormControl('', [Validators.required, Validators.minLength(2)]),
    turno: new FormControl('M', [Validators.required]),
  });

  matcher = new ErrorStateMatcher();

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

  get area() {
    return this.form.get('area').value;
  }
  get ur() {
    return this.form.get('ur').value;
  }
  get turno() {
    return this.form.get('turno').value;
  }

  openRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto';
      if (this.data) {
        this.editObject({ ...this.form.value, id: this.data.id });
      } else {
        this.createObject(this.form.value);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createObject(object: RegBiblioteca) {
    this._api
      .createObject(object, MODELS.REG_BIBLIOTECA)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick();
          this._alerts.success(`Registro creado.`);
        },
        () => {
          this._alerts.error(`Error al crear registro`);
        }
      );
  }
  editObject(object: RegBiblioteca) {
    this._api
      .updateObject(object, MODELS.REG_BIBLIOTECA)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick();
          this._alerts.success(`Registro actualizado`);
        },
        () => {
          this._alerts.error(`Error al actualizar registro `);
        }
      );
  }

  onNoClick() {
    this._dialogRef.close();
  }
}
