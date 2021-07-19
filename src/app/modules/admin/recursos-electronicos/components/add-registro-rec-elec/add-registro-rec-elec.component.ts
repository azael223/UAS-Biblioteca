import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS, TURNOS } from '@models/Types';
import { RegEquipos } from '@models/regEquipos';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-add-registro-rec-elec',
  templateUrl: './add-registro-rec-elec.component.html',
  styleUrls: ['./add-registro-rec-elec.component.scss'],
})
export class AddRegistroRecElecComponent implements OnInit {
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddRegistroRecElecComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) public data?: RegEquipos
  ) {}
  private onDestroy = new Subject<any>();
  public turnos = TURNOS;
  public form = this._fb.group({
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
  get turno() {
    return this.form.get('turno').value;
  }

  openRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto.';
      if (this.data) {
        this.editObject({ ...this.form.value, id: this.data.id });
      } else {
        this.createObject(this.form.value);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createObject(object: RegEquipos) {
    this._api
      .createObject(object, MODELS.REG_EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick();
          this._alerts.success(`Registro creado.`);
        },
        () => {
          this._alerts.error(`Error en crear registro.`);
        }
      );
  }
  editObject(object: RegEquipos) {
    this._api
      .updateObject(object, MODELS.REG_EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick();
          this._alerts.success(`Registro actualizado.`);
        },
        () => {
          this._alerts.error(`Error al actualizar registro.`);
        }
      );
  }

  onNoClick() {
    this._dialogRef.close();
  }
}
