import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursosElectronicosRoutingModule } from './recursos-electronicos-routing.module';
import { RecursosElectronicosComponent } from './recursos-electronicos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddEquipoModule } from './components/add-equipo/add-equipo.module';
import { AddRegistroRecElecModule } from './components/add-registro-rec-elec/add-registro-rec-elec.module';
import { RecElecRegistroModalModule } from './components/rec-elec-registro-modal/rec-elec-registro-modal.module';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { RegistrosComponent } from './pages/registros/registros.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersButtonModule } from '@components/filters-button/filters-button.module';

@NgModule({
  declarations: [
    RecursosElectronicosComponent,
    EquiposComponent,
    RegistrosComponent,
  ],
  imports: [
    CommonModule,
    RecursosElectronicosRoutingModule,
    MatButtonModule,
    MatIconModule,
    AddEquipoModule,
    AddRegistroRecElecModule,
    RecElecRegistroModalModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxExtendedPdfViewerModule,
    SearchBarModule,
    MatPaginatorModule,
    FiltersButtonModule,
  ],
})
export class RecursosElectronicosModule {}
