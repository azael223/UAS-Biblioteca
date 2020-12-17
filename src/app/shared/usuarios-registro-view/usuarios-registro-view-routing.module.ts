import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosRegistroViewComponent } from './usuarios-registro-view.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosRegistroViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRegistroViewRoutingModule {}
