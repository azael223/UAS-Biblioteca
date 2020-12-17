import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrosRoutingModule } from './registros-routing.module';
import { RegistrosComponent } from './registros.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { AddRegistroModule } from './add-registro/add-registro.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosRegistroModalModule } from './usuarios-registro-modal/usuarios-registro-modal.module';

@NgModule({
  declarations: [RegistrosComponent],
  imports: [
    CommonModule,
    RegistrosRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    AddRegistroModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    UsuariosRegistroModalModule
  ],
})
export class RegistrosModule {}
