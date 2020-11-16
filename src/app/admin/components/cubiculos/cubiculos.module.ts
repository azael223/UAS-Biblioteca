import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubiculosRoutingModule } from './cubiculos-routing.module';
import { CubiculosComponent } from './cubiculos.component';


@NgModule({
  declarations: [CubiculosComponent],
  imports: [
    CommonModule,
    CubiculosRoutingModule
  ]
})
export class CubiculosModule { }
