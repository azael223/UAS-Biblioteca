import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { SharedComponent } from './shared.component';
import { NavbarModule } from '../../core/navbar/navbar.module';

@NgModule({
  declarations: [SharedComponent],
  imports: [CommonModule, SharedRoutingModule, NavbarModule],
})
export class SharedModule {}
