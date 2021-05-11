import { UsBiblioteca } from './usBiblioteca.model';

export interface RegBiblioteca {
  id?: number;
  ur?: string;
  area?: string;
  turno?: string;
  regStatus?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  usBibliotecas?: UsBiblioteca[];
}
