import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegCubiculosViewRoutingModule } from './usuarios-reg-cubiculos-view-routing.module';
import { UsuariosRegCubiculosViewComponent } from './pages/usuarios-reg-cubiculos-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRegistryViewModule } from '@components/user-registry-view/user-registry-view.module';
import { UsuariosRegCubiculosModule } from './components/usuarios-reg-cubiculos/usuarios-reg-cubiculos.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [UsuariosRegCubiculosViewComponent],
  imports: [
    CommonModule,
    UsuariosRegCubiculosViewRoutingModule,
    MatDialogModule,
    UserRegistryViewModule,
    MatButtonModule,
    UsuariosRegCubiculosModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class UsuariosRegCubiculosViewModule {}
