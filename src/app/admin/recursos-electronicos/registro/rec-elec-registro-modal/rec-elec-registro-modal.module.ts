import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecElecRegistroModalComponent } from './rec-elec-registro-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RegistroViewModule } from 'app/admin/components/registro-view/registro-view.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RecElecRegistroModalComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RegistroViewModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class RecElecRegistroModalModule {}
