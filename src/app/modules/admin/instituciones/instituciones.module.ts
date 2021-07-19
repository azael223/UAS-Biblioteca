import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { InstitucionesComponent } from './pages/instituciones.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInstitucionModule } from './components/add-institucion/add-institucion.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from '@components/dialogs/confirm-dialog/confirm-dialog.module';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [InstitucionesComponent],
  imports: [
    CommonModule,
    InstitucionesRoutingModule,
    MatTableModule,
    MatDialogModule,
    AddInstitucionModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AddInstitucionModule,
  ],
})
export class InstitucionesModule {}
