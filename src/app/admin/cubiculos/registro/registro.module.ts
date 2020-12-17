import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { AddRegistroCubiculoModule } from './add-registro-cubiculo/add-registro-cubiculo.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CubiculosRegistroModalModule } from './cubiculos-registro-modal/cubiculos-registro-modal.module';

@NgModule({
  declarations: [RegistroComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    AddRegistroCubiculoModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CubiculosRegistroModalModule,
  ],
})
export class RegistroModule {}
