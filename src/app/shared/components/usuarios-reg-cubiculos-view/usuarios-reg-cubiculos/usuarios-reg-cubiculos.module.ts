import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRegCubiculosComponent } from './usuarios-reg-cubiculos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [UsuariosRegCubiculosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule
  ]
})
export class UsuariosRegCubiculosModule { }
