import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MODELS } from '@models/Models';
import { RegCubiculos } from '@models/regCubiculos.model';
import { UsCubiculos } from '@models/usCubiculos.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { User } from 'app/shared/components/user-registry-view/user-registry-view.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuariosRegCubiculosComponent } from './usuarios-reg-cubiculos/usuarios-reg-cubiculos.component';

@Component({
  selector: 'app-usuarios-reg-cubiculos-view',
  templateUrl: './usuarios-reg-cubiculos-view.component.html',
  styleUrls: ['./usuarios-reg-cubiculos-view.component.scss'],
})
export class UsuariosRegCubiculosViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onDestroy = new Subject<any>();
  public users: User[];
  private model = MODELS.REG_CUBICULOS;
  private usuariosModel = MODELS.US_CUBICULOS;
  private idRegistro = 'idRegistroCubiculo';
  public registro: RegCubiculos;
  public usuarios: UsCubiculos[];
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
    const dialogRef = this._dialog.open(UsuariosRegCubiculosComponent, {
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
      .subscribe((regs: RegCubiculos[]) => {
        console.log(regs);
        this.registro = regs[0];
        if (this.registro) {
          this.loadUsers();
        }
      });
  }

  updateUser(user: UsCubiculos) {
    const updateUser: UsCubiculos = {
      id: user.id,
      terminadoEn: moment().toISOString(),
    };
    console.log(updateUser);
    this._api
      .updateObject(updateUser, this.usuariosModel)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {
        if (data) {
          console.log(data);
        }
      });
  }

  loadUsers() {
    this.loaded = false;
    this.getUsuarios(this.registro.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((usuarios: UsCubiculos[]) => {
        this.loaded = true;
        console.log(usuarios);
        this.usuarios = usuarios;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
