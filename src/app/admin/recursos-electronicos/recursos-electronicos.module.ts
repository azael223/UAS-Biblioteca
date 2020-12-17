import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursosElectronicosRoutingModule } from './recursos-electronicos-routing.module';
import { RecursosElectronicosComponent } from './recursos-electronicos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RecursosElectronicosComponent],
  imports: [
    CommonModule,
    RecursosElectronicosRoutingModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class RecursosElectronicosModule {}
