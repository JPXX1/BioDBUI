import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpPhylibServ {
 
  constructor(private httpClient: HttpClient) { }

  getFormen(){ 
  
 return this.httpClient.get('http://localhost:3000/impformenphylib');
    

    
  }
  getEinheiten(){ 
  
    return this.httpClient.get('http://localhost:3000/impeinheitenphylib');
       
   
       
     }
     getMst(){ 
  
      return this.httpClient.get('http://localhost:3000/impMst');
         
     
         
       }
       getArtenPhylibMP(){ 
  
        return this.httpClient.get('http://localhost:3000/impArten');
           
       
           
         }
}