import { Institucion } from './institucion.model';

export interface Carrera {
  id?: number;
  nombre?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  institucionId?: number;
  institucion?: Institucion;
}
