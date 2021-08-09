import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from '@components/dialogs/confirm-dialog/confirm-dialog.module';
import { AddUsuarioModule } from './components/add-usuario/add-usuario.module';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AddUsuarioModule,
    SearchBarModule,
    MatTooltipModule,
  ],
})
export class UsuariosModule {}
