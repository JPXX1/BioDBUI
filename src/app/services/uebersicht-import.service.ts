import { Injectable } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UebersichtImportService {
  uebersicht:UebersichtImport[];
  temp:any=[];
  constructor(private httpClient: HttpClient,private impPhylibServ: ImpPhylibServ) { }


 async start() {
// this.callUebersicht2();

  await this.callUebersicht();
  await this.handle();
  console.log(this.uebersicht);
 }


 async callUebersicht(){

  await this.impPhylibServ.getimpUebersicht().forEach(formen_ => {
    this.temp  = formen_;
    console.log(formen_);
  });
 }


 neueImportid(uebersichtImport:UebersichtImport[]):number{
  let UebersichtImport:UebersichtImport;
let max:number=uebersichtImport[0].id_imp;


  for (let a = 0, le = uebersichtImport.length; a < le; a += 1) {
if (max<uebersichtImport[a].id_imp){
  max=uebersichtImport[a].id_imp;}


  }

console.log(max)
max=max+1;
  return max;
 }
callUebersicht2(){

  this.impPhylibServ.getimpUebersicht().subscribe(arten_ => {
    this.temp = arten_;
    //console.log(this.arten);
    //return einheiten;
  });
}

//  handl2(){
//   this.uebersicht=[];
//   for (let a = 0, le = this.temp.length; a < le; a += 1) {
    
//     this.uebersicht.push({ dateiname:this.temp[a].dateiname,
//       verfahren: this.temp[a].verfahren,
//       komponente:this.temp[a].komponente,
//       importiert:this.temp[a].importiert,
//       jahr:this.temp[a].jahr,
//       probenehmer:this.temp[a].firma,
//       anzahlmst:this.temp[a].anzahlmst,
//       anzahlwerte:this.temp[a].anzahlwerte,
//       bemerkung:this.temp[a].bemerkung,
//       id_pn:this.temp[a].id_pn,
//       id_imp:this.temp[a].id_imp,
//     id_verfahren:this.temp[a].id_verfahren,
//     import_export:this.temp[a].import_export,
//     id_komp:this.temp[a].id_komp
//   });

//   }
//  }
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
        probenehmer:f.probenehmer,
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
archiviereNeueImportUebersicht(uebersichtImport:UebersichtImport){
  const body = new HttpParams()
 .set('id_imp',uebersichtImport.id_imp)
 .set('dateiname', uebersichtImport.dateiname)
 .set('id_komp',uebersichtImport.id_komp)

 .set('anzahlmst',uebersichtImport.anzahlmst)
 .set('anzahlwerte',uebersichtImport.anzahlwerte)

 .set('id_verfahren',uebersichtImport.id_verfahren)
 .set('bemerkung',uebersichtImport.bemerkung)
 .set('jahr',uebersichtImport.jahr)
 .set('id_pn',uebersichtImport.id_pn)

 this.httpClient.post('http://localhost:3000/insertArchivImport', body).subscribe(resp => {
console.log("response %o, ", resp);  });
}



  //INSERT INTO public.ar_import (id_imp, dateiname, id_komp, anzahlmst, anzahlwerte, importiert, id_verfahren, bemerkung, jahr, id_pn) VALUES(0, '', 0, 0, 0, now(), 0, '', '', 0);
  
 
}
