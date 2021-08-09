import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoute } from '@models/handler/routes.model';
import { SHARED_ROUTES } from '@models/routes.model';
import { PERMISOS } from '@models/Types';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private _auth: AuthService, private _router: Router) {}
  public permisos = this._auth.getAuth().usuario.permisos;

  public routes = SHARED_ROUTES;

  verifyRol(permisos: string[]) {
    return permisos.some((permiso) =>
      this.permisos.some((usPermiso) => usPermiso === permiso)
    );
  }

  moreRoutes() {
    let { US_BIBLIOTECAS, US_CUBICULOS, US_EQUIPOS, ...permisos } = PERMISOS;
    return this.permisos.some((permiso) =>
      Object.keys(permisos).some((per) => per === permiso)
    );
  }

  logOut() {
    this._auth.logOut();
  }

  goToAdmin() {
    this._router.navigateByUrl('/admin');
  }

  ngOnInit(): void {}
}
