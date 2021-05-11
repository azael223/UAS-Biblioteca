import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Equipo } from '@models/equipo.model';
import { MODELS } from '@models/Models';
import { RegEquipos } from '@models/regEquipos';
import { UsEquipos } from '@models/usEquipos.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { User } from 'app/shared/components/user-registry-view/user-registry-view.component';
import * as moment from 'moment';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuariosRegRecElecComponent } from './usuarios-reg-rec-elec/usuarios-reg-rec-elec.component';

@Component({
  selector: 'app-usuarios-reg-rec-elec-view',
  templateUrl: './usuarios-reg-rec-elec-view.component.html',
  styleUrls: ['./usuarios-reg-rec-elec-view.component.scss'],
})
export class UsuariosRegRecElecViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  public users: User[];
  private model = MODELS.REG_EQUIPOS;
  private usuariosModel = MODELS.US_EQUIPOS;
  private idRegistro = 'idRegRecElec';
  public registro: RegEquipos;
  public usuarios: UsEquipos[];
  public loaded = false;

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

  /* REQUESTS */
  getRegistro() {
    return this._api.getObjects(this.model, {
      order: { creadoEn: 'DESC' },
      take: 1,
    });
  }

  getUsuarios(idRegistro: number) {
    return this._api.getObjects(this.usuariosModel, {
      where: { [this.idRegistro]: idRegistro },
    });
  }

  openDialog() {
    const dialogRef = this._dialog.open(UsuariosRegRecElecComponent, {
      data: this.registro,
      width: '600px',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {
        if (result) {
          this.loadUsers();
        }
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.getRegistro()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((regs: RegEquipos[]) => {
        this.registro = regs[0];
        if (this.registro) {
          this.loadUsers();
        }
      });
  }

  updateUser(user: UsEquipos) {
    const updateUser: UsEquipos = {
      id: user.id,
      terminadoEn: moment().toISOString(),
    };
    const updateUsuario = this._api.updateObject(
      updateUser,
      this.usuariosModel
    );
    const updateEquipo = this.updateEquipo({
      id: user.regEquiposId,
      status: 'A',
    });
    forkJoin([updateUsuario, updateEquipo])
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {});
  }

  updateEquipo(equipo: Equipo) {
    return this._api.updateObject(equipo, MODELS.EQUIPOS);
  }

  loadUsers() {
    this.loaded = false;
    this.getUsuarios(this.registro.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((usuarios: UsEquipos[]) => {
        this.loaded = true;
        this.usuarios = usuarios;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
