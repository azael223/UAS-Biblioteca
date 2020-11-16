import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrosRoutingModule } from './registros-routing.module';
import { RegistrosComponent } from './registros.component';


@NgModule({
  declarations: [RegistrosComponent],
  imports: [
    CommonModule,
    RegistrosRoutingModule
  ]
})
export class RegistrosModule { }
