import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstitucionesComponent } from './instituciones.component';

const routes: Routes = [{ path: '', component: InstitucionesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstitucionesRoutingModule {}
