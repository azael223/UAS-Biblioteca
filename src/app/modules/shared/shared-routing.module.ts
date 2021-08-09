import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesGuard } from '@guards/routes.guard';
import { PERMISOS } from '@models/Types';
import { SharedComponent } from './shared.component';

const routes: Routes = [
  {
    path: '',
    component: SharedComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./biblioteca/usuarios-registro-view.module').then(
            (m) => m.UsuariosRegistroViewModule
          ),
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.US_BIBLIOTECAS] },
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./cubiculos/usuarios-reg-cubiculos-view.module').then(
            (m) => m.UsuariosRegCubiculosViewModule
          ),
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.US_CUBICULOS] },
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './recursos-electronicos/usuarios-reg-rec-elec-view.module'
          ).then((m) => m.UsuariosRegRecElecViewModule),
        canActivate: [RoutesGuard],
        data: { permisos: [PERMISOS.US_EQUIPOS] },
      },
      { path: '', redirectTo: 'biblioteca' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
