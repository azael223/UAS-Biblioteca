import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Registro } from '@models/registro.model';
import { UsuarioRegistro } from '@models/usuarioRegistro.model';
import { Institucion } from '@models/institucion.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsuariosRegistroComponent } from './usuarios-registro/usuarios-registro.component';
import { user } from '../../templates/user-registry-view/user-registry-view.component';
import { MODELS } from '@models/Models';

@Component({
  selector: 'app-usuarios-registro-view',
  templateUrl: './usuarios-registro-view.component.html',
  styleUrls: ['./usuarios-registro-view.component.scss'],
})
export class UsuariosRegistroViewComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();
  public users: user[];
  private model = MODELS.REGISTROS;
  private usuariosModel = MODELS.REG_USUARIOS;
  private idRegistro = 'idRegistro';
  public registro: Registro;
  public usuarios: UsuarioRegistro[];

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

  /* REQUESTS */
  getRegistro() {
    return this._api.getObjects(this.model, {
      order: { creadoEn: 'DESC'},
      take:1
    });
  }

  getUsuarios(idRegistro: number) {
    return this._api.getObjects(this.usuariosModel, {
      where: { [this.idRegistro]: idRegistro },
    });
  }

  openUserReg() {
    const dialogRef = this._dialog.open(UsuariosRegistroComponent, {
      data: this.registro,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((result) => {});
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getRegistro()
      .pipe(takeUntil(this.onDestroy))
      .subscribe((regs: Registro[]) => {
        this.registro = regs[0];
        if (this.registro) {
          this.getUsuarios(this.registro.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((usuarios: UsuarioRegistro[]) => {
              this.usuarios = usuarios;

            });
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
