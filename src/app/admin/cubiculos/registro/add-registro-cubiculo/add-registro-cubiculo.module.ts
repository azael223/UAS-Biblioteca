import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRegistroCubiculoComponent } from './add-registro-cubiculo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AddRegistroCubiculoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [AddRegistroCubiculoComponent],
})
export class AddRegistroCubiculoModule {}
