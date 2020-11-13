import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegCubiculosViewRoutingModule } from './usuarios-reg-cubiculos-view-routing.module';
import { UsuariosRegCubiculosViewComponent } from './usuarios-reg-cubiculos-view.component';


@NgModule({
  declarations: [UsuariosRegCubiculosViewComponent],
  imports: [
    CommonModule,
    UsuariosRegCubiculosViewRoutingModule
  ]
})
export class UsuariosRegCubiculosViewModule { }
