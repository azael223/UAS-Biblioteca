import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Equipo } from '@models/equipo.model';
import { MODELS, STATUS } from '@models/Types';
import { AlertsService } from '@services/alerts.service';
import { ApiService } from '@services/api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-equipo',
  templateUrl: './add-equipo.component.html',
  styleUrls: ['./add-equipo.component.scss'],
})
export class AddEquipoComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _fb: FormBuilder,
    private _api: ApiService,
    private _dialogRef: MatDialogRef<AddEquipoComponent>,
    private _alerts: AlertsService,
    @Inject(MAT_DIALOG_DATA) public data?: Equipo
  ) {}
  public equipoStatus = STATUS;

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    statusEquipo: new FormControl('A', [Validators.required]),
  });
  private onDestroy = new Subject<any>();

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
  get nombre() {
    return this.form.get('nombre').value;
  }
  get statusEquipo() {
    return this.form.get('statusEquipo').value;
  }

  openRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto';
      if (this.data) {
        this.editEquipo({ ...this.form.value, id: this.data.id });
      } else {
        this.createEquipo(this.form.value);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createEquipo(equipo: Equipo) {
    this._api
      .createObject(equipo, MODELS.EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Equipo "${this.nombre} creado"`);
        },
        () => {
          this._alerts.error(`Error al crear el equipo "${this.nombre}."`);
        }
      );
  }

  editEquipo(equipo: Equipo) {
    this._api
      .updateObject(equipo, MODELS.EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Equipo "${this.nombre}" actualizado.`);
        },
        () => {
          this._alerts.error(`Error al actualizar equipo "${this.nombre}."`);
        }
      );
  }

  onNoClick(result?: boolean) {
    this._dialogRef.close(result);
  }
}
