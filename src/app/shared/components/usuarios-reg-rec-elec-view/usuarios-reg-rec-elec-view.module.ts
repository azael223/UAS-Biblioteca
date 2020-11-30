import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegRecElecViewRoutingModule } from './usuarios-reg-rec-elec-view-routing.module';
import { UsuariosRegRecElecViewComponent } from './usuarios-reg-rec-elec-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRegistryViewModule } from 'app/shared/templates/user-registry-view/user-registry-view.module';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosRegRecElecModule } from './usuarios-reg-rec-elec/usuarios-reg-rec-elec.module';


@NgModule({
  declarations: [UsuariosRegRecElecViewComponent],
  imports: [
    CommonModule,
    UsuariosRegRecElecViewRoutingModule,
    MatDialogModule,
    UserRegistryViewModule,
    MatButtonModule,
    UsuariosRegRecElecModule
  ]
})
export class UsuariosRegRecElecViewModule { }
