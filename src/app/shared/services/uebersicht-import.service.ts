import { Injectable } from '@angular/core';
import {ImpPhylibServ} from './impformenphylib.service';
import { UebersichtImport } from 'src/app/shared/interfaces/uebersicht-import';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  parse } from 'date-fns';
import { DataAbiotik } from 'src/app/shared/interfaces/data-abiotik';



@Injectable({
  providedIn: 'root'
})
/**
 * Service zur Verwaltung von Importübersichten und zugehörigen Datenoperationen.
 * 
 * Der `UebersichtImportService` bietet Methoden zum Abrufen, Aktualisieren, Löschen und Archivieren von Importübersichten.
 * Er interagiert mit verschiedenen Endpunkten, um Daten zu verwalten und zu verarbeiten.
 * 
 * @class
 * @property {UebersichtImport[]} uebersicht - Array von Importübersichten.
 * @property {any[]} tempdataabiotik - Temporäres Array zur Speicherung von Abiotik-Daten.
 * @property {DataAbiotik[]} dataAbiotik - Array zur Speicherung von Abiotik-Daten.
 * @property {any[]} temp - Temporäres Array zur allgemeinen Datenspeicherung.
 * @property {UebersichtImport} UebersichtImport - Temporäres Objekt zur Speicherung einer Importübersicht.
 * @property {string} apiUrl - Basis-URL für API-Endpunkte.
 * 
 * @constructor
 * @param {HttpClient} httpClient - Angular HttpClient zum Durchführen von HTTP-Anfragen.
 * @param {ImpPhylibServ} impPhylibServ - Service zur Verwaltung von Phylib-Importen.
 * 
 * @method
 * @async
 * @function getBwMstTaxa - Ruft Daten vom 'viewdataabiotik'-Endpunkt unter Verwendung des angegebenen 'komp'-Parameters ab.
 * @param {number} komp - Der Parameter, der als 'id' in der HTTP-Anfrage gesendet wird.
 * @autor Dr. Jens Päzolt, Umweltsoft
	 */
