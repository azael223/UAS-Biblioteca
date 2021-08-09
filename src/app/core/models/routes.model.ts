import { IRoute } from './handler/routes.model';
import { PERMISOS } from './Types';

export const ADMIN_ROUTES: IRoute[] = [
  {
    path: 'biblioteca',
    title: 'Biblioteca',
    rol: [PERMISOS.ADMIN, PERMISOS.REG_BIBLIOTECA],
    icon: 'book',
  },
  {
    path: 'cubiculos',
    title: 'Cubiculos',
    rol: [PERMISOS.ADMIN, PERMISOS.CUBICULOS, PERMISOS.REG_CUBICULOS],
    icon: 'inbox',
    childs: [
      {
        path: 'registros',
        title: 'Registros',
        rol: [PERMISOS.ADMIN, PERMISOS.REG_CUBICULOS],
      },
      {
        path: 'cubiculos',
        title: 'Cubiculos',
        rol: [PERMISOS.ADMIN, PERMISOS.CUBICULOS],
      },
    ],
  },
  {
    path: 'recursos-electronicos',
    title: 'Recursos Electronicos',
    rol: [PERMISOS.ADMIN, PERMISOS.REG_EQUIPOS, PERMISOS.EQUIPOS],
    icon: 'computer',
    childs: [
      {
        path: 'registros',
        title: 'Registros',
        rol: [PERMISOS.ADMIN, PERMISOS.REG_EQUIPOS],
      },
      {
        path: 'equipos',
        title: 'Equipos',
        rol: [PERMISOS.ADMIN, PERMISOS.EQUIPOS],
      },
    ],
  },
  {
    path: 'instituciones',
    title: 'Instituciones',
    rol: [PERMISOS.ADMIN, PERMISOS.INSTITUCIONES],
    icon: 'account_balance',
  },
  {
    path: 'usuarios',
    title: 'Usuarios',
    rol: [PERMISOS.ADMIN, PERMISOS.USUARIOS],
    icon: 'group',
  },
];

export const SHARED_ROUTES: IRoute[] = [
  {
    path: 'biblioteca',
    title: 'Biblioteca',
    rol: [PERMISOS.ADMIN, PERMISOS.US_BIBLIOTECAS],
    icon: 'book',
  },
  {
    path: 'cubiculos',
    title: 'Cubiculos',
    rol: [PERMISOS.ADMIN, PERMISOS.US_CUBICULOS],
    icon: 'inbox',
  },
  {
    path: 'recursos-electronicos',
    title: 'Recursos Electronicos',
    rol: [PERMISOS.ADMIN, PERMISOS.US_EQUIPOS],
    icon: 'computer',
  },
];
