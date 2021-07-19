import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UsBiblioteca } from '@models/usBiblioteca.model';

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
  constructor() {}
  @Input('index') page: number;

  @Input('data') data: any[] = [];

  @Input('columns') columns: Column[] = [];

  public displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns.push('pos');
    this.columns.forEach((column: Column) => {
      this.displayedColumns.push(column.matColumnDef);
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}
}
