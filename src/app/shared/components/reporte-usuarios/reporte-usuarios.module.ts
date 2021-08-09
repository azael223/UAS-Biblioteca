import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteUsuariosComponent } from './reporte-usuarios.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ReporteUsuariosComponent],
  imports: [CommonModule, NgxExtendedPdfViewerModule, MatIconModule],
  exports: [ReporteUsuariosComponent],
})
export class ReporteUsuariosModule {}
