import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Registro } from '@models/registro.model';
import { UsuarioRegistro } from '@models/usuarioRegistro.model';
import { Institucion } from '@models/institucion.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.scss'],
})
export class UsuariosRegistroComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input('registro') registro: Registro;
  private onDestroy = new Subject<any>();
  private instituciones: Institucion[];
  public filteredInstituciones: Observable<Institucion[]>;

  constructor(private _api: BibliotecaApiService, private _fb: FormBuilder) {}

  public form = this._fb.group({
    name: new FormControl('', [Validators.required]),
    genre: new FormControl('M', [Validators.required]),
    userType: new FormControl('I', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
  });

  /* REQUESTS */
  getUsuariosRegistro() {
    return this._api.getObjects('RegUsuarios', { idRegistro: 1 });
  }

  getInstituciones() {
    return this._api.getObjects('Instituciones');
  }

  /* INSTITUCIONES FILTER */
  filterInstituciones() {
    this.filteredInstituciones = this.form.get('institution').valueChanges.pipe(
      startWith(''),
      map((institucion: Institucion) => institucion.nombre),
      map((nombre: string) =>
        nombre ? this._filter(nombre) : this.instituciones.slice()
      )
    );
  }
  displayFn(institucion: Institucion) {
    return institucion && institucion.nombre ? institucion.nombre : undefined;
  }
  _filter(nombre: string) {
    const filterValue = nombre.toLowerCase();
    return this.instituciones.filter((institucion: Institucion) =>
      institucion.nombre.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getUsuariosRegistro();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
