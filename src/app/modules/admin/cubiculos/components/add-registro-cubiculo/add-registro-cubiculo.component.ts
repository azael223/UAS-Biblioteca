import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MODELS } from '@models/Types';
import { RegCubiculos } from '@models/regCubiculos.model';
import { ApiService } from '@services/api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-add-registro-cubiculo',
  templateUrl: './add-registro-cubiculo.component.html',
  styleUrls: ['./add-registro-cubiculo.component.scss'],
})
export class AddRegistroCubiculoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _api: ApiService,
    private _fb: FormBuilder,
    private _alerts: AlertsService,
    private _dialogRef: MatDialogRef<AddRegistroCubiculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: RegCubiculos
  ) {}
  private onDestroy = new Subject<any>();

  public form = this._fb.group({
    biblioteca: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    ur: new FormControl('', [Validators.required, Validators.minLength(2)]),
    regStatus: new FormControl('A', [Validators.required]),
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
  get biblioteca() {
    return this.form.get('biblioteca').value;
  }
  get ur() {
    return this.form.get('ur').value;
  }
  get status() {
    return this.form.get('regStatus').value;
  }

  changeStatus() {
    if (this.status === 'A') this.form.get('regStatus').setValue('I');
    else this.form.get('regStatus').setValue('A');
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

  updateStatus(id: number) {
    if (this.status === 'A')
      this._api
        .updateObjects({ regStatus: 'I' }, MODELS.REG_CUBICULOS, {
          id: { neq: id },
        })
        .pipe(
          takeUntil(this.onDestroy),
          finalize(() => this.onNoClick(true))
        )
        .subscribe(
          (data) => {},
          () => {
            this._alerts.warning(`No se pudo activar el registro.`);
          }
        );
    else this.onNoClick(true);
  }

  createObject(object: RegCubiculos) {
    this._api
      .createObject(object, MODELS.REG_CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data: any) => {
          this.updateStatus(data.id);
          this._alerts.success(`Registro creado.`);
        },
        () => {
          this._alerts.error(`Error al crear registro.`);
        }
      );
  }
  editObject(object: RegCubiculos) {
    this._api
      .updateObject(object, MODELS.REG_CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this.updateStatus(this.data.id);
          this._alerts.success(`Registro actualizado.`);
        },
        () => {
          this._alerts.error(`Error al actualizar registro.`);
        }
      );
  }

  onNoClick(result?: boolean) {
    this._dialogRef.close(result);
  }
}
