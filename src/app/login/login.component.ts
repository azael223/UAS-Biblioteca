import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormLib } from 'app/libs/Form.lib';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private _fb: FormBuilder) {}

  public form = this._fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get isUserInvalid(){
    return this.form.get('username').invalid && this.form.get('username').touched
  }

  get isPasswordInvalid(){
    return this.form.get('password').invalid && this.form.get('password').touched
  }

  public isLoginInvalid = false;

  login() {
    FormLib.markFormGroupTouched(this.form)
    this.isLoginInvalid = this.form.invalid;
    if (this.form.valid) {
    }
  }

  ngOnInit(): void {}
}
