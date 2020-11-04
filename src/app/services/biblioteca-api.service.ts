import { Injectable } from '@angular/core';
import { Interface } from 'readline';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaApiService {
  constructor() {}

  public getObject = <Interface>(id:string,model:Interface) => {
  };

  public createObject = () => {};

  public getObjects = () => {};

  public updateObject = () => {};

  public deleteObject = () => {};
}
