import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserRegistryViewComponent } from './user-registry-view.component';

@NgModule({
  declarations: [UserRegistryViewComponent],
  imports: [CommonModule, MatTableModule, MatCheckboxModule],
  exports: [UserRegistryViewComponent],
})
export class UserRegistryViewModule {}
