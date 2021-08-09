import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoute } from '@models/handler/routes.model';
import { ADMIN_ROUTES } from '@models/routes.model';
import { PERMISOS } from '@models/Types';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss'],
})
export class NavbarAdminComponent implements OnInit {
  constructor(private _auth: AuthService, private _router: Router) {}

  public route: IRoute;

  public permisos = this._auth.getAuth().usuario.permisos;

  public routes = ADMIN_ROUTES;

  changeRoute(route: IRoute) {
    this.route = route;
  }

  verifyRol(permisos: string[]) {
    return permisos.some((permiso) =>
      this.permisos.some((usPermiso) => usPermiso === permiso)
    );
  }
  logOut() {
    this._auth.logOut();
  }

  goToShared() {
    this._router.navigateByUrl('/shared');
  }

  ngOnInit(): void {
    this.route = this.routes[0];
    const route = this._router.url.substring(1).split('/')[1];
    this.routes.forEach((sroute: IRoute) => {
      if (sroute.path === route) {
        this.route = sroute;
      }
    });
  }

  moreRoutes() {
    let { US_BIBLIOTECAS, US_CUBICULOS, US_EQUIPOS, ADMIN, ...permisos } =
      PERMISOS;
    return this.permisos.some((permiso) =>
      Object.keys({ US_BIBLIOTECAS, US_CUBICULOS, US_EQUIPOS, ADMIN }).some(
        (per) => per === permiso
      )
    );
  }
}
