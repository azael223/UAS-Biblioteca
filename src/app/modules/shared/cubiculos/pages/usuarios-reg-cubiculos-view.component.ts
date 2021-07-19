import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MODELS } from '@models/Types';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsCubiculos } from '@models/usCubiculos.model';
import { ApiService } from '@services/api.service';
import { User } from '@components/user-registry-view/user-registry-view.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UsuariosRegCubiculosComponent } from '../components/usuarios-reg-cubiculos/usuarios-reg-cubiculos.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-usuarios-reg-cubiculos-view',
  templateUrl: './usuarios-reg-cubiculos-view.component.html',
  styleUrls: ['./usuarios-reg-cubiculos-view.component.scss'],
})
export class UsuariosRegCubiculosViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  private model = MODELS.REG_CUBICULOS;
  private usuariosModel = MODELS.US_CUBICULOS;
  private idRegistro = 'idRegistroCubiculo';
  public registro: RegCubiculos;
  public usuarios: UsCubiculos[];
  public loaded = false;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService
  ) {}

  /* REQUESTS */
  openDialog() {
    const dialogRef = this._dialog.open(UsuariosRegCubiculosComponent, {
      data: this.registro,
      width: '600px',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this.loadData();
        }
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    let registros$ = this._api.getObjects(this.model, {
      order: 'creadoEn DESC',
      limit: 1,
      include: [
        {
          relation: 'usCubiculos',
          scope: { include: [{ relation: 'cubiculo' }] },
        },
      ],
    });
    registros$
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe((res: RegCubiculos[]) => {
        if (res.length) {
          this.registro = res[0];
          this.usuarios = this.registro.usCubiculos;
        } else {
          this._alerts.error('No se encontro un registro activo.');
        }
      });
  }

  updateUser(usuario: UsCubiculos) {
    this._api
      .updateObject(
        <UsCubiculos>{ id: usuario.id, terminadoEn: moment().toISOString() },
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
