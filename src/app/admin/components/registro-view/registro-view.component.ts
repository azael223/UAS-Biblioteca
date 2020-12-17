import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UsuarioRegistro } from '@models/usuarioRegistro.model';

export interface Column {
  title: string;
  matColumnDef: string;
  property?: string;
  value?: any;
}

@Component({
  selector: 'app-registro-view',
  templateUrl: './registro-view.component.html',
  styleUrls: ['./registro-view.component.scss'],
})
export class RegistroViewComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor() {
    console.log('creado');
  }
  @Input('index') page: number;

  @Input('data') data: any[] = [];

  @Input('columns') columns: Column[] = [];

  public displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns.push('pos');
    this.columns.forEach((column: Column) => {
      this.displayedColumns.push(column.matColumnDef);
    });
    this.displayedColumns.push('creadoEn');
    console.log(this.columns);
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}
}
