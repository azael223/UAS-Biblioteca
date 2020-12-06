import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, AuthService } from '@services/auth.service';
import { FormLib } from 'app/libs/Form.lib';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router
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

  login() {
    FormLib.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this._auth.logIn(this.form.value).then((res: Auth) => {
        if (res && res.usuario) {
          this._router.navigateByUrl('admin');
        } else if (res && res.error) {
          this.loginError = 'Usuario o contraseña incorrectos.';
          this.isLoginInvalid = true;
        } else {
          this.loginError = 'Error en servidor.';
          this.isLoginInvalid = true;
        }
      });
    }
  }

  ngOnInit(): void {}
}
