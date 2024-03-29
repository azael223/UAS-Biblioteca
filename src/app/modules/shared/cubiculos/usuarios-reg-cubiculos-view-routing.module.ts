import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosRegCubiculosViewComponent } from './pages/usuarios-reg-cubiculos-view.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosRegCubiculosViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRegCubiculosViewRoutingModule {}
