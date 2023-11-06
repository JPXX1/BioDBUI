import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpFormsPhylibServ {
 
  constructor(private httpClient: HttpClient) { }

  getFormen(){ 
  
 return this.httpClient.get('http://localhost:3000/impformsphylib');
    

    
  }
}