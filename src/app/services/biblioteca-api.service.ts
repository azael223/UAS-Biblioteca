import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export const API_URL = 'http://localhost:8000/api';

export interface FilterObject {
  where?: any;
  take: number;
  limit: number;
  and: number;
}

@Injectable({
  providedIn: 'root',
})
export class BibliotecaApiService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  private header = { headers: { Authorization: this._auth.getAuth().token } };

  public getObject = (id: number, model: string) => {
    return this._http.get(`${API_URL}/${model}/${id}`, this.header);
  };

  public createObject = (object: any, model: string) => {
    return this._http.post(`${API_URL}/${model}/Create`, object, this.header);
  };

  public getObjects = (model: string, filterObject?: any) => {
    const whereObjectStr = filterObject
      ? `?filters=${JSON.stringify(filterObject)}`
      : '';
    return this._http.get(`${API_URL}/${model}/${whereObjectStr}`, this.header);
  };

  public updateObject = (object: any, model: string) => {
    return this._http.post(`${API_URL}/${model}/Update`, object, this.header);
  };

  public deleteObject = (model: string, id: number) => {
    return this._http.delete(`${API_URL}/${model}/Delete/${id}`, this.header);
  };
}
