import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Messwerte } from '../interfaces/messwerte';

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




      kontrollPhylibMesswerte(MessDataImp:Messwerte,datum:string,Probenehmer:string,id_import:string){
        let params = new HttpParams()  .set('id_taxon',MessDataImp._Taxon)
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
        .set('wert',MessDataImp._Messwert);;
        //console.log(MessDataImp)
      //  return this.httpClient.get('http://localhost:3000/kontrollPhylibMesswerte',paras);  
       return this.httpClient.get('http://localhost:3000/kontrollPhylibMesswerte', {params});   
      }

       getArtenPhylibMP(parameter :number){ 
        //const headers = new HttpHeaders().append('header', 'value');
        //const params = new HttpParams().append('id', parameter);
        let params = new HttpParams().set('id',parameter);
        console.log(params.toString())
        //const params: { id: 1 };
        return this.httpClient.get('http://localhost:3000/impArten', {params});
        }
        
        

        postMessstellenPhylib(MessDataImp:Messwerte, datum:string,Probenehmer:string,id_import:string){

         
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