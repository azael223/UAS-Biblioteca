import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { AddRegistroCubiculoModule } from './add-registro-cubiculo/add-registro-cubiculo.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    AddRegistroCubiculoModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule
  ]
})
export class RegistroModule { }
