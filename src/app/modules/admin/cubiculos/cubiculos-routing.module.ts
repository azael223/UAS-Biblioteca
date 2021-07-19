import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'app/core/guards/admin.guard';
import { CubiculosComponent as MainComponent } from './cubiculos.component';
import { CubiculosComponent } from './pages/cubiculos/cubiculos.component';
import { RegistrosComponent } from './pages/registros/registros.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'registros',
        component: RegistrosComponent,
      },
      {
        path: 'cubiculos',
        component: CubiculosComponent,
        canActivate: [AdminGuard],
      },
      { path: '', redirectTo: 'registros' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CubiculosRoutingModule {}
