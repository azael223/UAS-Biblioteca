import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegRecElecViewRoutingModule } from './usuarios-reg-rec-elec-view-routing.module';
import { UsuariosRegRecElecViewComponent } from './usuarios-reg-rec-elec-view.component';


@NgModule({
  declarations: [UsuariosRegRecElecViewComponent],
  imports: [
    CommonModule,
    UsuariosRegRecElecViewRoutingModule
  ]
})
export class UsuariosRegRecElecViewModule { }
