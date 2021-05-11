import { Carrera } from './carrera.model';

export interface Institucion {
  id?: number;
  nombre?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  carreras?: Carrera[];
}
