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

        postMessstellenPhylib(MessDataImp:Messwerte, datum:string,Probenehmer:string,id_import:string){

          // INSERT INTO public.data_taxa_abundanzen
          // (id, id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, created, id_import, wert, cf, id_tiefe, id_abundanz)
          // VALUES(nextval('seq_tbl_einzeldaten'::regclass), 0, 0, 0, 0, 0, 0, '', now(), 0, '', false, 0, 0);
          // id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_import,id_tiefe, id_abundanz,cf,wert
            let params = new HttpParams();
          params.set('id_taxon',MessDataImp._Taxon);
          params.set('id_einheit',MessDataImp._Einheit);
          params.set('id_probe',MessDataImp._Probe);
          params.set('id_mst',MessDataImp._Messstelle);
          params.set('id_taxonzus',MessDataImp._Form);
          params.set('id_pn',Probenehmer);
          params.set('datumpn',datum);
          params.set('id_import',id_import);
          params.set('id_tiefe',MessDataImp._Tiefe);
          params.set('id_abundanz',MessDataImp._idAbundanz);
          params.set('cf',MessDataImp._cf);
          params.set('wert',MessDataImp._Messwert);
          return this.httpClient.post('http://localhost:3000/insertPhylibMesswerte', {params});
          
        }
}