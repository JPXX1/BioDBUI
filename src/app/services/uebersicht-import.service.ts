import { Injectable } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {  parse } from 'date-fns';
import { DataAbiotik } from '../interfaces/data-abiotik';



@Injectable({
  providedIn: 'root'
})
export class UebersichtImportService {
  uebersicht:UebersichtImport[];
  tempdataabiotik:any=[];
  dataAbiotik:DataAbiotik[]=[];
  temp:any=[];
  private UebersichtImport:UebersichtImport  = {} as UebersichtImport;
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,private impPhylibServ: ImpPhylibServ) { }

   async getBwMstTaxa(komp: number): Promise<any> {
      let params = new HttpParams().set('id', komp);
      
      try {
          return await this.httpClient.get(`${this.apiUrl}/viewdataabiotik`, { params }).toPromise();
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
  }


  aktualisiereImportdaten(anzahlmst:number,anzahlwerte:number,bemerkung:string,id_imp:number){

    const body = new HttpParams()
    .set('id_imp',id_imp)
    .set('bemerkung',bemerkung)
    .set('anzahlwerte',anzahlwerte)
    .set('anzahlmst',anzahlmst)
   
    this.httpClient.post(`${this.apiUrl}/updateArchivImport`, body).subscribe(resp => {
   console.log("response %o, ", resp);  });

  }
  StringToDate(importiert: string,dateFormat:string): Date {
    // const dateFormat = 'dd.MM.yy HH:mm';
    // const importDate = 
    return parse(importiert, dateFormat, new Date());
    // const currentDate = new Date();
//     const weeksDifference = differenceInWeeks(currentDate, importDate);
// console.log(weeksDifference);
//     return weeksDifference < 2;
}
 async start() {
// this.callUebersicht2();

  await this.callUebersicht();
  await this.handle(false);
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


async handle(checked: boolean) {
  this.uebersicht = [];
  // console.log(this.temp);
  await Promise.all(
      this.temp.map(async (f) => {
         
              this.uebersicht.push({
                  dateiname: f.dateiname,
                  verfahren: f.verfahren,
                  komponente: f.komponente,
                  importiert: f.importiert,
                  datumimport: this.StringToDate(f.importiert,'dd.MM.yy HH:mm'),
                  jahr: f.jahr,
                  probenehmer: f.firma,
                  anzahlmst: f.anzahlmst,
                  anzahlwerte: f.anzahlwerte,
                  bemerkung: f.bemerkung,
                  id_pn: f.id_pn,
                  id_imp: f.id_imp,
                  id_verfahren: f.id_verfahren,
                  import_export: f.import_export,
                  id_komp: f.id_komp
              });
          }
      ));
  
      this.uebersicht.sort((a, b) => b.datumimport.getTime() - a.datumimport.getTime());
if (checked===false){this.uebersicht=this.uebersicht.slice(0,6);}
}
async callgetBwMstTaxa(impID: number): Promise<any> {
  this.tempdataabiotik = [];
  this.dataAbiotik = [];
    try {
        this.tempdataabiotik = await this.getBwMstTaxa(impID);
        
        await Promise.all(
            this.tempdataabiotik.map(async (f) => {
                this.dataAbiotik.push({
                    wk_name: f.wk_name,
                    id_import: f.id_import,
                    namemst: f.namemst,
                    id: f.id,
                    id_wk: f.id_wk,
                    parameter: f.parameter,
                    jahr: f.jahr,
                    letzte_aenderung: this.StringToDate(f.letzte_aenderung ,'dd.MM.yy'),
                    einheit: f.einheit,
                    wert: f.wert
                });
            })
        );

        // this.uebersicht.sort((a, b) => b.datumimport.getTime() - a.datumimport.getTime());
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
    //console.log(this.tempdataabiotik);
    }

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
