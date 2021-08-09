import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { RoutesGuard } from 'app/core/guards/routes.guard';
import { AdminComponent } from './admin.component';
import { PERMISOS } from '@models/Types';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./registros/registros.module').then((m) => m.RegistrosModule),
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.REG_BIBLIOTECA] },
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./cubiculos/cubiculos.module').then((m) => m.CubiculosModule),
        canActivate: [RoutesGuard],
        data: {
          permisos: [PERMISOS.REG_CUBICULOS, PERMISOS.CUBICULOS],
        },
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import('./recursos-electronicos/recursos-electronicos.module').then(
            (m) => m.RecursosElectronicosModule
          ),
        canActivate: [RoutesGuard],
        data: {
          permisos: [PERMISOS.REG_EQUIPOS, PERMISOS.EQUIPOS],
        },
      },
      {
        path: 'instituciones',
        loadChildren: () =>
          import('./instituciones/instituciones.module').then(
            (m) => m.InstitucionesModule
          ),
        canActivate: [RoutesGuard],
        data: {
          permisos: [PERMISOS.INSTITUCIONES],
        },
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./reportes/reportes.module').then((m) => m.ReportesModule),
        canActivate: [RoutesGuard],
        data: {
          permisos: [],
        },
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
        canActivate: [RoutesGuard],
        data: {
          permisos: [PERMISOS.USUARIOS],
        },
      },
      {
        path: '',
        redirectTo: 'biblioteca',
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
