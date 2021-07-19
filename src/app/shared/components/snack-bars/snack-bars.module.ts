import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarsComponent } from './snack-bars.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SnackBarsComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [SnackBarsComponent],
})
export class SnackBarsModule {}
