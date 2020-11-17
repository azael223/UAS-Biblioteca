import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecursosElectronicosComponent } from './recursos-electronicos.component';

const routes: Routes = [
  {
    path: '',
    component: RecursosElectronicosComponent,
    children: [
      {
        path: 'equipos',
        loadChildren: () =>
          import('./equipos/equipos.module').then((m) => m.EquiposModule),
      },
      {
        path: 'registros',
        loadChildren: () =>
          import('./registro/registro.module').then((m) => m.RegistroModule),
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
