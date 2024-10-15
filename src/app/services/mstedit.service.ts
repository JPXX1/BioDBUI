import { Injectable } from '@angular/core';
import {AnzeigenMstUebersichtService} from 'src/app/services/anzeigen-mst-uebersicht.service';
import {MstMitExpertenurteil} from 'src/app/interfaces/mst-mit-expertenurteil';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MsteditService {
public mstMitExpertenurteil:MstMitExpertenurteil[]=[];
private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient,private anzeigenMstUebersichtService:AnzeigenMstUebersichtService) { }


  public async fetchDataFromDb(komp:number): Promise<MstMitExpertenurteil[]> {
    // Die Methode erwartet eine HTTP-Anfrage oder kann Daten direkt aus einem Array verarbeiten
    await this.anzeigenMstUebersichtService.callBwUebersicht(komp);
   
    const dbMPUebersichtMst = await this.anzeigenMstUebersichtService.dbMPUebersichtMst; // asynchrone Methode
//console.log(dbMPUebersichtMst);
    // Mapping der Daten auf das Interface
    return dbMPUebersichtMst.map((data: any) => ({
      wkName: data.wkName,                        // wk.wk_name
      id_wk: data.id_wk,                          // wk.id_wk
      id: data.id,                                // da.id
      parameter: data.parameter,                  // para.parameter
      idMst: data.idMst,                         // mst.id_mst
      namemst: data.namemst,             // mst.namemst + ' (*)'
      repraesent: data.repraesent,                // mst.repraesent
      idKomp: data.idKomp,                       // para.id_komp
      komponente: data.komponente,                // tk.komponente
      idImport: data.idImport,                   // da.id_import
      jahr: data.jahr,                            // to_char(da.datum, 'YYYY')
      letzteAenderung: data.letzteAenderung,     // to_char(da.changed, 'dd.mm.YY')
      idEinh: data.idEinh,                       // da.id_einh
      firma: data.firma,                          // p.firma
      wert: data.wert,                            // da.wert
      expertenurteil: data.expertenurteil,        // de.expertenurteil
      begruendung: data.begruendung,              // de.begruendung
      expertenurteilChanged: new Date(data.expertenurteil_changed), // de.changed
      idNu: data.idNu,                // de.id_nu
      ausblenden:data.ausblenden      //ausblenden der Daten=true
    }));
  }

  // async fetchDataFromDbWK(komp:number): Promise<MstMitExpertenurteil[]> {
  //   // Die Methode erwartet eine HTTP-Anfrage oder kann Daten direkt aus einem Array verarbeiten
  //   //await this.anzeigenMstUebersichtService.getBwWKUebersicht(komp);
   
  //   const dbMPUebersichtMst =  await this.anzeigenMstUebersichtService.getBwWKUebersicht(komp);
  //   //await this.anzeigenMstUebersichtService.dbMPUebersichtMst; // asynchrone Methode
  //     console.log(dbMPUebersichtMst);
  //   // Mapping der Daten auf das Interface
  //   return dbMPUebersichtMst.map((data: any) => ({
  //     wkName: data.wk_ame,                        // wk.wk_name
  //     id_wk: data.id_wk,                          // wk.id_wk
  //     id: data.id,                                // da.id
  //     // parameter: data.parameter,                  // para.parameter
  //     idMst: data.idMst,                         // mst.id_mst
  //     namemst: data.namemst,             // mst.namemst + ' (*)'
  //     repraesent: data.repraesent,                // mst.repraesent
  //     idKomp: data.idKomp,                       // para.id_komp
  //     // komponente: 'f',                // tk.komponente
  //     // idImport: data.idImport,                   // da.id_import
  //     jahr: data.jahr,                            // to_char(da.datum, 'YYYY')
  //     // letzteAenderung: data.letzteAenderung,     // to_char(da.changed, 'dd.mm.YY')
  //     // idEinh: data.idEinh,                       // da.id_einh
  //     // firma: data.firma,                          // p.firma
  //     wert: data.avg_final_wert,                            // da.avg_final_wert
  //     expertenurteil: data.expertenurteil,        // de.expertenurteil
  //     begruendung: data.begruendung,              // de.begruendung
  //     expertenurteilChanged: new Date(data.expertenurteil_changed), // de.changed
  //     idNu: data.idNu,                // de.id_nu
  //     ausblenden:data.ausblenden      //ausblenden der Daten=true
  //   }));
  // }
