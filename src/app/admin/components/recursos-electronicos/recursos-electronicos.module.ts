import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursosElectronicosRoutingModule } from './recursos-electronicos-routing.module';
import { RecursosElectronicosComponent } from './recursos-electronicos.component';


@NgModule({
  declarations: [RecursosElectronicosComponent],
  imports: [
    CommonModule,
    RecursosElectronicosRoutingModule
  ]
})
export class RecursosElectronicosModule { }
