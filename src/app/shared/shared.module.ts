import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';

import { NavbarComponent } from './navbar/navbar.component';
import { SharedComponent } from './shared.component';


@NgModule({
  declarations: [NavbarComponent, SharedComponent],
  imports: [CommonModule, SharedRoutingModule],
})
export class SharedModule {}