/**
 * Diese Methode filtert die Bewertung der Wasserkörperübersicht basierend auf den ausgewählten Wasserkörpern und dem angegebenen Zeitraum.
 * 
 * @param komp - Die ID der Komponente (z.B. Wasserkörperkomponente).
 * @param selectedWasserkorper - Ein Array der ausgewählten Wasserkörper-IDs.
 * @param yearFrom - Das Startjahr des Zeitraums als String.
 * @param yearTo - Das Endjahr des Zeitraums als String.
 * @returns Eine Promise, die eine Liste von MstMitExpertenurteil-Objekten zurückgibt, die den Filterkriterien entsprechen.
 */
async fetchDataFromDbWK(
  komp: number, 
  selectedWasserkorper: any[], 
  yearFrom: string, 
  yearTo: string
): Promise<MstMitExpertenurteil[]> {

  // Abruf der Daten aus dem Service
  const dbMPUebersichtMst = await this.anzeigenMstUebersichtService.getBwWKUebersicht(komp);
  console.log(dbMPUebersichtMst);

  // Filtern nach ausgewählten Wasserkörpern (id_wk) und Jahrbereich
  const filteredData = dbMPUebersichtMst.filter((data: any) => {
    const dataYear = data.jahr;  // Jahr als Text
    const yearMatches = dataYear === yearTo.toString(); // Vergleich mit dem vorgegebenen Jahr
    const inSelectedWasserkorper = selectedWasserkorper.length === 0 || selectedWasserkorper.includes(data.id_wk);
    console.log(`Data Year: ${dataYear}, YearTo: ${yearTo}, Year Matches: ${yearMatches}`);
  console.log(`Selected Wasserkörper: ${selectedWasserkorper}, ID WK: ${data.id_wk}, In Selected WK: ${inSelectedWasserkorper}`);


    return yearMatches && inSelectedWasserkorper;
  });

  // Mapping der gefilterten Daten auf das Interface
  return filteredData.map((data: any) => ({
    wkName: data.wk_name,                        // wk.wk_name
    id_wk: data.id_wk,                          // wk.id_wk
    id: data.id,                                // da.id
    idMst: data.id_mst,                          // mst.id_mst
    namemst: data.namemst,                      // mst.namemst + ' (*)'
    // repraesent: data.repraesent,                // mst.repraesent
    // idKomp: data.idKomp,                        // para.id_komp
    jahr: data.jahr,                            // to_char(da.datum, 'YYYY')
    wert: data.avg_final_wert,                  // da.avg_final_wert
    expertenurteil: data.expertenurteil,        // de.expertenurteil
    begruendung: data.begruendung             // de.begruendung
    // expertenurteilChanged: new Date(data.expertenurteil_changed), // de.changed
    // idNu: data.idNu,                            // de.id_nu
    // ausblenden: false                 // ausblenden der Daten=true
  }));
}

//speichert das Expertenurteil der Messstelle
async saveData(mstMitExpertenurteil: MstMitExpertenurteil): Promise<any> {

  
  const body = new HttpParams()
    .set('id', mstMitExpertenurteil.id)
    .set('begruendung', mstMitExpertenurteil.begruendung)
    .set('expertenurteil', mstMitExpertenurteil.expertenurteil)
    .set('ausblenden', String(!!mstMitExpertenurteil.ausblenden));
  try {
    const response = await this.httpClient.post<any>(`${this.apiUrl}/addOrUpdateExpertUrteilMst`, body).toPromise();
    console.log("Response: ", response);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw error; // Fehler behandeln oder weiterwerfen
  }
}

//speichert das Expertenurteil der Messstelle
async saveDataWK(mstMitExpertenurteil: MstMitExpertenurteil): Promise<any> {

  
  const body = new HttpParams()
    .set('id', mstMitExpertenurteil.id)
    .set('begruendung', mstMitExpertenurteil.begruendung)
    .set('expertenurteil', mstMitExpertenurteil.expertenurteil)
    .set('ausblenden', String(!!mstMitExpertenurteil.ausblenden));
  try {
    const response = await this.httpClient.post<any>(`${this.apiUrl}/addOrUpdateExpertUrteilWK`, body).toPromise();
    console.log("Response: ", response);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw error; // Fehler behandeln oder weiterwerfen
  }
}
async saveDataAbiotik(id:number,ausblenden:boolean,id_mst: number): Promise<any> {

  
  const body = new HttpParams()
    .set('id', id)
    .set('ausblenden', String(!!ausblenden))
    .set('id_mst', id_mst)
   
    ;
  try {
    const response = await this.httpClient.post<any>(`${this.apiUrl}/UpdateDataAbiotik`, body).toPromise();
    console.log("Response: ", response);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw error; // Fehler behandeln oder weiterwerfen
  }
}

}
