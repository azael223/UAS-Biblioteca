import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'

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

  API_URL = environment.apiUrl

  private header = {
    headers: { Authorization: 'Bearer ' + this._auth.getAuth().token },
  };

  public getObject = (id: number, model: string) => {
    return this._http.get(`${this.API_URL}/${model}/${id}`, this.header);
  };

  public createObject = (object: any, model: string) => {
    return this._http.post(`${this.API_URL}/${model}/Create`, object, this.header);
  };

  public getObjects = (model: string, filterObject?: any) => {
    const whereObjectStr = filterObject
      ? `?filters=${JSON.stringify(filterObject)}`
      : '';
    return this._http.get(`${this.API_URL}/${model}/${whereObjectStr}`, this.header);
  };
  public count = (model: string, filterObject?: any) => {
    const whereObjectStr = filterObject
      ? `?filters=${JSON.stringify(filterObject)}`
      : '';
    return this._http.get(
      `${this.API_URL}/${model}/Count${whereObjectStr}`,
      this.header
    );
  };

  public updateObject = (object: any, model: string) => {
    return this._http.post(`${this.API_URL}/${model}/Update`, object, this.header);
  };

  public deleteObject = (model: string, id: number) => {
    return this._http.delete(`${this.API_URL}/${model}/Delete/${id}`, this.header);
  };
}
