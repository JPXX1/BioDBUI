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
