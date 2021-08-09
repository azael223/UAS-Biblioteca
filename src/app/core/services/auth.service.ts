import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error } from '@models/handler/error.model';
import { MODELS } from '@models/Types';
import { Usuario } from '@models/usuario.model';
import { AES, enc } from 'crypto-js';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const AUTH_KEY_LS = '_a_tn';
export const AUTH_KEY_AES = 'bI2o20.';

export interface Auth {
  token?: string;
  usuario?: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _router: Router) {}
  API_URL = environment.apiUrl;
  logIn(usuario: Usuario): Promise<Auth> {
    return new Promise<Auth>((res, rej) => {
      const usuarioReq$ = this._http.post<any>(
        `${this.API_URL}/${MODELS.USUARIOS}/login`,
        usuario
      );
      usuarioReq$.subscribe(
        (auth: Auth) => {
          const token = AES.encrypt(
            JSON.stringify(auth),
            AUTH_KEY_AES
          ).toString();
          localStorage.setItem(AUTH_KEY_LS, token);
          res(auth);
        },
        (error) => {
          rej(error);
        }
      );
    });
  }

  getAuth(): Auth {
    const token = localStorage.getItem(AUTH_KEY_LS);
    if (token) {
      const bytes = AES.decrypt(token, AUTH_KEY_AES);
      return JSON.parse(bytes.toString(enc.Utf8));
    } else {
      this._router.navigateByUrl('login');
    }
  }

  getAuthWithoutNav(): Auth {
    const token = localStorage.getItem(AUTH_KEY_LS);
    if (token) {
      const bytes = AES.decrypt(token, AUTH_KEY_AES);
      return JSON.parse(bytes.toString(enc.Utf8));
    } else {
      return undefined;
    }
  }

  logOut() {
    localStorage.removeItem(AUTH_KEY_LS);
    this._router.navigateByUrl('login');
  }
}
