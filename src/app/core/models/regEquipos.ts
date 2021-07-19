import { UsEquipos } from './usEquipos.model';

export interface RegEquipos {
  id?: number;
  area?: string;
  turno?: string;
  regStatus?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  usEquipos?: UsEquipos[];
}
