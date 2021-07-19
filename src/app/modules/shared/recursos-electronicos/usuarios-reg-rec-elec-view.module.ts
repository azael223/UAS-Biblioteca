import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRegRecElecViewRoutingModule } from './usuarios-reg-rec-elec-view-routing.module';
import { UsuariosRegRecElecViewComponent } from './pages/usuarios-reg-rec-elec-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRegistryViewModule } from '@components/user-registry-view/user-registry-view.module';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosRegRecElecModule } from './components/usuarios-reg-rec-elec/usuarios-reg-rec-elec.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UsuariosRegRecElecViewComponent],
  imports: [
    CommonModule,
    UsuariosRegRecElecViewRoutingModule,
    MatDialogModule,
    UserRegistryViewModule,
    MatButtonModule,
    UsuariosRegRecElecModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class UsuariosRegRecElecViewModule {}
