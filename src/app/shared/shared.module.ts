import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { NavbarComponent } from './navbar/navbar.component';
import { SharedComponent } from './shared.component';
import { UsuariosRegistroViewModule } from './components/usuarios-registro-view/usuarios-registro-view.module';

@NgModule({
  declarations: [NavbarComponent, SharedComponent],
  imports: [CommonModule, SharedRoutingModule, UsuariosRegistroViewModule],
})
export class SharedModule {}
