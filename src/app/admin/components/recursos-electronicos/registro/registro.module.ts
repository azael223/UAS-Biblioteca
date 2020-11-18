import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddRegistroRecElecModule } from './add-registro-rec-elec/add-registro-rec-elec.module';


@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    MatTableModule,
    ConfirmDialogModule,
    MatDialogModule,
    MatSnackBarModule,
    AddRegistroRecElecModule
  ]
})
export class RegistroModule { }
