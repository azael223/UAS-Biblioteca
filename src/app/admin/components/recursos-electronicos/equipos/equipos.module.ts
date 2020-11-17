import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquiposRoutingModule } from './equipos-routing.module';
import { EquiposComponent } from './equipos.component';
import { MatTableModule } from '@angular/material/table';
import { AddEquipoModule } from './add-equipo/add-equipo.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [EquiposComponent],
  imports: [
    CommonModule,
    EquiposRoutingModule,
    MatTableModule,
    AddEquipoModule,
  ],
})
export class EquiposModule { }
