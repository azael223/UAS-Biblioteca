export interface Equipo {
  id?: number;
  nombre?: string;
  statusEquipo?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}
export const STATUS_EQUIPO = {
  A: 'Activo',
  I: 'Inactivo',
};
