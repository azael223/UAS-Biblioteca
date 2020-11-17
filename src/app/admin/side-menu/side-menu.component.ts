import { Component, Input, OnInit } from '@angular/core';

export interface MenuItem{
  title:string,
  icon?:string,
  route:string
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input('Items') menuItems:MenuItem[]

  constructor() { }

  ngOnInit(): void {
  }

}
