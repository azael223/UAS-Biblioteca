import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaUsuariosGuard } from 'app/guards/biblioteca-usuarios.guard';
import { CubiculosUsuariosGuard } from 'app/guards/cubiculos-usuarios.guard';
import { RecursosElectronicosUsuariosGuard } from 'app/guards/recursos-electronicos-usuarios.guard';
import { SharedRoutesGuard } from 'app/guards/shared-routes.guard';
import { SharedComponent } from './shared.component';

const routes: Routes = [
  {
    path: '',
    component: SharedComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import('./usuarios-registro-view/usuarios-registro-view.module').then(
            (m) => m.UsuariosRegistroViewModule
          ),
        canActivate: [BibliotecaUsuariosGuard],
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import(
            './usuarios-reg-cubiculos-view/usuarios-reg-cubiculos-view.module'
          ).then((m) => m.UsuariosRegCubiculosViewModule),
        canActivate: [CubiculosUsuariosGuard],
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './usuarios-reg-rec-elec-view/usuarios-reg-rec-elec-view.module'
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
