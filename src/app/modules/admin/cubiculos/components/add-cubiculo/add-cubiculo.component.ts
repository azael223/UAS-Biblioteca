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
import { Cubiculo } from '@models/cubiculo.model';
import { MODELS } from '@models/Types';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-add-cubiculo',
  templateUrl: './add-cubiculo.component.html',
  styleUrls: ['./add-cubiculo.component.scss'],
})
export class AddCubiculoComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _alerts: AlertsService,
    private _dialogRef: MatDialogRef<AddCubiculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Cubiculo
  ) {}

  private onDestroy = new Subject<any>();

  public form = this._fb.group({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
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

  get nombre() {
    return this.form.get('nombre').value;
  }

  openRequest() {
    try {
      if (this.form.invalid) throw 'Formulario incorrecto.';
      if (this.data) {
        this.editCubiculo({ ...this.form.value, id: this.data.id });
      } else {
        this.createCubiculo(this.form.value);
      }
    } catch (error) {
      this._alerts.error(error);
    }
  }

  createCubiculo(cubiculo: Cubiculo) {
    this._api
      .createObject(cubiculo, MODELS.CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Cubiculo "${this.nombre}" creado.`);
        },
        () => {
          this._alerts.error(`Error en crear cubiculo "${this.nombre}"`);
        }
      );
  }
  editCubiculo(cubiculo: Cubiculo) {
    this._api
      .updateObject(cubiculo, MODELS.CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.onNoClick(true);
          this._alerts.success(`Cubiculo "${this.nombre}" actualizado.`);
        },
        () => {
          this._alerts.error(
            `Error al actualizar el cubiculo "${this.nombre}".`
          );
        }
      );
  }

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }
}
