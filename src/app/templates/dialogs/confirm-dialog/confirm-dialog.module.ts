import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule],
  exports: [ConfirmDialogComponent],
})
export class ConfirmDialogModule {}
