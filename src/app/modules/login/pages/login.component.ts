import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, AuthService } from 'app/core/services/auth.service';
import { FormLib } from 'app/core/libs/Form.lib';
import { PERMISOS } from '@models/Types';
import { AlertsService } from '@services/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _alerts: AlertsService
  ) {}

  public form = this._fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get isUserInvalid() {
    return (
      this.form.get('username').invalid && this.form.get('username').touched
    );
  }

  get isPasswordInvalid() {
    return (
      this.form.get('password').invalid && this.form.get('password').touched
    );
  }

  public isLoginInvalid = false;
  public loginError = '';

  async login() {
    FormLib.markFormGroupTouched(this.form);
    try {
      if (this.form.invalid) throw '';
      let logged = await this._auth.logIn(this.form.value);
      this.navigate();
    } catch (error) {
      this.isLoginInvalid = true;
      this._alerts.error(error.error.error.message || error);
    }
  }
  navigate() {
    let usuario = this._auth.getAuth()
      ? this._auth.getAuth().usuario
      : undefined;
    if (usuario && usuario.permisos) {
      let { US_BIBLIOTECAS, US_CUBICULOS, US_EQUIPOS, ...permisos } = PERMISOS;
      let adminaccess = usuario.permisos.some((uspermiso) =>
        Object.keys(permisos).some((permiso) => permiso === uspermiso)
      );
      if (adminaccess) this._router.navigateByUrl('admin');
      else this._router.navigateByUrl('shared');
    }
  }
  ngOnInit(): void {}
}
