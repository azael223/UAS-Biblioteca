import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS, TURNOS } from '@models/Models';
import { RegEquipos } from '@models/regEquipos';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-registro-rec-elec',
  templateUrl: './add-registro-rec-elec.component.html',
  styleUrls: ['./add-registro-rec-elec.component.scss'],
})
export class AddRegistroRecElecComponent implements OnInit {
  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddRegistroRecElecComponent>,
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
      this.form.patchValue({
        area: this.data.area,
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
  get turno() {
    return this.form.get('turno').value;
  }

  openRequest() {
    if (this.form.valid) {
      const newObject: RegEquipos = {
        area: this.area,
        turno: this.turno,
      };
      if (this.data) {
        const editObject: RegEquipos = {
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

  createObject(object: RegEquipos) {
    this._api
      .createObject(object, MODELS.REG_EQUIPOS)
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
  editObject(object: RegEquipos) {
    this._api
      .updateObject(object, MODELS.REG_EQUIPOS)
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
