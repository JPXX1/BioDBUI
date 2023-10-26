import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpFormsPhylibServ {
  public baseUrl = "http:///127.0.0.0:3000/impformsphylib";

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }
}