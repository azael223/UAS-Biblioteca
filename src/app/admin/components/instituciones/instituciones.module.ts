import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { InstitucionesComponent } from './instituciones.component';


@NgModule({
  declarations: [InstitucionesComponent],
  imports: [
    CommonModule,
    InstitucionesRoutingModule
  ]
})
export class InstitucionesModule { }
