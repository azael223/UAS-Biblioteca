import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'

import { UserRegistryViewComponent } from './user-registry-view.component';


@NgModule({
  declarations: [UserRegistryViewComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports:[UserRegistryViewComponent]
})
export class UserRegistryViewModule { }
