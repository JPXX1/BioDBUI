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


  /**
 * Ruft Daten aus der Datenbank ab und mappt sie auf das Interface `MstMitExpertenurteil`.
 *
 * @param {number} komp - Die Komponente, für die die Daten abgerufen werden sollen.
 * @returns {Promise<MstMitExpertenurteil[]>} - Ein Promise, das ein Array von `MstMitExpertenurteil`-Objekten zurückgibt.
 *
 * @example
 * // Beispielaufruf der Methode
 * const daten = await fetchDataFromDb(1);
 * console.log(daten);
 *
 * @throws {Error} - Wenn ein Fehler beim Abrufen der Daten auftritt.
 */
  public async fetchDataFromDb(komp: number,idWkArray: string[],  jahr: string): Promise<MstMitExpertenurteil[]> {
    // Die Methode erwartet eine HTTP-Anfrage oder kann Daten direkt aus einem Array verarbeiten
    await this.anzeigenMstUebersichtService.callBwUebersicht(komp);
  
    const dbMPUebersichtMst = await this.anzeigenMstUebersichtService.dbMPUebersichtMst; // asynchrone Methode
    
    // Filter basierend auf id_wk und jahr
    const filteredData = dbMPUebersichtMst.filter((data: any) => {
      const dataYear = data.jahr; // Jahr aus dem Datum extrahieren
     
      return idWkArray.includes(data.idMst) && dataYear === jahr.toString();
         // Filtern nach id_wk und jahr
    });
  
    // Mapping der gefilterten Daten auf das Interface
    return filteredData.map((data: any) => {
      let expertenurteilChangedDate: Date | null = null;
      const expertenurteil_temp = data.expertenurteilChanged;
      
      // Verarbeite data.expertenurteil_changed, falls vorhanden
      if (expertenurteil_temp) {
        expertenurteilChangedDate = new Date(expertenurteil_temp);
        if (isNaN(expertenurteilChangedDate.getTime())) {
          expertenurteilChangedDate = null;
        }
      }
  
      // Verarbeite data.letzteAenderung, wenn expertenurteilChangedDate null ist
      let letzteAenderungDate: Date;
      // if (!expertenurteilChangedDate && data.letzteAenderung) {
        // Parsen des Strings 'DD.MM.YY'
        const [day, month, year] = data.letzteAenderung.split('.');
        const parsedYear = parseInt(year, 10) + 2000; // Umwandlung von 'YY' zu 'YYYY'
        letzteAenderungDate = new Date(`${parsedYear}-${month}-${day}`);
  
        if (isNaN(letzteAenderungDate.getTime())) {
          letzteAenderungDate = null;
        }else if(letzteAenderungDate<expertenurteilChangedDate){
          letzteAenderungDate=expertenurteilChangedDate;
        }
       
  
      // Datum in 'dd.mm.yy' Format konvertieren, falls gültig (ohne Zeit)
      const formatDate = (date: Date | null): string | null => {
        if (!date) return null;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Nimm nur die letzten 2 Ziffern
        return `${day}.${month}.${year}`;
      };
  
      const letzteAenderungFormatted = formatDate(letzteAenderungDate);
  
      return {
        wkName: data.wkName,                        // wk.wk_name
        id_wk: data.id_wk,                          // wk.id_wk
        id: data.id,                                // da.id
        parameter: data.parameter,                  // para.parameter
        idMst: data.idMst,                          // mst.id_mst
        namemst: data.namemst,                      // mst.namemst + ' (*)'
        repraesent: data.repraesent,                // mst.repraesent
        idKomp: data.idKomp,                        // para.id_komp
        komponente: data.komponente,                // tk.komponente
        idImport: data.idImport,                    // da.id_import
        jahr: data.jahr,                            // Originalwert des Jahres ohne Formatierung
        letzteAenderung: letzteAenderungFormatted,  // Formatierte Anzeige des Datums
        idEinh: data.idEinh,                        // da.id_einh
        firma: data.firma,                          // p.firma
        wert: data.wert,                            // da.wert
        expertenurteil: data.expertenurteil,        // de.expertenurteil
        begruendung: data.begruendung,              // de.begruendung
        expertenurteilChanged: formatDate(expertenurteilChangedDate), // de.changed
        idNu: data.idNu,                            // de.id_nu
        ausblenden: data.ausblenden                 // ausblenden der Daten=true
      };
    });
  }
  
  



 
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
    
