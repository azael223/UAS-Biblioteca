import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { InstitucionesComponent } from './instituciones.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInstitucionModule } from './add-institucion/add-institucion.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';

@NgModule({
  declarations: [InstitucionesComponent],
  imports: [
    CommonModule,
    InstitucionesRoutingModule,
    MatTableModule,
    MatDialogModule,
    AddInstitucionModule,
    MatSnackBarModule,
    ConfirmDialogModule
  ],
})
export class InstitucionesModule {}
