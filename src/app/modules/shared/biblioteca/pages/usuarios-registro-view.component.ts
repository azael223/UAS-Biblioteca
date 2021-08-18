import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { UsBiblioteca } from '@models/usBiblioteca.model';
import { Institucion } from '@models/institucion.model';
import { ApiService } from '@services/api.service';
import { forkJoin, interval, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsuariosRegistroComponent } from '../components/usuarios-registro/usuarios-registro.component';
import { User } from '@components/user-registry-view/user-registry-view.component';
import { MODELS } from '@models/Types';
import * as moment from 'moment';
import { AlertsService } from '@services/alerts.service';
@Component({
  selector: 'app-usuarios-registro-view',
  templateUrl: './usuarios-registro-view.component.html',
  styleUrls: ['./usuarios-registro-view.component.scss'],
})
export class UsuariosRegistroViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  public users: User[];
  private model = MODELS.REG_BIBLIOTECA;
  private usuariosModel = MODELS.US_BIBLIOTECAS;
  public registro: RegBiblioteca;
  public usuarios: UsBiblioteca[];
  public loaded = false;
  public interval = 5;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService
  ) {}

  /* REQUESTS */
  openDialog() {
    const dialogRef = this._dialog.open(UsuariosRegistroComponent, {
      data: this.registro,
      width: '600px',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) this.loadData();
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadData();
    interval(this.interval * 60 * 1000)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.loadData();
      });
  }

  get error() {
    if (!this.registro) return 'No se encontró un registro activo.';
    if (
      !this.usuarios ||
      !this.usuarios ||
      (this.usuarios && this.usuarios.length <= 0)
    )
      return 'No hay usuarios registrados.';
  }

  loadData() {
    this.registro = null;
    this.usuarios = [];
    let registro$ = this._api.getObjects(this.model, {
      where: { status: 'A', regStatus: 'A' },
      order: 'creadoEn DESC',
      limit: 1,
      include: ['usBibliotecas'],
    });
    registro$
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: RegBiblioteca[]) => {
          if (res.length) {
            this.registro = res[0];
            this.usuarios = this.registro.usBibliotecas;
          } else {
            this._alerts.warning('No se encontro un registro activo.');
          }
        },
        () => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  updateUser(usuario: UsBiblioteca) {
    this._api
      .updateObject(
        <UsBiblioteca>{ id: usuario.id, terminadoEn: moment().toISOString() },
        this.usuariosModel
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data) => {
          this._alerts.success(`${usuario.nombre} terminado.`);
        },
        (error) => {
          this._alerts.error('No se pudo terminar su registro.');
        }
      );
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
