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
export class RoutesGuard implements CanActivate {
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
    switch (this._auth.getAuth().usuario.rol) {
      case ROLES.ADMIN:
        return '/admin/biblioteca';
      case ROLES.BIBLIOTECA:
        return '/admin/biblioteca';
      case ROLES.CUBICULOS:
        return '/admin/cubiculos';
      case ROLES.RECURSOS_ELECTRONICOS:
        return '/admin/recursos-electronicos';
    }
  }
}
