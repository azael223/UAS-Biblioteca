import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaApiService {
  private apiURL = 'http://localhost:8000/api';

  constructor(private _http: HttpClient) {}

  public getObject = (id: number, model: string) => {
    return this._http.get(`${this.apiURL}/${model}/${id}`);
  };

  public createObject = (object: any, model: string) => {
    return this._http.post(`${this.apiURL}/${model}/Create`, object);
  };

  public getObjects = (model: string,whereObject?:any) => {
    const whereObjectStr = whereObject ? `?where=${JSON.stringify(whereObject)}` : ""
    return this._http.get(`${this.apiURL}/${model}/${whereObjectStr}`,);
  };

  public updateObject = (object: any, model: string) => {
    return this._http.post(`${this.apiURL}/${model}/Update`, object);
  };

  public deleteObject = (id: number, model: string) => {
    return this._http.delete(`${this.apiURL}/${model}/Delete/${id}`);
  };
}
