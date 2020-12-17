import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInstitucionComponent } from './add-institucion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AddInstitucionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [AddInstitucionComponent],
})
export class AddInstitucionModule {}
