import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { InstitucionesComponent } from './instituciones.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInstitucionModule } from './add-institucion/add-institucion.module';

@NgModule({
  declarations: [InstitucionesComponent],
  imports: [
    CommonModule,
    InstitucionesRoutingModule,
    MatTableModule,
    MatDialogModule,
    AddInstitucionModule
  ],
})
export class InstitucionesModule {}
