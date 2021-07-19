import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaUsuariosGuard } from 'app/core/guards/biblioteca-usuarios.guard';
import { CubiculosUsuariosGuard } from 'app/core/guards/cubiculos-usuarios.guard';
import { RecursosElectronicosUsuariosGuard } from 'app/core/guards/recursos-electronicos-usuarios.guard';
import { SharedRoutesGuard } from 'app/core/guards/shared-routes.guard';
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
        canActivate: [BibliotecaUsuariosGuard],
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import('./cubiculos/usuarios-reg-cubiculos-view.module').then(
            (m) => m.UsuariosRegCubiculosViewModule
          ),
        canActivate: [CubiculosUsuariosGuard],
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './recursos-electronicos/usuarios-reg-rec-elec-view.module'
          ).then((m) => m.UsuariosRegRecElecViewModule),
        canActivate: [RecursosElectronicosUsuariosGuard],
      },
      { path: '', redirectTo: '', canActivate: [SharedRoutesGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
