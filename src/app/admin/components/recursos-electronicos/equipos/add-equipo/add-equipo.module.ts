import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEquipoComponent } from './add-equipo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [AddEquipoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports:[AddEquipoComponent]
})
export class AddEquipoModule { }
