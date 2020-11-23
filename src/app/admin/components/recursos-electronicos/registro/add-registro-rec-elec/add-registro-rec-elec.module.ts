import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRegistroRecElecComponent } from './add-registro-rec-elec.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [AddRegistroRecElecComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  exports:[AddRegistroRecElecComponent]
})
export class AddRegistroRecElecModule { }
