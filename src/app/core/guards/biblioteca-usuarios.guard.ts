import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ROLES } from '@models/Roles.model';
import { AuthService } from 'app/core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaUsuariosGuard implements CanActivate {
  constructor(private _auth: AuthService, private _loc: Location) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this._auth.getAuth() &&
      this._auth.getAuth().usuario &&
      (this._auth.getAuth().usuario.rol == ROLES.BIBLIOTECA ||
        this._auth.getAuth().usuario.rol == ROLES.BIBLIOTECA_USUARIOS ||
        this._auth.getAuth().usuario.rol == ROLES.ADMIN)
    ) {
      return true;
    } else {
      this._loc.back();
    }
  }
}
