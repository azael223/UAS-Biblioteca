import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRegistroCubiculoComponent } from './add-registro-cubiculo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AddRegistroCubiculoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports: [AddRegistroCubiculoComponent],
})
export class AddRegistroCubiculoModule {}
