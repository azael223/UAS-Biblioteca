import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface User {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-user-registry-view',
  templateUrl: './user-registry-view.component.html',
  styleUrls: ['./user-registry-view.component.scss'],
})
export class UserRegistryViewComponent implements OnInit {
  @Input('users') users: User[];
  @Output() getSelected = new EventEmitter<User>();

  public displayedColumns = ['pos', 'name', 'check'];

  constructor() {}

  selected(user: User) {
    this.getSelected.emit(user);
  }

  ngOnInit(): void {}
}
