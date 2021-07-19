import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { environment } from '../../../environments/environment';

export interface FilterObject {
  where?: any;
  take: number;
  limit: number;
  and: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient, private _auth: AuthService) {}

  API_URL = environment.apiUrl;

  private header = {
    headers: { Authorization: 'Bearer ' + this._auth.getAuth().token },
  };

  public getObject = (id: number, model: string) => {
    return this._http.get(`${this.API_URL}/${model}/${id}`, this.header);
  };

  public createObject = (object: any, model: string) => {
    return this._http.post(`${this.API_URL}/${model}`, object, this.header);
  };

  public getObjects = (model: string, filterObject?: any) => {
    let params: any = {};
    if (filterObject) params.filter = JSON.stringify(filterObject);
    return this._http.get(`${this.API_URL}/${model}`, {
      ...this.header,
      params,
    });
  };
  public count = (model: string, whereObject?: any) => {
    let params: any = {};
    if (whereObject) params.where = JSON.stringify(whereObject);
    return this._http.get(`${this.API_URL}/${model}/count`, {
      ...this.header,
      params,
    });
  };

  public updateObject = (
    object: { id?: number; [key: string]: any },
    model: string
  ) => {
    return this._http.patch(
      `${this.API_URL}/${model}/${object.id}`,
      object,
      this.header
    );
  };
  public updateObjects = (object: any, model: string, whereObject?: any) => {
    let params: any = {};
    if (whereObject) params.where = JSON.stringify(whereObject);
    return this._http.patch(`${this.API_URL}/${model}`, object, {
      ...this.header,
      params,
    });
  };

  public deleteObject = (model: string, id: number) => {
    return this._http.delete(
      `${this.API_URL}/${model}/Delete/${id}`,
      this.header
    );
  };
}
