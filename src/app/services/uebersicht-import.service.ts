import { Injectable } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UebersichtImportService {
  uebersicht:UebersichtImport[];
  temp:any=[];
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,private impPhylibServ: ImpPhylibServ) { }

  aktualisiereImportdaten(anzahlmst:number,anzahlwerte:number,bemerkung:string,id_imp:number){

    const body = new HttpParams()
    .set('id_imp',id_imp)
    .set('bemerkung',bemerkung)
    .set('anzahlwerte',anzahlwerte)
    .set('anzahlmst',anzahlmst)
   
    this.httpClient.post(`${this.apiUrl}/updateArchivImport`, body).subscribe(resp => {
   console.log("response %o, ", resp);  });

  }
 async start() {
// this.callUebersicht2();

  await this.callUebersicht();
  await this.handle();
  // console.log(this.uebersicht);
 }


 async callUebersicht(){

  await this.impPhylibServ.getimpUebersicht().forEach(formen_ => {
    this.temp  = formen_;
    // console.log(formen_);
  });
 }

 loescheDatenMstAbundanz(id_imp:number){
 
    const body = new HttpParams()
   .set('id_imp',id_imp)
   
  
   this.httpClient.post(`${this.apiUrl}/deleteMstAbundanz`, body).subscribe(resp => {
  console.log("response %o, ", resp);  });
  }
  loescheDatenMstBewertungen(id_imp:number){
 
    const body = new HttpParams()
   .set('id_imp',id_imp)
   
  
   this.httpClient.post(`${this.apiUrl}/deleteMstBewertungen`, body).subscribe(resp => {
  console.log("response %o, ", resp);  });
  }
 
 neueImportid(uebersichtImport:UebersichtImport[]):number{
  let UebersichtImport:UebersichtImport;
let max:number=Number(uebersichtImport[0].id_imp);


  for (let a = 0, le = uebersichtImport.length; a < le; a += 1) {
if (max<Number(uebersichtImport[a].id_imp)){
  max=Number(uebersichtImport[a].id_imp);}


  }

console.log(max)
let max2=Number(max)+1;
  return max2;
 }
callUebersicht2(){

  this.impPhylibServ.getimpUebersicht().subscribe(arten_ => {
    this.temp = arten_;
    //console.log(this.arten);
    //return einheiten;
  });
}


async handle(){
  this.uebersicht=[];
  await Promise.all(
  this.temp.map(async (f) => {
            
      
   

    //erzeugt Array mit WK
    
      this.uebersicht.push({ dateiname:f.dateiname,
        verfahren: f.verfahren,
        komponente:f.komponente,
        importiert:f.importiert,
        jahr:f.jahr,
        probenehmer:f.firma,
        anzahlmst:f.anzahlmst,
        anzahlwerte:f.anzahlwerte,
        bemerkung:f.bemerkung,
        id_pn:f.id_pn,
        id_imp:f.id_imp,
      id_verfahren:f.id_verfahren,
      import_export:f.import_export,
      id_komp:f.id_komp
    });
     
})
)
//console.log (this.wkarray);

}
// archiviereNeueImportUebersicht(uebersichtImport:UebersichtImport){
//   const body = new HttpParams()
//  .set('id_imp',uebersichtImport.id_imp)
//  .set('dateiname', uebersichtImport.dateiname)
//  .set('id_komp',uebersichtImport.id_komp)

//  .set('anzahlmst',uebersichtImport.anzahlmst)
//  .set('anzahlwerte',uebersichtImport.anzahlwerte)

//  .set('id_verfahren',uebersichtImport.id_verfahren)
//  .set('bemerkung',uebersichtImport.bemerkung)
//  .set('jahr',uebersichtImport.jahr)
//  .set('id_pn',uebersichtImport.id_pn)

//  this.httpClient.post('http://localhost:3000/api/insertArchivImport', body).subscribe(resp => {
// console.log("response %o, ", resp);  });
// }

async  archiviereNeueImportUebersicht(uebersichtImport:UebersichtImport):Promise<string> {
  let url=`${this.apiUrl}/insertArchivImport`;

  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        id_imp:uebersichtImport.id_imp,
        dateiname: uebersichtImport.dateiname,
        id_komp:uebersichtImport.id_komp,
       
        anzahlmst:uebersichtImport.anzahlmst,
        anzahlwerte:uebersichtImport.anzahlwerte,
       
        id_verfahren:uebersichtImport.id_verfahren,
        bemerkung:uebersichtImport.bemerkung,
        jahr:uebersichtImport.jahr,
        id_pn:uebersichtImport.id_pn
      })    
    
    });
    return await response.text();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
    return  "Fehler";
  }
}

  //INSERT INTO public.ar_import (id_imp, dateiname, id_komp, anzahlmst, anzahlwerte, importiert, id_verfahren, bemerkung, jahr, id_pn) VALUES(0, '', 0, 0, 0, now(), 0, '', '', 0);
  
 
}