export class UebersichtImportService {
  uebersicht:UebersichtImport[];
  tempdataabiotik:any=[];
  dataAbiotik:DataAbiotik[]=[];
  temp:any=[];
  private UebersichtImport:UebersichtImport  = {} as UebersichtImport;
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,private impPhylibServ: ImpPhylibServ) { }

  /**
     * Ruft Daten vom 'viewdataabiotik'-Endpunkt unter Verwendung des angegebenen 'komp'-Parameters ab.
     * 
     * @param {number} komp - Der Parameter, der als 'id' in der HTTP-Anfrage gesendet wird.
     * @returns {Promise<any>} - Ein Promise, das die abgerufenen Daten auflöst.
     * @throws Wird einen Fehler auslösen, wenn die HTTP-Anfrage fehlschlägt.
     */
   async getBwMstTaxa(komp: number): Promise<any> {
      let params = new HttpParams().set('id', komp);
      
      try {
          return await this.httpClient.get(`${this.apiUrl}/viewdataabiotik`, { params }).toPromise();
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
  }


  /**
   * Aktualisiert die Importdaten mit den angegebenen Parametern.
   *
   * @param anzahlmst - Die Anzahl der Master-Datensätze.
   * @param anzahlwerte - Die Anzahl der Werte.
   * @param bemerkung - Eine Bemerkung oder ein Kommentar.
   * @param id_imp - Die Import-ID.
   * 
   * @returns void
   */
  aktualisiereImportdaten(anzahlmst:number,anzahlwerte:number,bemerkung:string,id_imp:number){

    const body = new HttpParams()
    .set('id_imp',id_imp)
    .set('bemerkung',bemerkung)
    .set('anzahlwerte',anzahlwerte)
    .set('anzahlmst',anzahlmst)
   
    this.httpClient.post(`${this.apiUrl}/updateArchivImport`, body).subscribe(resp => {
   console.log("response %o, ", resp);  });

  }
  /**
   * Konvertiert eine Zeichenfolgen-Darstellung eines Datums in ein Date-Objekt basierend auf dem angegebenen Datumsformat.
   *
   * @param importiert - Die Zeichenfolgen-Darstellung des zu konvertierenden Datums.
   * @param dateFormat - Das Format der Datumszeichenfolge.
   * @returns Das aus der Zeichenfolge geparste Date-Objekt.
   */
  
  StringToDate(importiert: string,dateFormat:string): Date {
    // const dateFormat = 'dd.MM.yy HH:mm';
    // const importDate = 
    return parse(importiert, dateFormat, new Date());
    // const currentDate = new Date();
//     const weeksDifference = differenceInWeeks(currentDate, importDate);
// console.log(weeksDifference);
//     return weeksDifference < 2;
}

/**
 * Startet den Prozess, indem die notwendigen Methoden nacheinander aufgerufen werden.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Prozess abgeschlossen ist.
 */
async start() {
  // this.callUebersicht2();

  await this.callUebersicht();
  await this.handle(false);
  // console.log(this.uebersicht);
}


/**
 * Ruft asynchron die Methode `getimpUebersicht` aus dem `impPhylibServ`-Service auf
 * und weist das Ergebnis der Eigenschaft `temp` zu.
 *
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
 */
 async callUebersicht(){

  await this.impPhylibServ.getimpUebersicht().forEach(formen_ => {
    this.temp  = formen_;
    // console.log(formen_);
  });
 }

/**
 * Löscht Daten aus der MstAbundanz-Tabelle basierend auf der angegebenen Import-ID.
 *
 * @param {number} id_imp - Die ID des Imports, für den die Daten gelöscht werden sollen.
 * @returns {void}
 */

 loescheDatenMstAbundanz(id_imp:number){
 
    const body = new HttpParams()
   .set('id_imp',id_imp)
   
  
   this.httpClient.post(`${this.apiUrl}/deleteMstAbundanz`, body).subscribe(resp => {
  console.log("response %o, ", resp);  });
  }
  /**
     * Löscht die MstBewertungen-Daten für die angegebene Import-ID.
     *
     * @param {number} id_imp - Die ID des Imports, für den die MstBewertungen-Daten gelöscht werden sollen.
     * @returns {void}
     */
  loescheDatenMstBewertungen(id_imp:number){
 
    const body = new HttpParams()
   .set('id_imp',id_imp)
   
  
   this.httpClient.post(`${this.apiUrl}/deleteMstBewertungen`, body).subscribe(resp => {
  console.log("response %o, ", resp);  });
  }
 
/**
 * Generiert eine neue Import-ID basierend auf der maximal vorhandenen Import-ID im angegebenen Array.
 *
 * @param {UebersichtImport[]} uebersichtImport - Ein Array von UebersichtImport-Objekten.
 * @returns {number} - Die neue Import-ID, die um eins größer ist als die aktuelle maximale Import-ID.
 */
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
/**
 * Ruft die Methode `getimpUebersicht` aus dem `impPhylibServ`-Service auf und abonniert deren Observable.
 * Die Antwort wird der Eigenschaft `temp` zugewiesen.
 *
 * @bemerkungen
 * Diese Methode wird verwendet, um eine Übersicht abzurufen und in der Eigenschaft `temp` zu speichern.
 */

callUebersicht2(){

  this.impPhylibServ.getimpUebersicht().subscribe(arten_ => {
    this.temp = arten_;
    //console.log(this.arten);
    //return einheiten;
  });
}


/**
 * Verarbeitet das `temp`-Array und aktualisiert das `uebersicht`-Array.
 * 
 * @param {boolean} checked - Ein Flag, das angibt, ob die Anzahl der Elemente in `uebersicht` begrenzt werden soll.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Verarbeitung abgeschlossen ist.
 * 
 * Die Funktion führt die folgenden Schritte aus:
 * 1. Löscht das `uebersicht`-Array.
 * 2. Iteriert über das `temp`-Array und ordnet jedes Element einem neuen Objekt mit spezifischen Eigenschaften zu.
 * 3. Konvertiert die `importiert`-Datumszeichenfolge in ein Date-Objekt mit `StringToDate`.
 * 4. Fügt das neue Objekt dem `uebersicht`-Array hinzu.
 * 5. Sortiert das `uebersicht`-Array nach `datumimport` in absteigender Reihenfolge.
 * 6. Wenn `checked` false ist, wird das `uebersicht`-Array auf die ersten 6 Elemente begrenzt.
 */
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
/**
 * Ruft Daten für BwMstTaxa basierend auf der angegebenen Import-ID ab und verarbeitet sie.
 * 
 * Diese Methode löscht die vorhandenen `tempdataabiotik` und `dataAbiotik` Arrays,
 * ruft neue Daten mit der Methode `getBwMstTaxa` ab und verarbeitet jedes Element,
 * um das `dataAbiotik` Array mit formatierten Daten zu füllen.
 * 
 * @param {number} impID - Die Import-ID, die verwendet wird, um die BwMstTaxa Daten abzurufen.
 * @returns {Promise<any>} Ein Promise, das aufgelöst wird, wenn das Abrufen und Verarbeiten der Daten abgeschlossen ist.
 * @throws Wird einen Fehler auslösen, wenn es ein Problem beim Abrufen der Daten gibt.
 */

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

/**
 * Archiviert eine neue Importübersicht, indem eine POST-Anfrage an den Server gesendet wird.
 *
 * @param {UebersichtImport} uebersichtImport - Das Importübersichtsobjekt, das die zu archivierenden Details enthält.
 * @returns {Promise<string>} - Ein Promise, das den Antworttext des Servers auflöst.
 * @throws {Error} - Wirft einen Fehler, wenn die POST-Anfrage fehlschlägt.
 */
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
