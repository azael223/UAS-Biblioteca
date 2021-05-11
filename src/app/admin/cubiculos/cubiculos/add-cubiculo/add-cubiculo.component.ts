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
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-add-cubiculo',
  templateUrl: './add-cubiculo.component.html',
  styleUrls: ['./add-cubiculo.component.scss'],
})
export class AddCubiculoComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddCubiculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Cubiculo
  ) {}

  private onDestroy = new Subject<any>();

  public form = this._fb.group({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        name: this.data.nombre,
      });
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  get name() {
    return this.form.get('name').value;
  }

  openRequest() {
    if (this.form.valid) {
      const cubiculo: Cubiculo = {
        nombre: this.name,
      };
      if (this.data) {
        const editCubiculo: Cubiculo = {
          ...this.data,
          ...cubiculo,
          actualizadoEn: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        delete editCubiculo.creadoEn;
        this.editCubiculo(editCubiculo);
      } else {
        this.createCubiculo(cubiculo);
      }
    }
  }

  createCubiculo(cubiculo: Cubiculo) {
    this._api
      .createObject(cubiculo, MODELS.CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick(true);
            this.openSnackBar(`Cubiculo "${this.name}" creado`);
          }
        },
        () => {
          this.openSnackBar(`Error en crear cubiculo "${this.name}"`);
        }
      );
  }
  editCubiculo(cubiculo: Cubiculo) {
    this._api
      .updateObject(cubiculo, MODELS.CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick(true);
            this.openSnackBar(`Cubiculo "${this.name}" actualizado`);
          }
        },
        () => {
          this.openSnackBar(`Error al actualizar cubiculo "${this.name}"`);
        }
      );
  }

  onNoClick(hasChanges?: boolean) {
    this._dialogRef.close(hasChanges);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
}
