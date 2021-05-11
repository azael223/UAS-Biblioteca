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
import { MODELS, TURNOS } from '@models/Models';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-registro',
  templateUrl: './add-registro.component.html',
  styleUrls: ['./add-registro.component.scss'],
})
export class AddRegistroComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddRegistroComponent>,
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
      this.form.patchValue({
        area: this.data.area,
        ur: this.data.ur,
        turno: this.data.turno,
      });
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
    if (this.form.valid) {
      const newObject: RegBiblioteca = {
        area: this.area,
        ur: this.ur,
        turno: this.turno,
      };
      if (this.data) {
        const editObject: RegBiblioteca = {
          ...this.data,
          ...newObject,
        };
        delete editObject.creadoEn;
        this.editObject(editObject);
      } else {
        this.createObject(newObject);
      }
    }
  }

  createObject(object: RegBiblioteca) {
    this._api
      .createObject(object, MODELS.REG_BIBLIOTECA)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick();
            this.openSnackBar(`RegBiblioteca creado`);
          }
        },
        () => {
          this.openSnackBar(`Error en crear registro`);
        }
      );
  }
  editObject(object: RegBiblioteca) {
    this._api
      .updateObject(object, MODELS.REG_BIBLIOTECA)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.onNoClick();
            this.openSnackBar(`RegBiblioteca actualizado`);
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
}
