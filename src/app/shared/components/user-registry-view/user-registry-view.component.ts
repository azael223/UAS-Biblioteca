import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface User {
  id: number;
  nombre: string;
  checked?: boolean;
}

@Component({
  selector: 'app-user-registry-view',
  templateUrl: './user-registry-view.component.html',
  styleUrls: ['./user-registry-view.component.scss'],
})
export class UserRegistryViewComponent implements OnInit {
  @ViewChild('table') table: MatTable<User[]>;
  public users: MatTableDataSource<User>;
  @Input('users') set _users(users: User[]) {
    this.users = new MatTableDataSource<User>(users);
    this.users.paginator = this.paginator;
  }
  @Output() getSelected = new EventEmitter<User>();
  @ViewChild('pag') paginator: MatPaginator;

  public displayedColumns = ['pos', 'name', 'check'];

  constructor() {}

  selected(user: any) {
    if (!user.terminadoEn) {
      user.terminadoEn = true;
      this.getSelected.emit(user);
    }
  }

  ngOnInit(): void {}
}
