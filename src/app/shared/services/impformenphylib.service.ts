import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Messwerte } from 'src/app/shared/interfaces/messwerte';
import { Observable,throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

import { MessstellenImp } from 'src/app/shared/interfaces/messstellen-imp';
@Injectable({
  providedIn: 'root'
})
/**
 * Service-Klasse zur Interaktion mit der impformenphylib API.
 * Bietet Methoden zum Abrufen und Posten verschiedener Daten im Zusammenhang mit Phylib-Formen, Tiefen, Einheiten, Stammdaten, Übersichts-Daten, Probenehmern, Jahren, Arten-Tests, abiotischen Parametern und Messwerten.
 * 
 * @class
 * @example
 * // Beispielverwendung:
 * const service = new ImpPhylibServ(httpClient);
 * service.getFormen().subscribe(data => console.log(data));
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class ImpPhylibServ {
  private apiUrl = environment.apiUrl;
  myVariable: any;
  constructor(private httpClient: HttpClient) { }
 
  /**
   * Ruft die Liste der Formen vom impformenphylib-Endpunkt ab.
   *
   * @returns Ein Observable, das die Antwort von der API enthält.
   */
  getFormen(){ 
    return this.httpClient.get(`${this.apiUrl}/impformenphylib`);
//  return this.httpClient.get('${this.apiUrl}/impformenphylib');
    

    
  }

  /**
   * Ruft die Tiefen-Daten von der API ab.
   *
   * @returns Ein Observable, das die Tiefen-Daten enthält.
   */
  getTiefen(){

    //var temp=this.httpClient.get('${this.apiUrl}/imptiefenphylib');
    return this.httpClient.get(`${this.apiUrl}/imptiefenphylib`);
    
  }
  /**
   * Ruft eine Liste von Einheiten von der API ab.
   *
   * @returns Ein Observable, das die Liste von Einheiten enthält.
   */
  getEinheiten(){ 
  
    return this.httpClient.get(`${this.apiUrl}/impeinheitenphylib`);
       
   
       
     }
    /**
     * Ruft die Stammdaten vom Server ab.
     *
     * @returns Ein Observable, das die Stammdaten enthält.
     */
     getMst(): Observable<any>{ 
      // return this.httpClient.get('${this.apiUrl}/imptiefenphylib');
      return this.httpClient.get(`${this.apiUrl}/impMst`);
         
     
        
       }

      /**
       * Ruft die impUebersicht-Daten von der API ab.
       *
       * @returns Ein Observable, das die impUebersicht-Daten enthält.
       */
       getimpUebersicht(){
        return this.httpClient.get(`${this.apiUrl}/impUebersicht`);
       }
      /**
       * Ruft die Liste der 'Probenehmer' von der API ab.
       *
       * @returns Ein Observable, das die Liste der 'Probenehmer' enthält.
       */
       getProbenehmer(){
        return this.httpClient.get(`${this.apiUrl}/impProbenehmer`);
        
       }
      
            /**
             * Ruft die Liste der Arten Phylib MP-Tests von der API ab.
             *
             * @returns Ein Observable, das die Antwort von der API enthält.
             */
       getArtenPhylibMPtets() {

              return this.httpClient.get(`${this.apiUrl}/impArten2`);}
      /**
       * Ruft die abiotischen Parameter von der API ab.
       *
       * @returns Ein Observable, das die abiotischen Parameter enthält.
       */
      getParameterAbiot() {

                return this.httpClient.get(`${this.apiUrl}/impParaAbiot`);}


  
      /**
       * Ruft die Phylib-Messwerte für ein bestimmtes Datum ab.
       *
       * @param datum - Das Datum, für das die Messwerte abgerufen werden sollen.
       * @returns Ein Observable, das die Messwerte enthält.
       */
      kontrollPhylibMesswerte2(datum:string): Observable<any>{
                let params = new HttpParams()
                .set('datumpn',datum)       
           ;
               
              return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMesswerte2`, {params: params}); 
              
              }
      /**
       * kontrollPhylibMessstellen überprüft die Phylib-Messstellen für ein bestimmtes Datum.
       *
       * @param {string} datum - Das Datum, für das die Phylib-Messstellen überprüft werden sollen.
       * @returns {Observable<any>} - Ein Observable, das die Antwort vom Server enthält.
       */
      kontrollPhylibMessstellen(datum:string): Observable<any>{
                let params = new HttpParams()
               .set('datum',datum)       
           ;
               
         return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMessstellen`, {params: params}); 
              
              }
      /**
       * Kontrolliert die Phylib-Messwerte anhand der übergebenen Parameter.
       *
       * @param MessDataImp - Ein Objekt vom Typ Messwerte, das die Messdaten enthält.
       * @param datum - Das Datum der Probennahme als string.
       * @param Probenehmer - Der Name des Probenehmers als string.
       * @param id_import - Die Import-ID als string.
       * @returns Ein Observable, das die Antwort des HTTP GET-Requests enthält.
       */
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
       
      return this.httpClient.get(`${this.apiUrl}/kontrollPhylibMesswerte`, {params: params}); 
      
      }
      
      
      

      /**
       * Ruft die valVerfahren-Daten von der API ab.
       *
       * @returns Ein Observable, das die valVerfahren-Daten enthält.
       */
      getvalVerfahren(): Observable<any>{


        return this.httpClient.get(`${this.apiUrl}/valVerfahren`);}

      /**
       * Ruft die Excel-Tabellenwerte vom Server ab.
       *
       * @returns Ein Observable, das die Excel-Tabellenwerte enthält.
       */
      getvalExceltabs(): Observable<any>{


      return this.httpClient.get(`${this.apiUrl}/valExceltabs`);}
      
      /**
       * Ruft die Excel-Spalten vom Server ab.
       *
       * @returns Ein Observable, das die Excel-Spalten-Daten enthält.
       */
     
      getvalExcelSpalten(): Observable<any>{


        return this.httpClient.get(`${this.apiUrl}/valExcelspalten`);}

      /**
       * Ruft die Arten Phylib MP-Daten von der API ab.
       *
       * @param {number} parameter - Der Parameter, der als Abfrageparameter mit dem Schlüssel 'id' gesendet wird.
       * @returns {Observable<any>} Ein Observable, das die Antwort von der API enthält.
       */
 
       getArtenPhylibMP(parameter :number){ 

        let params = new HttpParams().set('id',parameter);
        // console.log(params.toString())
        //const params: { id: 1 };
        return this.httpClient.get(`${this.apiUrl}/impArten`, {params});
        }
        /**
         * Sendet eine POST-Anfrage, um Phylib Messstellen-Daten einzufügen.
         *
         * @param {MessstellenImp} MessstellenImp - Das MessstellenImp-Objekt, das die zu postenden Daten enthält.
         * @param {string} datum - Das Datum, das mit den Daten verknüpft ist.
         * @param {string} Probenehmer - Der Identifikator für die Person, die die Probe entnimmt.
         * @param {any} id_import - Die Import-ID, die mit den Daten verknüpft ist.
         * @returns {Promise<string>} - Ein Versprechen, das den Antworttext vom Server zurückgibt.
         * @throws Wird einen Fehler werfen, wenn die Fetch-Anfrage fehlschlägt.
         */
        async  postMessstellenPhylib(MessstellenImp:MessstellenImp,datum:string,Probenehmer:string,id_import):Promise<string> {
          let url=`${this.apiUrl}/insertPhylibMessstellen`;
     
          
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                "Content-Type": "text/plain"
              },
              body: JSON.stringify({
                id_mst: MessstellenImp.id_mst,
                id_para: MessstellenImp.id_para,
                id_import: id_import,
                id_pn: Probenehmer,
                datum: datum,
                id_einh:MessstellenImp.id_einh,
                wert:MessstellenImp.wert
              })    
            //this.messstellenImp[i], jahrtemp, probenehmer,this.uebersichtImport.id_imp
            });
            return await response.text();
          } catch (error) {
            console.error('Error posting data:', error);
            throw error;
            return  "Fehler";
          }
        }
  
        

        

      /**
       * Sendet eine POST-Anfrage, um Messdaten in die Phylib-Datenbank einzufügen.
       *
       * @param {Messwerte} MessDataImp - Die einzufügenden Messdaten.
       * @param {string} datum - Das Datum der Messung.
       * @param {string} Probenehmer - Der Identifikator des Probenehmers.
       * @param {number} id_import - Die Import-ID.
       * @returns {Promise<number>} - Ein Versprechen, das den HTTP-Statuscode der Antwort zurückgibt.
       * @throws Wird einen Fehler werfen, wenn die POST-Anfrage fehlschlägt.
       */
      async  postMesswertePhylib(MessDataImp:Messwerte, datum:string,Probenehmer:string,id_import:number) :Promise<number>{
        let url=`${this.apiUrl}/insertPhylibMesswerte`;
        let bodytext;
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
             "Content-Type": "text/plain"// bodytext
            },
            body: JSON.stringify({
              id_taxon: MessDataImp._Taxon,
              id_einheit: MessDataImp._Einheit,
              id_probe: MessDataImp._Probe,
              id_mst: MessDataImp._Messstelle,
              id_taxonzus: MessDataImp._Form,
              id_pn: Probenehmer,
              datumpn: datum,
              id_import: id_import,
              id_tiefe: MessDataImp._Tiefe,
              id_abundanz: MessDataImp._idAbundanz,
              cf: MessDataImp._cf,
              wert: MessDataImp._Messwert
            })    
          
          }).then(allies => (bodytext=allies.status));
          // bodytext=response.text();
          console.log(bodytext)
          return await bodytext;
        } catch (error) {
          console.error('Error posting data:', error);
          throw error;
          return  500;
        }
      }
       
              
        
}