import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegCubiculosViewRoutingModule } from './usuarios-reg-cubiculos-view-routing.module';
import { UsuariosRegCubiculosViewComponent } from './usuarios-reg-cubiculos-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRegistryViewModule } from 'app/shared/templates/user-registry-view/user-registry-view.module';
import { UsuariosRegCubiculosModule } from './usuarios-reg-cubiculos/usuarios-reg-cubiculos.module';


@NgModule({
  declarations: [UsuariosRegCubiculosViewComponent],
  imports: [
    CommonModule,
    UsuariosRegCubiculosViewRoutingModule,
    MatDialogModule,
    UserRegistryViewModule,
    MatButtonModule,
    UsuariosRegCubiculosModule
  ]
})
export class UsuariosRegCubiculosViewModule { }
