import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegistroViewRoutingModule } from './usuarios-registro-view-routing.module';
import { UsuariosRegistroViewComponent } from './pages/usuarios-registro-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosRegistroModule } from './components/usuarios-registro/usuarios-registro.module';
import { UserRegistryViewModule } from '@components/user-registry-view/user-registry-view.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [UsuariosRegistroViewComponent],
  imports: [
    CommonModule,
    UsuariosRegistroViewRoutingModule,
    MatDialogModule,
    UsuariosRegistroModule,
    UserRegistryViewModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class UsuariosRegistroViewModule {}
