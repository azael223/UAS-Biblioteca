import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error } from '@models/handler/error.model';
import { MODELS } from '@models/Models';
import { Usuario } from '@models/usuario.model';
import { API_URL, BibliotecaApiService } from './biblioteca-api.service';
import { AES, enc } from 'crypto-js';
import { tokenName } from '@angular/compiler';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Observable } from 'rxjs';

export const AUTH_KEY_LS = '_a_tn';
export const AUTH_KEY_AES = 'bI2o20.';

export interface Auth {
  token?: string;
  usuario?: Usuario;
  error?: Error;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _api: BibliotecaApiService, private _http: HttpClient) {}

  logIn(usuario: Usuario): Promise<Auth> {
    return new Promise<Auth>((res, err) => {
      const usuarioReq = this._http.post<any>(
        `${API_URL}/${MODELS.USUARIOS}/LogIn`,
        usuario
      );
      usuarioReq.subscribe((auth: Auth) => {
        if (!auth.error) {
          const token = AES.encrypt(
            JSON.stringify(auth),
            AUTH_KEY_AES
          ).toString();
          localStorage.setItem(AUTH_KEY_LS, token);
        }
        res(auth);
      });
    });
  }

  getAuth(): Auth {
    const token = localStorage.getItem(AUTH_KEY_LS);
    const bytes = AES.decrypt(token, AUTH_KEY_AES);
    return JSON.parse(bytes.toString(enc.Utf8));
  }

  logOut() {
    localStorage.removeItem(AUTH_KEY_LS);
  }
}
