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
import { EquipoComputo, STATUS_EQUIPO } from '@models/equipoComputo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-equipo',
  templateUrl: './add-equipo.component.html',
  styleUrls: ['./add-equipo.component.scss'],
})
export class AddEquipoComponent implements OnInit, AfterViewInit, OnDestroy {
  public equipoStatus = STATUS_EQUIPO;

  public form = this._fb.group({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    status: new FormControl('A', [Validators.required]),
  });
  private onDestroy = new Subject<any>();

  constructor(
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _api: BibliotecaApiService,
    private _dialogRef: MatDialogRef<AddEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) private data?: EquipoComputo
  ) {}

  get name() {
    return this.form.get('name').value;
  }
  get status() {
    return this.form.get('status').value;
  }

  openRequest() {
    if (this.form.valid) {
      const newEquipo: EquipoComputo = {
        nombre: this.name,
        status: this.status,
      };
      if (this.data) {
        const editEquipo:EquipoComputo = {
          ...this.data,
          ...newEquipo,
          actualizadoEn:moment().format('YYYY-MM-DD HH:mm:ss')
        }
        delete editEquipo.creadoEn
        this.editEquipo(editEquipo);
      } else {
        this.createEquipo(newEquipo);
      }
    }
  }

  createEquipo(equipo: EquipoComputo) {
    this._api
      .createObject(equipo, MODELS.EQUIPOS_COMPUTO)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.openSnackBar(`Equipo "${this.name} creado"`);
            this.onNoClick();
          }
        },
        () => {
          this.openSnackBar(`Error al crear el equipo "${this.name}"`);
        }
      );
  }

editEquipo(equipo:EquipoComputo){
  this._api
  .updateObject(equipo, MODELS.EQUIPOS_COMPUTO)
  .pipe(takeUntil(this.onDestroy))
  .subscribe((data) => {
    if (data) {
      this.onNoClick()
      this.openSnackBar(`Equipo "${this.name}" actualizado`);
    }
  },()=>{
    this.openSnackBar(`Error al actualizar equipo "${this.name}"`)
  });
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
        name: this.data.nombre,
        status: this.data.status,
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}