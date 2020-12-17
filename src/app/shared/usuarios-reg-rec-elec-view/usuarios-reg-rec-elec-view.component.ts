import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MODELS } from '@models/Models';
import { RegRecElec } from '@models/regRecElec.model';
import { UsuarioRegRecElec } from '@models/usuarioRegRecElec.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { User } from 'app/shared/components/user-registry-view/user-registry-view.component';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuariosRegRecElecComponent } from './usuarios-reg-rec-elec/usuarios-reg-rec-elec.component';

@Component({
  selector: 'app-usuarios-reg-rec-elec-view',
  templateUrl: './usuarios-reg-rec-elec-view.component.html',
  styleUrls: ['./usuarios-reg-rec-elec-view.component.scss'],
})
export class UsuariosRegRecElecViewComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();
  public users: User[];
  private model = MODELS.REG_REC_ELEC;
  private usuariosModel = MODELS.REG_REC_ELEC_USUARIOS;
  private idRegistro = 'idRegRecElec';
  public registro: RegRecElec;
  public usuarios: UsuarioRegRecElec[];
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
    });
    +dialogRef
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
      .subscribe((regs: RegRecElec[]) => {
        console.log(regs);
        this.registro = regs[0];
        if (this.registro) {
          this.loadUsers();
        }
      });
  }

  updateUser(user: UsuarioRegRecElec) {
    const updateUser: UsuarioRegRecElec = {
      id: user.id,
      terminadoEn: moment().format('YYYY-MM-DD HH:mm:ss'),
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
      .subscribe((usuarios: UsuarioRegRecElec[]) => {
        this.loaded = true;
        console.log(usuarios)
        this.usuarios = usuarios;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
