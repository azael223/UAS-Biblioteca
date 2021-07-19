import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './pages/reportes.component';

@NgModule({
  declarations: [ReportesComponent],
  imports: [CommonModule, ReportesRoutingModule],
})
export class ReportesModule {}
