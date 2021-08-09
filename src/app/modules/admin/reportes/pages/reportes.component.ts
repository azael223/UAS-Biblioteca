import { Component, OnInit } from '@angular/core';
import { MODELS, TIPOS, TURNOS } from '@models/Types';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { RegEquipos } from '@models/regEquipos';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  ReportConfig,
  ReporteUsuariosComponent,
} from '@components/reporte-usuarios/reporte-usuarios.component';
import { UsBiblioteca } from '@models/usBiblioteca.model';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  constructor(private _api: ApiService, private _dialog: MatDialog) {}
  private onDestroy = new Subject<any>();
  ngOnInit(): void {

  }
}
