import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'app/admin/side-menu/side-menu.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cubiculos',
  templateUrl: './cubiculos.component.html',
  styleUrls: ['./cubiculos.component.scss'],
})
export class CubiculosComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy = new Subject<any>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
