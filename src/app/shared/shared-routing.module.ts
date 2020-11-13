import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponent } from './shared.component';

const routes: Routes = [
  {
    path: '',
    component: SharedComponent,
    children: [
      {
        path: 'biblioteca',
        loadChildren: () =>
          import(
            './components/usuarios-registro-view/usuarios-registro-view.module'
          ).then((m) => m.UsuariosRegistroViewModule),
      },
      {
        path: 'cubiculos',
        loadChildren: () =>
          import(
            './components/usuarios-reg-cubiculos-view/usuarios-reg-cubiculos-view.module'
          ).then((m) => m.UsuariosRegCubiculosViewModule),
      },
      {
        path: 'recursos-electronicos',
        loadChildren: () =>
          import(
            './components/usuarios-reg-rec-elec-view/usuarios-reg-rec-elec-view.module'
          ).then((m) => m.UsuariosRegRecElecViewModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
