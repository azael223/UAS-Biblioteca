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
import { user } from '../../templates/user-registry-view/user-registry-view.component'

@Component({
  selector: 'app-usuarios-registro-view',
  templateUrl: './usuarios-registro-view.component.html',
  styleUrls: ['./usuarios-registro-view.component.scss'],
})
export class UsuariosRegistroViewComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<any>();
  public users:user[]

  constructor(private _api: BibliotecaApiService, private _dialog: MatDialog) {}

  /* REQUESTS */
  // getUsuariosRegistro() {
  //   return this._api.getObjects('RegUsuarios', { idRegistro: 1 });
  // }

  // getInstituciones() {
  //   return this._api.getObjects('Instituciones');
  // }

  openUserReg() {
    const dialogRef = this._dialog.open(UsuariosRegistroComponent, {

      data:{id:1}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result=>{

    })
  }

  ngOnInit(): void {
    this.users=[{id:123,name:"sd"}]
  }

  ngAfterViewInit() {
    // this.getUsuariosRegistro();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
