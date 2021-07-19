import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedGuard } from './core/guards/logged.guard';
import { MainRoutesGuard } from './core/guards/main-routes.guard';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () =>
      import('@modules/shared/shared.module').then((m) => m.SharedModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
    canActivate: [MainRoutesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
