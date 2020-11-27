import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  public users: MatTableDataSource<User>;
  @Input('users') set _users(users: User[]) {
    this.users = new MatTableDataSource<User>(users);
    this.users.paginator = this.paginator;
  }
  @Output() getSelected = new EventEmitter<User>();
  @ViewChild('pag') paginator: MatPaginator;

  public displayedColumns = ['pos', 'name', 'check'];

  constructor() {}

  selected(user: User) {
    this.getSelected.emit(user);
    return true
  }

  ngOnInit(): void {

  }
}
