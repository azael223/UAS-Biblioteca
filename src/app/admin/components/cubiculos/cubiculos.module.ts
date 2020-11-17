import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubiculosRoutingModule } from './cubiculos-routing.module';
import { CubiculosComponent } from './cubiculos.component';
import { SideMenuModule } from 'app/admin/side-menu/side-menu.module';


@NgModule({
  declarations: [CubiculosComponent],
  imports: [
    CommonModule,
    CubiculosRoutingModule,
    SideMenuModule
  ]
})
export class CubiculosModule { }
