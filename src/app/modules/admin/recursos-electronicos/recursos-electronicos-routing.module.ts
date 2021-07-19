import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'app/core/guards/admin.guard';
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
        canActivate: [AdminGuard],
      },
      {
        path: 'registros',
        component: RegistrosComponent,
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
