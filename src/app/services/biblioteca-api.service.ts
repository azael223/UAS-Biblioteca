import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
  export class BibliotecaApiService {

    private apiURL = 'http://localhost:8000/api'

    constructor(private _http: HttpClient) {}

  public getObject = (id: string,model:string) => {
    return this._http.get(`${this.apiURL}/${model}/${id}`)
  };

  public createObject = (object: any,model:string) => {
    return this._http.post(`${this.apiURL}/${model}/Create`,object)
  };

  public getObjects = (model:string) => {
    return this._http.get(`${this.apiURL}/${model}/`)
  };

  public updateObject = (object: any,model:string) => {
    return this._http.post(`${this.apiURL}/${model}/`,object)
  };

  public deleteObject = (id: string,model:string) => {
    return this._http.delete(`${this.apiURL}/${model}/${id}`)
  };
}
