export interface IRoute {
  title?: string;
  path?: string;
  icon?: string;
  childs?: IRoute[];
  rol: string[];
}
