import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-registry-view',
  templateUrl: './user-registry-view.component.html',
  styleUrls: ['./user-registry-view.component.scss']
})
export class UserRegistryViewComponent implements OnInit {

  @Input('users') users

  public displayedColumns = ["pos","name","check"]

  constructor() { }

  ngOnInit(): void {
  }

}
