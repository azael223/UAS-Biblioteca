import { Component, OnInit } from '@angular/core';
import { MODELS } from '@models/Types';
import { RegBiblioteca } from '@models/regBiblioteca.model';
import { RegEquipos } from '@models/regEquipos';
import { ApiService } from '@services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  constructor(private _api: ApiService) {}

  private onDestroy = new Subject<any>();

  public usuariosBiblioteca = 0;
  public usuariosCubiculos = 0;
  public usuariosEquipos = 0;

  getRegistro(model: string) {
    return this._api.getObjects(model, {
      order: { creadoEn: 'DESC' },
      take: 1,
    });
  }

  getUsuarios(idRegistro: number, registroProp: string, usuariosModel: string) {
    return this._api.getObjects(usuariosModel, {
      where: { [registroProp]: idRegistro },
    });
  }
  getRegistrosBiblioteca() {
    this.getRegistro(MODELS.REG_BIBLIOTECA)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: RegBiblioteca[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(data[0].id, 'idRegistro', MODELS.REG_BIBLIOTECA)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((data: []) => {
              if (data) {
                this.usuariosBiblioteca = data.length;
              }
            });
        }
      });
  }

  getRegistrosEquipos() {
    this.getRegistro(MODELS.EQUIPOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: RegEquipos[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(
            data[0].id,
            'idRegRecElec',
            MODELS.US_EQUIPOS
          )
            .pipe(takeUntil(this.onDestroy))
            .subscribe((data: []) => {
              if (data) {
                this.usuariosEquipos = data.length;
              }
            });
        }
      });
  }

  getRegistrosCubiculos() {
    this.getRegistro(MODELS.REG_CUBICULOS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: RegEquipos[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(
            data[0].id,
            'idRegistroCubiculo',
            MODELS.US_CUBICULOS
          )
            .pipe(takeUntil(this.onDestroy))
            .subscribe((data: []) => {
              if (data) {
                this.usuariosCubiculos = data.length;
              }
            });
        }
      });
  }
  ngOnInit(): void {
    this.getRegistrosBiblioteca();
    this.getRegistrosCubiculos();
    this.getRegistrosEquipos();
  }
}
