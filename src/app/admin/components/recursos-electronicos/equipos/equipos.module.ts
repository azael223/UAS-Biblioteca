import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquiposRoutingModule } from './equipos-routing.module';
import { EquiposComponent } from './equipos.component';
import { MatTableModule } from '@angular/material/table';
import { AddEquipoModule } from './add-equipo/add-equipo.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';


@NgModule({
  declarations: [EquiposComponent],
  imports: [
    CommonModule,
    EquiposRoutingModule,
    MatTableModule,
    AddEquipoModule,
    ConfirmDialogModule
  ],
})
export class EquiposModule { }
