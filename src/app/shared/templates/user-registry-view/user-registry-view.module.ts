import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRegistryViewComponent } from './user-registry-view.component';


@NgModule({
  declarations: [UserRegistryViewComponent],
  imports: [
    CommonModule
  ],
  exports:[UserRegistryViewComponent]
})
export class UserRegistryViewModule { }
