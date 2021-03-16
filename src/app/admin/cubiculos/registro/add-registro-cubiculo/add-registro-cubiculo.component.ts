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
import { MODELS } from '@models/Models';
import { RegCubiculos } from '@models/regCubiculos.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-registro-cubiculo',
  templateUrl: './add-registro-cubiculo.component.html',
  styleUrls: ['./add-registro-cubiculo.component.scss'],
})
export class AddRegistroCubiculoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();

  public form = this._fb.group({
    biblioteca: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    ur: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddRegistroCubiculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: RegCubiculos
  ) {}

  get biblioteca() {
    return this.form.get('biblioteca').value;
  }
  get ur() {
    return this.form.get('ur').value;
  }

  openRequest() {
    if (this.form.valid) {
      const newObject: RegCubiculos = {
        biblioteca: this.biblioteca,
        ur: this.ur,
      };
      if (this.data) {
        const editObject: RegCubiculos = {
          ...this.data,
          ...newObject,
          actualizadoEn: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        delete editObject.creadoEn;
        this.editObject(editObject);
      } else {
        this.createObject(newObject);
      }
    }
  }

  createObject(object: RegCubiculos) {
    this._api
      .createObject(object, MODELS.REG_CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick();
            this.openSnackBar(`Registro creado`);
          }
        },
        () => {
          this.openSnackBar(`Error en crear registro`);
        }
      );
  }
  editObject(object: RegCubiculos) {
    this._api
      .updateObject(object, MODELS.REG_CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick();
            this.openSnackBar(`Registro actualizado`);
          }
        },
        () => {
          this.openSnackBar(`Error al actualizar registro `);
        }
      );
  }

  onNoClick() {
    this._dialogRef.close();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue({
        biblioteca:this.data.biblioteca,
        ur:this.data.ur
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
