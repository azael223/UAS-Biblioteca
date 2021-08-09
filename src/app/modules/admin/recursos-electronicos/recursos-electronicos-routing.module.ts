import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesGuard } from '@guards/routes.guard';
import { PERMISOS } from '@models/Types';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { RegistrosComponent } from './pages/registros/registros.component';
import { RecursosElectronicosComponent as MainComponent } from './recursos-electronicos.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'equipos',
        component: EquiposComponent,
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.EQUIPOS] },
      },
      {
        path: 'registros',
        component: RegistrosComponent,
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.REG_EQUIPOS] },
      },
      { path: '', redirectTo: 'registros' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecursosElectronicosRoutingModule {}
