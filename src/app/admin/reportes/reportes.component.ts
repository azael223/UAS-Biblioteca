import { Component, OnInit } from '@angular/core';
import { MODELS } from '@models/Models';
import { Registro } from '@models/registro.model';
import { RegRecElec } from '@models/regRecElec.model';
import { BibliotecaApiService } from '@services/biblioteca-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  constructor(private _api: BibliotecaApiService) {}

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
    this.getRegistro(MODELS.REGISTROS)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: Registro[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(data[0].id, 'idRegistro', MODELS.REG_USUARIOS)
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
    this.getRegistro(MODELS.EQUIPOS_COMPUTO)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data: RegRecElec[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(
            data[0].id,
            'idRegRecElec',
            MODELS.REG_REC_ELEC_USUARIOS
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
      .subscribe((data: RegRecElec[]) => {
        console.log(data);
        if (data) {
          this.getUsuarios(
            data[0].id,
            'idRegistroCubiculo',
            MODELS.REG_CUBICULOS_USUARIOS
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
