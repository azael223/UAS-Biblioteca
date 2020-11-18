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
import { Institucion } from '@models/institucion.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-institucion',
  templateUrl: './add-institucion.component.html',
  styleUrls: ['./add-institucion.component.scss'],
})
export class AddInstitucionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public form = this._fb.group({
    name: new FormControl('', [Validators.required]),
    abbrv: new FormControl('', []),
  });
  private onDestroy = new Subject<any>();

  constructor(
    private _api: BibliotecaApiService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddInstitucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Institucion
  ) {}

  get name() {
    return this.form.get('name').value;
  }

  get abbrv() {
    return this.form.get('abbrv').value;
  }

  openRequest() {
    if (this.form.valid) {
      const newInstitucion: Institucion = {
        nombre: this.name,
        abrev: this.abbrv,
      };
      if (this.data) {
        const editInstitucion:Institucion = {
          ...this.data,
          ...newInstitucion,
          actualizadoEn:moment().format('YYYY-MM-DD HH:mm:ss')
        }
        delete editInstitucion.creadoEn
        this.editInstitucion(editInstitucion);
      } else {
        this.createInstitucion(newInstitucion);
      }
    }
  }

  createInstitucion(institucion: Institucion) {
    this._api
      .createObject(institucion, MODELS.INSTITUCIONES)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          if (data) {
            this.openSnackBar(`Institución "${this.name} creada"`);
            this.onNoClick();
          }
        },
        () => {
          this.openSnackBar(`Error al crear la institución "${this.name}"`);
        }
      );
  }

editInstitucion(institucion:Institucion){
  this._api
  .updateObject(institucion, MODELS.INSTITUCIONES)
  .pipe(takeUntil(this.onDestroy))
  .subscribe((data) => {
    if (data) {
      this.onNoClick()
      this.openSnackBar(`Institución "${this.name}" actualizada`);
    }
  },()=>{
    this.openSnackBar(`Error al actualizar institución "${this.name}"`)
  });
}

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  onNoClick() {
    this._dialogRef.close();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if(this.data){
      console.log(this.data)
      this.form.patchValue({
        name:this.data.nombre,
        abbrv:this.data.abrev
      })
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
