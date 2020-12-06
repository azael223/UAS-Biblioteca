import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'app/guards/admin.guard';
import { BibliotecaGuard } from 'app/guards/biblioteca.guard';
import { CubiculosGuard } from 'app/guards/cubiculos.guard';
import { RecursosElectronicosGuard } from 'app/guards/recursos-electronicos.guard';
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
        canActivate: [BibliotecaGuard, AdminGuard],
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./components/cubiculos/cubiculos.module').then(
            (m) => m.CubiculosModule
          ),
        canActivate: [CubiculosGuard, AdminGuard],
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './components/recursos-electronicos/recursos-electronicos.module'
          ).then((m) => m.RecursosElectronicosModule),
        canActivate: [RecursosElectronicosGuard, AdminGuard],
      },
      {
        path: 'instituciones',
        loadChildren: () =>
          import('./components/instituciones/instituciones.module').then(
            (m) => m.InstitucionesModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./components/reportes/reportes.module').then(
            (m) => m.ReportesModule
          ),
        canActivate: [AdminGuard],
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
