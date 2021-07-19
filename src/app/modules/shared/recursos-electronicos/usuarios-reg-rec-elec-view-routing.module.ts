import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosRegRecElecViewComponent } from './pages/usuarios-reg-rec-elec-view.component';

const routes: Routes = [
  { path: '', component: UsuariosRegRecElecViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRegRecElecViewRoutingModule {}
