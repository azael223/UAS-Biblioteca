import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRegRecElecComponent } from './usuarios-reg-rec-elec.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [UsuariosRegRecElecComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule
  ],
  exports: [UsuariosRegRecElecComponent],
})
export class UsuariosRegRecElecModule {}
