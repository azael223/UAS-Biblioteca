import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubiculosRoutingModule } from './cubiculos-routing.module';
import { CubiculosComponent } from './cubiculos.component';
import { SideMenuModule } from 'app/admin/side-menu/side-menu.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CubiculosComponent],
  imports: [
    CommonModule,
    CubiculosRoutingModule,
    SideMenuModule,
    MatIconModule,
    MatButtonModule
  ],
})
export class CubiculosModule {}
