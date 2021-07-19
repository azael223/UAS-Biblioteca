import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrosComponent } from './pages/registros.component';

const routes: Routes = [{ path: '', component: RegistrosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrosRoutingModule {}
