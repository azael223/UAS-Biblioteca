import { IfStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ROLES } from '@models/Roles.model';
import { AuthService } from '@services/auth.service';
import { MenuItem } from 'app/admin/side-menu/side-menu.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cubiculos',
  templateUrl: './cubiculos.component.html',
  styleUrls: ['./cubiculos.component.scss'],
})
export class CubiculosComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy = new Subject<any>();

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}

  getRole() {
    if (this._auth.getAuth().usuario.rol === ROLES.ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
