import { UsCubiculos } from './usCubiculos.model';

export interface RegCubiculos {
  id?: number;
  ur?: string;
  biblioteca?: string;
  regStatus?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  usCubiculos?: UsCubiculos[];
}
