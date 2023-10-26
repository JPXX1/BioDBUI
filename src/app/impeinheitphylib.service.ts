import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpFormsPhylibServ {
  public baseUrl = "http://localhost:3000/impformsphylib";

  constructor(private httpClient: HttpClient) { }

  public getFormen(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }
}
