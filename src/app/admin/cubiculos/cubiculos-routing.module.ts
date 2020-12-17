import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'app/guards/admin.guard';
import { CubiculosComponent } from './cubiculos.component';

const routes: Routes = [
  {
    path: '',
    component: CubiculosComponent,
    children: [
      {
        path: 'registros',
        loadChildren: () =>
          import('./registro/registro.module').then((m) => m.RegistroModule),
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./cubiculos/cubiculos.module').then((m) => m.CubiculosModule),
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
