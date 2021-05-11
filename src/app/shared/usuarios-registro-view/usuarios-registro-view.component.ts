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
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsuariosRegistroComponent } from './usuarios-registro/usuarios-registro.component';
import { User } from '../components/user-registry-view/user-registry-view.component';
import { MODELS } from '@models/Models';
import * as moment from 'moment';
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
  private usuariosModel = MODELS.REG_BIBLIOTECA;
  private idRegistro = 'idRegistro';
  public registro: RegBiblioteca;
  public usuarios: UsBiblioteca[];
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
    const dialogRef = this._dialog.open(UsuariosRegistroComponent, {
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
      .subscribe((regs: RegBiblioteca[]) => {
        this.registro = regs[0];
        if (this.registro) {
          this.loadUsers();
        }
      });
  }

  updateUser(user: UsBiblioteca) {
    const updateUser: UsBiblioteca = {
      id: user.id,
      terminadoEn: moment().toISOString(),
    };
    this._api
      .updateObject(updateUser, this.usuariosModel)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {
        if (data) {
        }
      });
  }

  loadUsers() {
    this.loaded = false;
    this.getUsuarios(this.registro.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((usuarios: UsBiblioteca[]) => {
        this.loaded = true;
        this.usuarios = usuarios;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