//     const yearMatches = dataYear === yearTo.toString(); // Vergleich mit dem vorgegebenen Jahr
//     const inSelectedWasserkorper = selectedWasserkorper.length === 0 || selectedWasserkorper.includes(data.id_wk);
  const dataYear = data.jahr;  // Jahr als Text
  const yearMatches = dataYear === yearTo.toString(); 
  const inSelectedWasserkorper = selectedWasserkorper.length === 0 || selectedWasserkorper.includes(data.id_wk);
    
    console.log(`Data Year: ${dataYear}, YearFrom: ${yearFrom}, YearTo: ${yearTo}, Year Matches: ${yearMatches}`);
    console.log(`Selected Wasserkörper: ${selectedWasserkorper}, ID WK: ${data.id_wk}, In Selected WK: ${inSelectedWasserkorper}`);

    return yearMatches && inSelectedWasserkorper;
  });

  // Mapping der gefilterten Daten auf das Interface
  return filteredData.map((data: any) => {
    let expertenurteilChangedDate: Date | null = null;

    // Verarbeite data.expertenurteil_changed, falls vorhanden
    if (data.expertenurteil_changed) {
      expertenurteilChangedDate = new Date(data.changed);
      if (isNaN(expertenurteilChangedDate.getTime())) {
        expertenurteilChangedDate = null;
      }
    }else if(data.letzte_aenderung){
      // String in Tag, Monat und Jahr zerlegen
      const [day, month, year] = data.letzte_aenderung.split('.').map(Number);
      
      // Jahr anpassen (wenn es nur zweistellig ist, wird es zu 2024 oder 1924 interpretiert)
      const fullYear = year < 50 ? 2000 + year : 1900 + year;
      
      // Neues Date-Objekt erstellen
      expertenurteilChangedDate = new Date(fullYear, month - 1, day);
    }

    // Verarbeite data.letzteAenderung, wenn expertenurteilChangedDate null ist
    let letzteAenderungDate: Date | null = expertenurteilChangedDate;
    if (!expertenurteilChangedDate &&(data.letzteAenderung || data.letzte_aenderung)) {

      if(data.letzte_aenderung && typeof data.letzte_aenderung === "string"){
          // Parsen des Strings 'DD.MM.YY'
      const [day, month, year] = data.letzteAenderung.split('.');
      const parsedYear = parseInt(year, 10) + 2000; // Umwandlung von 'YY' zu 'YYYY'
      letzteAenderungDate = new Date(`${parsedYear}-${month}-${day}`);
      }else if(data.letzte_aenderung ){
      
      // Parsen des Strings 'DD.MM.YY'
      const [day, month, year] = data.letzteAenderung.split('.');
      const parsedYear = parseInt(year, 10) + 2000; // Umwandlung von 'YY' zu 'YYYY'
      letzteAenderungDate = new Date(`${parsedYear}-${month}-${day}`);
    }
      if (isNaN(letzteAenderungDate.getTime())) {
        letzteAenderungDate = null;
      }
    }

    // Datum in 'dd.mm.yy' Format konvertieren, falls gültig
    const formatDateTime = (date: Date | null): string | null => {
      if (!date) return null;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2); // Nimm nur die letzten 2 Ziffern
      return `${day}.${month}.${year}`;
    };

    const letzteAenderungFormatted = formatDateTime(letzteAenderungDate) ?? ""; // Hier neu definiert

    return {
      wkName: data.wk_name,                        // wk.wk_name
      id_wk: data.id_wk,                          // wk.id_wk
      id: data.id,                                // da.id
      idMst: data.id_mst,                          // mst.id_mst
      namemst: data.namemst,                      // mst.namemst + ' (*)'
      letzteAenderung: letzteAenderungFormatted,  // Formatierte Anzeige des Datums
      firma: null,                                // para.id_komp
      jahr: data.jahr,                            // Jahr wird nicht mehr formatiert
      wert: data.wert,                  // da.avg_final_wert
      expertenurteil: data.expertenurteil,        // de.expertenurteil
      begruendung: data.begruendung,              // de.begruendung
      ausblenden: null                            // ausblenden der Daten=true
    };
  });
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
