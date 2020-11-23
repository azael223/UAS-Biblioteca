import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosRegCubiculosViewComponent } from '../usuarios-reg-cubiculos-view/usuarios-reg-cubiculos-view.component';
import { UsuariosRegRecElecViewComponent } from './usuarios-reg-rec-elec-view.component';

const routes: Routes = [
  { path: '', component: UsuariosRegRecElecViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRegRecElecViewRoutingModule {}
