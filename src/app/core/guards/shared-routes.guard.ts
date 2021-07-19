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
export class SharedRoutesGuard implements CanActivate {
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
    if (
      rol === ROLES.ADMIN ||
      rol === ROLES.BIBLIOTECA ||
      rol === ROLES.BIBLIOTECA_USUARIOS
    ) {
      return '/shared/biblioteca';
    } else if (rol === ROLES.CUBICULOS || rol === ROLES.CUBICULOS_USUARIOS) {
      return '/shared/cubiculos';
    } else if (
      rol === ROLES.RECURSOS_ELECTRONICOS ||
      rol === ROLES.RECURSOS_ELECTRONICOS_USUARIOS
    ) {
      return '/shared/recursos-electronicos';
    } else {
      return '/login';
    }
  }
}
