import { Carrera } from './carrera.model';
import { Equipo } from './equipo.model';

export interface UsEquipos {
  id?: number;
  regEquiposId?: number;
  equipoId?: number;
  carreraId?: number;
  nombre?: string;
  sexo?: string;
  email?: string;
  status?: string;
  creadoEn?: string;
  terminadoEn?: string;
  equipo?: Equipo;
  carrera?: Carrera;
}
