import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesGuard } from '@guards/routes.guard';
import { PERMISOS } from '@models/Types';
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
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.REG_CUBICULOS] },
      },
      {
        path: 'cubiculos',
        component: CubiculosComponent,
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.CUBICULOS] },
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
