import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CubiculosComponent } from './cubiculos.component';

const routes: Routes = [{ path: '', component: CubiculosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CubiculosRoutingModule {}
