import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './pages/reportes.component';
import { ReporteUsuariosModule } from '@components/reporte-usuarios/reporte-usuarios.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ReporteUsuariosModule,
    MatDialogModule,
  ],
})
export class ReportesModule {}
