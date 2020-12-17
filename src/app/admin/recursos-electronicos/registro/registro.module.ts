import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddRegistroRecElecModule } from './add-registro-rec-elec/add-registro-rec-elec.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RecElecRegistroModalModule } from './rec-elec-registro-modal/rec-elec-registro-modal.module';

@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    MatTableModule,
    ConfirmDialogModule,
    MatDialogModule,
    MatSnackBarModule,
    AddRegistroRecElecModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RecElecRegistroModalModule,
  ],
})
export class RegistroModule {}
