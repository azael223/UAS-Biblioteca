import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Equipo } from '@models/equipo.model';
import { MODELS } from '@models/Types';
import { RegEquipos } from '@models/regEquipos';
import { UsEquipos } from '@models/usEquipos.model';
import { ApiService } from '@services/api.service';
import { User } from '@components/user-registry-view/user-registry-view.component';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UsuariosRegRecElecComponent } from '../components/usuarios-reg-rec-elec/usuarios-reg-rec-elec.component';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-usuarios-reg-rec-elec-view',
  templateUrl: './usuarios-reg-rec-elec-view.component.html',
  styleUrls: ['./usuarios-reg-rec-elec-view.component.scss'],
})
export class UsuariosRegRecElecViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  private model = MODELS.REG_EQUIPOS;
  private usuariosModel = MODELS.US_EQUIPOS;
  private idRegistro = 'idRegRecElec';
  public registro: RegEquipos;
  public usuarios: UsEquipos[] = [];
  public loaded = false;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _alerts: AlertsService
  ) {}

  /* REQUESTS */
  openDialog() {
    const dialogRef = this._dialog.open(UsuariosRegRecElecComponent, {
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
      include: [
        { relation: 'usEquipos', scope: { include: [{ relation: 'equipo' }] } },
      ],
    });
    registro$
      .pipe(
        takeUntil(this.onDestroy),
        finalize(() => (this.loaded = true))
      )
      .subscribe(
        (res: any[]) => {
          if (res.length) {
            this.registro = res[0];
            this.usuarios = this.registro.usEquipos;
          } else {
            this._alerts.error('No se encontro un registro activo.');
          }
        },
        (error) => {
          this._alerts.error('Verifique su conexión.');
        }
      );
  }

  updateUser(usuario: UsEquipos) {
    const updateUsuario$ = this._api.updateObject(
      <UsEquipos>{ id: usuario.id, terminadoEn: moment().toISOString() },
      this.usuariosModel
    );
    const updateEquipo$ = this._api.updateObject(
      <Equipo>{
        id: usuario.equipoId,
        statusEquipo: 'A',
      },
      MODELS.EQUIPOS
    );
    forkJoin([updateUsuario$, updateEquipo$])
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
