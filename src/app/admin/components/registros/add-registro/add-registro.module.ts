import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRegistroComponent } from './add-registro.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [AddRegistroComponent],
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports:[AddRegistroComponent]
})
export class AddRegistroModule { }
