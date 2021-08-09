import { Component, OnInit } from '@angular/core';
import { PERMISOS } from '@models/Types';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-recursos-electronicos',
  templateUrl: './recursos-electronicos.component.html',
  styleUrls: ['./recursos-electronicos.component.scss'],
})
export class RecursosElectronicosComponent implements OnInit {
  constructor(private _auth: AuthService) {}

  equipos = this._auth.getAuth().usuario.permisos.includes(PERMISOS.EQUIPOS);
  registros = this._auth
    .getAuth()
    .usuario.permisos.includes(PERMISOS.REG_EQUIPOS);
  admin = this._auth.getAuth().usuario.permisos.includes(PERMISOS.ADMIN);

  ngOnInit(): void {}
}
