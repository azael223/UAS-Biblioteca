import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubiculosRoutingModule } from './cubiculos-routing.module';
import { CubiculosComponent as MainComponent } from './cubiculos.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegistrosComponent } from './pages/registros/registros.component';
import { AddCubiculoModule } from './components/add-cubiculo/add-cubiculo.module';
import { AddRegistroCubiculoModule } from './components/add-registro-cubiculo/add-registro-cubiculo.module';
import { CubiculosRegistroModalModule } from './components/cubiculos-registro-modal/cubiculos-registro-modal.module';
import { CubiculosComponent } from './pages/cubiculos/cubiculos.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersButtonModule } from '@components/filters-button/filters-button.module';

@NgModule({
  declarations: [MainComponent, RegistrosComponent, CubiculosComponent],
  imports: [
    CommonModule,
    CubiculosRoutingModule,
    MatIconModule,
    MatButtonModule,
    AddCubiculoModule,
    AddRegistroCubiculoModule,
    CubiculosRegistroModalModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxExtendedPdfViewerModule,
    SearchBarModule,
    MatPaginatorModule,
    FiltersButtonModule,
  ],
})
export class CubiculosModule {}
