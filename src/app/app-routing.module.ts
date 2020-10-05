import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegUserComponent } from './components/reg-user/reg-user.component';

const routes: Routes = [
  { path: 'users', component: RegUserComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'users' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
