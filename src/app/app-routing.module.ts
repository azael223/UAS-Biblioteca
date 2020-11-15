import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () =>
      import('./shared/shared.module').then((m) => m.SharedModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'shared' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
