import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Messwerte } from '../interfaces/messwerte';
import { Observable,throwError } from 'rxjs';
import { environment } from '../../environments/environment';

import { MessstellenImp } from '../interfaces/messstellen-imp';
@Injectable({
  providedIn: 'root'
})
export class ImpPhylibServ {
  private apiUrl = environment.apiUrl;
  myVariable: any;
  constructor(private httpClient: HttpClient) { }
 
  getFormen(){ 
    return this.httpClient.get(`${this.apiUrl}/impformenphylib`);
//  return this.httpClient.get('${this.apiUrl}/impformenphylib');
    

    
  }

  getTiefen(){

    //var temp=this.httpClient.get('${this.apiUrl}/imptiefenphylib');
    return this.httpClient.get(`${this.apiUrl}/imptiefenphylib`);
    
  }
  getEinheiten(){ 
  
    return this.httpClient.get(`${this.apiUrl}/impeinheitenphylib`);
       
   
       
     }
     getMst(): Observable<any>{ 
      // return this.httpClient.get('${this.apiUrl}/imptiefenphylib');
      return this.httpClient.get(`${this.apiUrl}/impMst`);
         
     
        
       }

       getimpUebersicht(){
        return this.httpClient.get(`${this.apiUrl}/impUebersicht`);
       }
       getProbenehmer(){
        return this.httpClient.get(`${this.apiUrl}/impProbenehmer`);
        
       }
       getJahr(){
        return this.httpClient.get(`${this.apiUrl}/impJahr`);
        
       }
       getArtenPhylibMPtets() {

              return this.httpClient.get(`${this.apiUrl}/impArten2`);}
      getParameterAbiot() {

                return this.httpClient.get(`${this.apiUrl}/impParaAbiot`);}


  
      kontrollPhylibMesswerte2(datum:string,Probenehmer:string): Observable<any>{
                let params = new HttpParams()
                .set('id_pn',(Probenehmer))
                .set('datumpn',datum)       
           ;
               
              return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMesswerte2`, {params: params}); 
              
              }
      kontrollPhylibMessstellen(datum:string,Probenehmer:string): Observable<any>{
                let params = new HttpParams()
                .set('id_pn',(Probenehmer))
                .set('datum',datum)       
           ;
               
         return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMessstellen`, {params: params}); 
              
              }
      kontrollPhylibMesswerte(MessDataImp:Messwerte,datum:string,Probenehmer:string,id_import:string){
        let params = new HttpParams().set('id_taxon',(MessDataImp._Taxon))
        .set('id_einheit',MessDataImp._Einheit)
        .set('id_probe',MessDataImp._Probe)
        .set('id_mst',(MessDataImp._Messstelle))
        .set('id_taxonzus',MessDataImp._Form)
        .set('id_pn',(Probenehmer))
        .set('datumpn',datum)       
        .set('id_import',(id_import))
        .set('id_tiefe',(MessDataImp._Tiefe))
        .set('id_abundanz',(MessDataImp._idAbundanz))
        .set('cf',MessDataImp._cf)
        .set('wert',MessDataImp._Messwert);
       
      return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMesswerte`, {params: params}); 
      
      }
      
      
      

      getvalVerfahren(): Observable<any>{


        return this.httpClient.get(`${this.apiUrl}/valVerfahren`);}

      getvalExceltabs(): Observable<any>{


      return this.httpClient.get(`${this.apiUrl}/valExceltabs`);}
      
      getvalExcelSpalten(): Observable<any>{


        return this.httpClient.get(`${this.apiUrl}/valExcelspalten`);}

       getArtenPhylibMP(parameter :number){ 

        let params = new HttpParams().set('id',parameter);
        // console.log(params.toString())
        //const params: { id: 1 };
        return this.httpClient.get(`${this.apiUrl}/impArten`, {params});
        }
        async  postMessstellenPhylib(MessstellenImp:MessstellenImp,datum:string,Probenehmer:string,id_import):Promise<string> {
          let url=`${this.apiUrl}/insertPhylibMessstellen`;
     
          
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                "Content-Type": "text/plain"
              },
              body: JSON.stringify({
                id_mst: MessstellenImp.id_mst,
                id_para: MessstellenImp.id_para,
                id_import: id_import,
                id_pn: Probenehmer,
                datum: datum,
                id_einh:MessstellenImp.id_einh,
                wert:MessstellenImp.wert
              })    
            //this.messstellenImp[i], jahrtemp, probenehmer,this.uebersichtImport.id_imp
            });
            return await response.text();
          } catch (error) {
            console.error('Error posting data:', error);
            throw error;
            return  "Fehler";
          }
        }
  
        

        

      async  postMesswertePhylib(MessDataImp:Messwerte, datum:string,Probenehmer:string,id_import:number) :Promise<number>{
        let url=`${this.apiUrl}/insertPhylibMesswerte`;
        let bodytext;
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
             "Content-Type": "text/plain"// bodytext
            },
            body: JSON.stringify({
              id_taxon: MessDataImp._Taxon,
              id_einheit: MessDataImp._Einheit,
              id_probe: MessDataImp._Probe,
              id_mst: MessDataImp._Messstelle,
              id_taxonzus: MessDataImp._Form,
              id_pn: Probenehmer,
              datumpn: datum,
              id_import: id_import,
              id_tiefe: MessDataImp._Tiefe,
              id_abundanz: MessDataImp._idAbundanz,
              cf: MessDataImp._cf,
              wert: MessDataImp._Messwert
            })    
          
          }).then(allies => (bodytext=allies.status));
          // bodytext=response.text();
          console.log(bodytext)
          return await bodytext;
        } catch (error) {
          console.error('Error posting data:', error);
          throw error;
          return  500;
        }
      }
       
              
        
}