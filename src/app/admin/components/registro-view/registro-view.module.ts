import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroViewComponent } from './registro-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [RegistroViewComponent],
  imports: [CommonModule, MatTableModule, MatIconModule],
  exports: [RegistroViewComponent],
})
export class RegistroViewModule {}
