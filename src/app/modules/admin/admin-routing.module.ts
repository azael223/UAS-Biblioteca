import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { AdminGuard } from 'app/core/guards/admin.guard';
import { BibliotecaGuard } from 'app/core/guards/biblioteca.guard';
import { CubiculosGuard } from 'app/core/guards/cubiculos.guard';
import { RecursosElectronicosGuard } from 'app/core/guards/recursos-electronicos.guard';
import { RoutesGuard } from 'app/core/guards/routes.guard';
import { AdminComponent } from './admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./registros/registros.module').then((m) => m.RegistrosModule),
        canActivate: [BibliotecaGuard],
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./cubiculos/cubiculos.module').then((m) => m.CubiculosModule),
        canActivate: [CubiculosGuard],
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import('./recursos-electronicos/recursos-electronicos.module').then(
            (m) => m.RecursosElectronicosModule
          ),
        canActivate: [RecursosElectronicosGuard],
      },
      {
        path: 'instituciones',
        loadChildren: () =>
          import('./instituciones/instituciones.module').then(
            (m) => m.InstitucionesModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./reportes/reportes.module').then((m) => m.ReportesModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
        canActivate: [AdminGuard],
      },
      {
        path: '',
        canActivate: [RoutesGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
