import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./components/registros/registros.module').then(
            (m) => m.RegistrosModule
          ),
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./components/cubiculos/cubiculos.module').then(
            (m) => m.CubiculosModule
          ),
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './components/recursos-electronicos/recursos-electronicos.module'
          ).then((m) => m.RecursosElectronicosModule),
      },
      {
        path: 'instituciones',
        loadChildren: () =>
          import('./components/instituciones/instituciones.module').then(
            (m) => m.InstitucionesModule
          ),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./components/reportes/reportes.module').then(
            (m) => m.ReportesModule
          ),
      },
      { path: '', redirectTo: 'biblioteca' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
