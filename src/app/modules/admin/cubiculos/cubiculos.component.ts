import { IfStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PERMISOS } from '@models/Types';
import { AuthService } from 'app/core/services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cubiculos',
  templateUrl: './cubiculos.component.html',
  styleUrls: ['./cubiculos.component.scss'],
})
export class CubiculosComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy = new Subject<any>();

  constructor(private _auth: AuthService) {}
  cubiculos = this._auth
    .getAuth()
    .usuario.permisos.includes(PERMISOS.CUBICULOS);
  registros = this._auth
    .getAuth()
    .usuario.permisos.includes(PERMISOS.REG_CUBICULOS);
  admin = this._auth.getAuth().usuario.permisos.includes(PERMISOS.ADMIN)
  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
