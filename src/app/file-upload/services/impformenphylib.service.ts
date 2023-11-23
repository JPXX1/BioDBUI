import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpPhylibServ {
 
  constructor(private httpClient: HttpClient) { }

  getFormen(){ 
  
 return this.httpClient.get('http://localhost:3000/impformenphylib');
    

    
  }

  getTiefen(){

    //var temp=this.httpClient.get('http://localhost:3000/imptiefenphylib');
    return this.httpClient.get('http://localhost:3000/imptiefenphylib');
    
  }
  getEinheiten(){ 
  
    return this.httpClient.get('http://localhost:3000/impeinheitenphylib');
       
   
       
     }
     getMst(){ 
      // return this.httpClient.get('http://localhost:3000/imptiefenphylib');
      return this.httpClient.get('http://localhost:3000/impMst');
         
     
         
       }

       getArtenPhylibMPtets() {

              return this.httpClient.get('http://localhost:3000/impArten2');}


       getArtenPhylibMP(parameter :number){ 
        //const headers = new HttpHeaders().append('header', 'value');
        //const params = new HttpParams().append('id', parameter);
        let params = new HttpParams().set('id',parameter);
        console.log(params.toString())
        //const params: { id: 1 };
        return this.httpClient.get('http://localhost:3000/impArten', {params});
        }
}