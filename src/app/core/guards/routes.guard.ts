import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { IRoute } from '@models/handler/routes.model';
import { ADMIN_ROUTES, SHARED_ROUTES } from '@models/routes.model';
import { PERMISOS } from '@models/Types';
import { AuthService } from 'app/core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutesGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const usuario = this._auth.getAuth().usuario;
    const permisos = usuario ? usuario.permisos : [];
    const dataPermisos: string[] = route.data.permisos;
    let foundedPermiso = permisos.some(
      (permiso) =>
        permiso === PERMISOS.ADMIN ||
        dataPermisos.some((dataPer) => dataPer === permiso)
    );
    if (foundedPermiso) return true;
    let routes: IRoute[] = [...ADMIN_ROUTES, ...SHARED_ROUTES];
    let adminRoute = this.getNavigate(permisos, [...ADMIN_ROUTES]);
    if (adminRoute) {
      this._router.navigateByUrl(`admin/${adminRoute}`);
      return false;
    }
    let sharedRoute = this.getNavigate(permisos, [...SHARED_ROUTES]);
    if (sharedRoute) {
      this._router.navigateByUrl(`shared/${sharedRoute}`);
      return false;
    }
    return false;
  }

  getNavigate(permisos: string[], routes: IRoute[]): string {
    let navigateRoute = '';
    routes.some((route) => {
      if (route.childs)
        return route.childs.some((child) =>
          child.rol.some((rol) =>
            permisos.some((permiso) => {
              if (permiso === rol) {
                navigateRoute = `${route.path}/${child.path}`;
                return true;
              }
            })
          )
        );
      else
        return route.rol.some((rol) =>
          permisos.some((permiso) => {
            if (permiso === rol) {
              navigateRoute = `${route.path}`;
              return true;
            }
          })
        );
    });
    return navigateRoute;
  }
}
