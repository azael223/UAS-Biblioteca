import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrosRoutingModule } from './registros-routing.module';
import { RegistrosComponent } from './pages/registros.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from '@components/dialogs/confirm-dialog/confirm-dialog.module';
import { AddRegistroModule } from './components/add-registro/add-registro.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosRegistroModalModule } from './components/usuarios-registro-modal/usuarios-registro-modal.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReporteUsuariosModule } from '@components/reporte-usuarios/reporte-usuarios.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { FiltersButtonModule } from '@components/filters-button/filters-button.module';

@NgModule({
  declarations: [RegistrosComponent],
  imports: [
    CommonModule,
    RegistrosRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogModule,
    AddRegistroModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    UsuariosRegistroModalModule,
    MatTooltipModule,
    ReporteUsuariosModule,
    NgxExtendedPdfViewerModule,
    MatFormFieldModule,
    MatInputModule,
    SearchBarModule,
    FiltersButtonModule,
  ],
})
export class RegistrosModule {}
