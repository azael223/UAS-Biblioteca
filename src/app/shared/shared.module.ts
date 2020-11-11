import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { UserRegistryViewComponent } from './templates/user-registry-view/user-registry-view.component';
import { UsuariosRegistroViewComponent } from './usuarios-registro-view/usuarios-registro-view.component';



@NgModule({
  declarations: [UsuariosRegistroViewComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
