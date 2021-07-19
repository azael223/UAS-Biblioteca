import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { ROLES } from '@models/Roles.model';
import { AuthService } from 'app/core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainRoutesGuard implements CanActivate {
  constructor(private _auth: AuthService, private _route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this._route.navigateByUrl(this.redirect());
    console.log(this.redirect());
    return true;
  }
  redirect() {
    const rol = this._auth.getAuth().usuario.rol;
    console.log(rol);
    if (
      rol === ROLES.ADMIN ||
      rol === ROLES.BIBLIOTECA ||
      rol === ROLES.CUBICULOS ||
      rol === ROLES.RECURSOS_ELECTRONICOS
    ) {
      return '/admin';
    } else if (
      rol === ROLES.RECURSOS_ELECTRONICOS_USUARIOS ||
      rol === ROLES.CUBICULOS_USUARIOS ||
      rol === ROLES.BIBLIOTECA_USUARIOS
    ) {
      return '/shared';
    } else {
      return '/login';
    }
  }
}
