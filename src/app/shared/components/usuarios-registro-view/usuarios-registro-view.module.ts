import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegistroViewRoutingModule } from './usuarios-registro-view-routing.module';
import { UsuariosRegistroViewComponent } from './usuarios-registro-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosRegistroModule } from './usuarios-registro/usuarios-registro.module';
import { UserRegistryViewModule } from 'app/shared/templates/user-registry-view/user-registry-view.module';

@NgModule({
  declarations: [UsuariosRegistroViewComponent],
  imports: [
    CommonModule,
    UsuariosRegistroViewRoutingModule,
    MatDialogModule,
    UsuariosRegistroModule,
    UserRegistryViewModule,
  ],
})
export class UsuariosRegistroViewModule {}
