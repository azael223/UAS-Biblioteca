import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES } from '@models/Roles.model';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private _auth: AuthService, private _router: Router) {}

  rol = this._auth.getAuth().usuario.rol;
  roles = ROLES;
  logOut() {
    this._auth.logOut();
  }
  verifyRol() {
    if (
      this.rol === this.roles.CUBICULOS_USUARIOS ||
      this.rol === this.roles.BIBLIOTECA_USUARIOS ||
      this.rol === this.roles.RECURSOS_ELECTRONICOS_USUARIOS
    ) {
      return true;
    } else {
      return false;
    }
  }
  goToAdmin() {
    this._router.navigateByUrl('/admin');
  }
  ngOnInit(): void {}
}
