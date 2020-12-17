import { Component, OnInit } from '@angular/core';
import { ROLES } from '@models/Roles.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-recursos-electronicos',
  templateUrl: './recursos-electronicos.component.html',
  styleUrls: ['./recursos-electronicos.component.scss']
})
export class RecursosElectronicosComponent implements OnInit {

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}

  getRole() {
    if (this._auth.getAuth().usuario.rol === ROLES.ADMIN) {
      return true;
    } else {
      return false;
    }
  }
}
