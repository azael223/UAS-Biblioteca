import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubiculosRoutingModule } from './cubiculos-routing.module';
import { CubiculosComponent } from './cubiculos.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCubiculoModule } from './add-cubiculo/add-cubiculo.module';
import { ConfirmDialogModule } from 'app/templates/dialogs/confirm-dialog/confirm-dialog.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CubiculosComponent],
  imports: [
    CommonModule,
    CubiculosRoutingModule,
    MatTableModule,
    MatDialogModule,
    AddCubiculoModule,
    ConfirmDialogModule,
    MatSnackBarModule,
  ],
})
export class CubiculosModule {}
