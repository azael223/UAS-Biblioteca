import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Cubiculo } from '@models/cubiculo.model';
import { Equipo } from '@models/equipo.model';
import { MODELS } from '@models/Models';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface User {
  id: number;
  nombre: string;
  checked?: boolean;
  idEquipoComputo?: number;
}

enum types {
  'biblioteca',
  'equipos',
  'cubiculos',
}

@Component({
  selector: 'app-user-registry-view',
  templateUrl: './user-registry-view.component.html',
  styleUrls: ['./user-registry-view.component.scss'],
})
export class UserRegistryViewComponent implements OnInit, OnDestroy {
  constructor(private _api: BibliotecaApiService) {}

  public onDestroy = new Subject<any>();

  @ViewChild('table') table: MatTable<User[]>;
  public users: MatTableDataSource<User>;
  public type: keyof typeof types;
  public displayedColumns = ['pos', 'name', 'check'];
  public equipos: Equipo[] = [];
  public cubiculos: Cubiculo[] = [];

  @Input('users') set _users(users: User[]) {
    this.users = new MatTableDataSource<User>(users);
    this.users.paginator = this.paginator;
  }
  @Input('type') set _type(type: keyof typeof types) {
    this.type = type;
    if (type === 'equipos') {
      this.displayedColumns = ['pos', 'name', 'equipo', 'check'];
      this.getEquipos();
    } else if (type === 'cubiculos') {
      this.displayedColumns = ['pos', 'name', 'cubiculo', 'check'];
      this.getCubiculos();
    } else {
      this.displayedColumns = ['pos', 'name', 'check'];
    }
  }
  @Output() getSelected = new EventEmitter<User>();
  @ViewChild('pag') paginator: MatPaginator;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  selected(user: any) {
    if (!user.terminadoEn) {
      user.terminadoEn = true;
      this.getSelected.emit(user);
    }
  }

  getCubiculo(idCubiculo: number) {
    let cubiculoName = idCubiculo.toString();
    this.cubiculos.some((cubiculo) => {
      if (cubiculo.id === idCubiculo) {
        cubiculoName = cubiculo.nombre;
        return true;
      }
    });
    return cubiculoName;
  }

  getEquipo(idEquipo: number) {
    let equipoName = idEquipo.toString();
    this.equipos.some((equipo) => {
      if (equipo.id === idEquipo) {
        equipoName = equipo.nombre;
        return true;
      }
    });
    return equipoName;
  }

  getCubiculos() {
    return this._api
      .getObjects(MODELS.CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((cubiculos: Cubiculo[]) => {
        this.cubiculos = cubiculos;
      });
  }

  getEquipos() {
    return this._api
      .getObjects(MODELS.EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((equipos: Equipo[]) => {
        this.equipos = equipos;
      });
  }
}
