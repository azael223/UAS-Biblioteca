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
    @Inject(MAT_DIALOG_DATA) data?: Institucion
  ) {}

  get name() {
    return this.form.get('name').value;
  }

  get abbrv() {
    return this.form.get('abbrv').value;
  }

  openRequest(request: string) {
    if (this.form.valid) {
      const newInstitucion: Institucion = {
        nombre: this.name,
        abrev: this.abbrv,
      };
      if (request.toUpperCase() === 'CREATE') {
        this.createInstitucion(newInstitucion);
      } else if (request.toUpperCase() === 'EDIT') {
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
            this.openSnackBar(`Institucion "${this.name} creada"`);
            this.onNoClick();
          }
        },
        () => {
          this.openSnackBar(`Error al crear la institucion "${this.name}"`);
        }
      );
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

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
