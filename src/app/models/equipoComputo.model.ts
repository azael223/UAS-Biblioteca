export interface EquipoComputo {
  id?: number;
  nombre?: string;
  status?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}
export const STATUS_EQUIPO = {
  A: 'Activo',
  I: 'Inactivo',
};
