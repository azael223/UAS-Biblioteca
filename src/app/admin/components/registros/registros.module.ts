import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrosRoutingModule } from './registros-routing.module';
import { RegistrosComponent } from './registros.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { AddRegistroModule } from './add-registro/add-registro.module';


@NgModule({
  declarations: [RegistrosComponent],
  imports: [
    CommonModule,
    RegistrosRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    AddRegistroModule
  ]
})
export class RegistrosModule { }
