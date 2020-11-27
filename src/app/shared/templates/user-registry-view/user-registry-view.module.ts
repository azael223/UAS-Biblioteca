import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserRegistryViewComponent } from './user-registry-view.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [UserRegistryViewComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule
  ],
  exports: [UserRegistryViewComponent],
})
export class UserRegistryViewModule {}
