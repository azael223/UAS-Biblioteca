import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquiposRoutingModule } from './equipos-routing.module';
import { EquiposComponent } from './equipos.component';
import { MatTableModule } from '@angular/material/table';
import { AddEquipoModule } from './add-equipo/add-equipo.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [EquiposComponent],
  imports: [
    CommonModule,
    EquiposRoutingModule,
    MatTableModule,
    AddEquipoModule,
    ConfirmDialogModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
})
export class EquiposModule {}
