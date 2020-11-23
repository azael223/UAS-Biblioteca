import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRegistroComponent } from './usuarios-registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [UsuariosRegistroComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
})
export class UsuariosRegistroModule {}
