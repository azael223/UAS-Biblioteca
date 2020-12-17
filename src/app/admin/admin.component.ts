import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLES } from '@models/Roles.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(
    private _router: Router,
    private _activedR: ActivatedRoute,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {

  }


}
