import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { PERMISOS } from '@models/Types';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
  constructor(public _auth: AuthService, public _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const auth = this._auth.getAuthWithoutNav();
    if (auth && auth.usuario) {
      let navigateRoute = this.navigate(auth.usuario.permisos);
      if (navigateRoute) this._router.navigateByUrl(navigateRoute);
      else return true;
    } else {
      return true;
    }
  }

  private navigate(permisos: string[]): string {
    if (permisos) {
      let { US_BIBLIOTECAS, US_CUBICULOS, US_EQUIPOS, ...perDic } = PERMISOS;
      let adminaccess = permisos.some((uspermiso) =>
        Object.values(perDic).some((permiso) => permiso === uspermiso)
      );
      if (adminaccess) return 'admin';
      else return 'shared';
    }
  }
}
