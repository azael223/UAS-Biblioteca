import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reg-user',
  templateUrl: './reg-user.component.html',
  styleUrls: ['./reg-user.component.scss'],
})
export class RegUserComponent implements OnInit {
  reguser: FormGroup;

  constructor(private _formB: FormBuilder) {
    this.initRegUser()
  }

  ngOnInit(): void {}

  /* get */
  get nameInvalid() {
    return this.invalidControl('name');
  }
  get institutionInvalid() {
    return this.invalidControl('institution');
  }
  get userType(){
    return this.reguser.get('userType').value
  }

  /* functions */
  invalidControl(controlName: string) {
    return (
      this.reguser.get(controlName).invalid && 
      this.reguser.get(controlName).touched
    );
  }
  submit() {
    console.log(this.reguser)
  }

  /* inits */
  initRegUser() {
    this.reguser = this._formB.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender:['M',[Validators.required]],
      institution: ['', [Validators.required, Validators.minLength(2)]],
      userType:['internal',[Validators.required]],
    });
  }
}
