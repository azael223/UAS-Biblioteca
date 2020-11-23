import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInstitucionComponent } from './add-institucion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AddInstitucionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [AddInstitucionComponent],
})
export class AddInstitucionModule {}
