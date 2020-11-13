import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { UserRegistryViewModule } from '../../templates/user-registry-view/user-registry-view.module'

import { UsuariosRegistroViewRoutingModule } from './usuarios-registro-view-routing.module';
import { UsuariosRegistroComponent } from './usuarios-registro/usuarios-registro.component';
import { UsuariosRegistroViewComponent } from './usuarios-registro-view.component'


@NgModule({
  declarations: [UsuariosRegistroViewComponent, UsuariosRegistroComponent],
  imports: [
    CommonModule,
    UsuariosRegistroViewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    UserRegistryViewModule
  ]
})
export class UsuariosRegistroViewModule { }
