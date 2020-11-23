import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCubiculoComponent } from './add-cubiculo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [AddCubiculoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  exports:[AddCubiculoComponent]
})
export class AddCubiculoModule { }
