import { Carrera } from './carrera.model';
import { Cubiculo } from './cubiculo.model';

export interface UsCubiculos {
  id?: number;
  regCubiculosId?: number;
  carreraId?: number;
  cubiculoId?: number;
  nombre?: string;
  status?: string;
  creadoEn?: string;
  terminadoEn?: string;
  cubiculo?: Cubiculo;
  carrera?: Carrera;
}
