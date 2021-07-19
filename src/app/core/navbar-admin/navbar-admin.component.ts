import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRoute } from '@models/handler/routes.model';
import { ROLES } from '@models/Roles.model';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss'],
})
export class NavbarAdminComponent implements OnInit {
  constructor(private _auth: AuthService, private _router: Router) {}

  public route: IRoute;

  public roles = ROLES;

  public role = this._auth.getAuth().usuario.rol
    ? this._auth.getAuth().usuario.rol
    : '';

  public routes: IRoute[] = [
    {
      path: 'biblioteca',
      title: 'Biblioteca',
      rol: [ROLES.ADMIN, ROLES.BIBLIOTECA],
      icon: 'book',
    },
    {
      path: 'cubiculos',
      title: 'Cubiculos',
      rol: [ROLES.ADMIN, ROLES.CUBICULOS],
      icon: 'inbox',
      childs: [
        {
          path: 'registros',
          title: 'Registros',
          rol: [ROLES.ADMIN, ROLES.CUBICULOS],
        },
        {
          path: 'cubiculos',
          title: 'Cubiculos',
          rol: [ROLES.ADMIN],
        },
      ],
    },
    {
      path: 'recursos-electronicos',
      title: 'Recursos Electronicos',
      rol: [ROLES.ADMIN, ROLES.RECURSOS_ELECTRONICOS],
      icon: 'computer',
      childs: [
        {
          path: 'registros',
          title: 'Registros',
          rol: [ROLES.ADMIN, ROLES.RECURSOS_ELECTRONICOS],
        },
        {
          path: 'equipos',
          title: 'Equipos',
          rol: [ROLES.ADMIN],
        },
      ],
    },
    {
      path: 'instituciones',
      title: 'Instituciones',
      rol: [ROLES.ADMIN],
      icon: 'account_balance',
    },
    {
      path: 'usuarios',
      title: 'Usuarios',
      rol: [ROLES.ADMIN],
      icon: 'group',
    },
    // {
    //   path: 'reportes',
    //   title: 'Reportes',
    //   rol: [ROLES.ADMIN],
    //   icon: 'assignment ',
    // },
    // { path: 'reportes', title: 'Reportes', rol: [ROLES.ADMIN] },
  ];
  changeRoute(route: IRoute) {
    this.route = route;
  }

  verifyRol(rols: string[]) {
    return rols.some((rol) => rol === this.role);
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
}
