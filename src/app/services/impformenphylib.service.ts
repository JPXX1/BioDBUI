import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Messwerte } from '../interfaces/messwerte';
import { Observable } from 'rxjs';
import { MessstellenImp } from '../interfaces/messstellen-imp';
@Injectable({
  providedIn: 'root'
})
export class ImpPhylibServ {
  myVariable: any;
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
     getMst(): Observable<any>{ 
      // return this.httpClient.get('http://localhost:3000/imptiefenphylib');
      return this.httpClient.get('http://localhost:3000/impMst');
         
     
         
       }

       getimpUebersicht(){
        return this.httpClient.get('http://localhost:3000/impUebersicht');
       }
       getProbenehmer(){
        return this.httpClient.get('http://localhost:3000/impProbenehmer');
        
       }
       getJahr(){
        return this.httpClient.get('http://localhost:3000/impJahr');
        
       }
       getArtenPhylibMPtets() {

              return this.httpClient.get('http://localhost:3000/impArten2');}
      getParameterAbiot() {

                return this.httpClient.get('http://localhost:3000/impParaAbiot');}


  
      kontrollPhylibMesswerte2(datum:string,Probenehmer:string): Observable<any>{
                let params = new HttpParams()
                .set('id_pn',(Probenehmer))
                .set('datumpn',datum)       
           ;
               
              return this.httpClient.get('http://localhost:3000/kontrollPhylibMesswerte2', {params: params}); 
              
              }
      kontrollPhylibMessstellen(datum:string,Probenehmer:string): Observable<any>{
                let params = new HttpParams()
                .set('id_pn',(Probenehmer))
                .set('datum',datum)       
           ;
               
         return this.httpClient.get('http://localhost:3000/kontrollPhylibMessstellen', {params: params}); 
              
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
       
      return this.httpClient.get('http://localhost:3000/kontrollPhylibMesswerte', {params: params}); 
      
      }
      
      
      

      getvalVerfahren(): Observable<any>{


        return this.httpClient.get('http://localhost:3000/valVerfahren');}

      getvalExceltabs(): Observable<any>{


      return this.httpClient.get('http://localhost:3000/valExceltabs');}
      
      getvalExcelSpalten(): Observable<any>{


        return this.httpClient.get('http://localhost:3000/valExcelspalten');}

       getArtenPhylibMP(parameter :number){ 

        let params = new HttpParams().set('id',parameter);
        console.log(params.toString())
        //const params: { id: 1 };
        return this.httpClient.get('http://localhost:3000/impArten', {params});
        }
        
        postMessstellenPhylib(MessstellenImp:MessstellenImp,datum:string,Probenehmer:string,id_import:string){ 
          const body = new HttpParams()
          .set('id_mst',MessstellenImp.id_mst)
          .set('id_para',MessstellenImp.id_para)
          .set('id_import',id_import)
          .set('id_pn',Probenehmer)
          .set('datum',datum)
          .set('id_einh',MessstellenImp.id_einh)
          .set('wert',MessstellenImp.wert);
          

        console.log(MessstellenImp)
        this.httpClient.post('http://localhost:3000/insertPhylibMessstellen', body).subscribe(resp => {
          console.log("response %o, ", resp);
        });     
      }

        
        postMesswertePhylib(MessDataImp:Messwerte, datum:string,Probenehmer:string,id_import:string){

         
            const body = new HttpParams()
          .set('id_taxon',MessDataImp._Taxon)
          .set('id_einheit',MessDataImp._Einheit)
          .set('id_probe',MessDataImp._Probe)
          .set('id_mst',MessDataImp._Messstelle)
          .set('id_taxonzus',MessDataImp._Form)
          .set('id_pn',Probenehmer)
          .set('datumpn',datum)
          .set('id_import',id_import)
          .set('id_tiefe',MessDataImp._Tiefe)
          .set('id_abundanz',MessDataImp._idAbundanz)
          .set('cf',MessDataImp._cf)
          .set('wert',MessDataImp._Messwert);

        
          console.log(MessDataImp)
          this.httpClient.post('http://localhost:3000/insertPhylibMesswerte', body).subscribe(resp => {
            console.log("response %o, ", resp);
          });     
        }
       
        
}