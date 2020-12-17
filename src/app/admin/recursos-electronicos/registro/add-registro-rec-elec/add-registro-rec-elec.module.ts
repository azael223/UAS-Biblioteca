import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRegistroRecElecComponent } from './add-registro-rec-elec.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [AddRegistroRecElecComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,  
    MatButtonModule,
    MatSelectModule
  ],
  exports:[AddRegistroRecElecComponent]
})
export class AddRegistroRecElecModule { }
