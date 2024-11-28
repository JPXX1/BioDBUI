import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WkUebersicht } from 'src/app/shared/interfaces/wk-uebersicht';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service zur Handhabung der Bewertung und Übersicht von Wasserkörpern.
 * 
 * @class
 * @name AnzeigeBewertungService
 * 
 * @property {any} dbBewertungWk - Datenbank für Wasserkörperbewertungen.
 * @property {any} dbBewertungWkaMst - Datenbank für Wasserkörperbewertungen aus Stammdaten.
 * @property {string} filtertxt - Textfilter für Bewertungen.
 * @property {any} dbStamWk - Datenbank für Wasserkörperstammdaten.
 * @property {string} InfoBox - Informationstext.
 * @property {WkUebersicht[]} wkUebersicht - Übersicht der Wasserkörper.
 * @property {WkUebersicht[]} wkUebersichtaMst - Übersicht der Wasserkörper aus Stammdaten.
 * @property {string} apiUrl - API-URL aus der Umgebungskonfiguration.
 * @property {WkUebersicht} _uebersicht - Temporäres Übersichtsobjekt.
 * @property {string} value - Allgemeiner Wert.
 * @property {string} valueJahr - Jahreswert.
 * @property {string} Artvalue - Typwert.
 * @property {number} min - Mindestjahr.
 * @property {number} max - Höchstjahr.
 * 
 * @constructor
 * @param {HttpClient} httpClient - HTTP-Client für API-Anfragen.
 * 
 * @method ngOnInit - Initialisiert den Service durch Aufruf der notwendigen Daten.
 * @method startBWUebersichtAusMst - Startet den Übersichtsprozess aus Stammdaten.
 * @method getBwWKUebersicht - Ruft Wasserkörperbewertungen ab.
 * @method getBwWKUebersichtAusMst - Ruft Wasserkörperbewertungen aus Stammdaten ab.
 * @method getStamWasserkoerper - Ruft Wasserkörperstammdaten ab.
 * @method callStamWK - Ruft die API auf, um Wasserkörperstammdaten zu erhalten.
 * @method callBwUebersicht - Ruft die API auf, um Wasserkörperbewertungen zu erhalten.
 * @method callBwUebersichtAusMst - Ruft die API auf, um Wasserkörperbewertungen aus Stammdaten zu erhalten.
 * @method compare - Vergleicht zwei Objekte basierend auf der Jahres-Eigenschaft.
 * @method datenUmwandeln - Konvertiert Daten für die Wasserkörperübersicht.
 * @method datenUmwandeln_mstausWK - Konvertiert Daten für die Wasserkörperübersicht aus Stammdaten.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class AnzeigeBewertungService {
  public dbBewertungWk: any;
  public dbBewertungWkaMst: any;
  public filtertxt:string;
  public dbStamWk: any;
  public InfoBox: string = "";
  public wkUebersicht: WkUebersicht[] = [];
  public wkUebersichtaMst: WkUebersicht[] = [];
  private apiUrl = environment.apiUrl;
  //public FilterwkUebersicht: WkUebersicht[] = [];
  public _uebersicht: WkUebersicht;
  // public _uebersichtaMst: WkUebersicht;
  constructor(private httpClient: HttpClient) { }

  public value:string = '';
   public valueJahr:string = '';
   public Artvalue:string = '';
  min:number=2016;
  max:number=2026; 

  /**
   * Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular alle daten-gebundenen Eigenschaften einer Direktive initialisiert hat.
   * Diese Methode wird verwendet, um notwendige asynchrone Operationen und Datenumwandlungen durchzuführen.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn alle asynchronen Operationen abgeschlossen sind.
   */
  async ngOnInit() {

    await this.callStamWK();
   await this.callBwUebersicht();
     this.datenUmwandeln();
   
    
  }
/**
 * Startet die BW-Übersicht aus Mst.
 * 
 * Diese Methode ruft die Funktion `callBwUebersichtAusMst` auf, um den BW-Übersichtsprozess zu starten,
 * und konvertiert dann die Daten mit der Methode `datenUmwandeln_mstausWK`.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Übersichtsprozess abgeschlossen ist.
 */
async startBWUebersichtAusMst(){
  await this.callBwUebersichtAusMst();

  this.datenUmwandeln_mstausWK();
}
  /**
   * Ruft die Übersicht der Wasserkörper ab.
   *
   * @returns Ein Observable, das die Übersichts-Daten der Wasserkörper enthält.
   */
   getBwWKUebersicht() {
     return this.httpClient.get(`${this.apiUrl}/bwWasserkoerper`);
  }
  
  /**
   * Ruft die Übersicht der Wasserkörper aus den Stammdaten ab.
   *
   * @returns Ein Observable, das die Übersicht der Wasserkörper enthält.
   */
  getBwWKUebersichtAusMst() {
    return this.httpClient.get(`${this.apiUrl}/bwWasserkoerper_aus_mst`);
  }
  /**
   * Ruft die Liste der 'stamWasserkoerper' von der API ab.
   *
   * @returns Ein Observable, das die Antwort der API enthält.
   */
   getStamWasserkoerper() {
    return this.httpClient.get(`${this.apiUrl}/stamWasserkoerper`);
  }

  /**
   * Ruft asynchron die Methode `getStamWasserkoerper` auf und weist das Ergebnis `dbStamWk` zu.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
   */
  async callStamWK() {
		// this.workbookInit(datum,Probenehmer)
		await this.getStamWasserkoerper().forEach(formen2_ => {
      this.dbStamWk = formen2_;
			//console.log(  formen_);
		});
	}
 
  /**
   * Ruft asynchron die Methode `getBwWKUebersicht` auf und verarbeitet deren Ergebnisse.
   * 
   * Diese Methode wartet auf die Fertigstellung von `getBwWKUebersicht` und iteriert über deren Ergebnisse,
   * wobei jedes Ergebnis der Eigenschaft `dbBewertungWk` zugewiesen wird.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
   */
  async callBwUebersicht() {

    await this.getBwWKUebersicht().forEach(formen2_ => {
      this.dbBewertungWk = formen2_;
     // console.log(formen_);
    });
  }
/**
 * Ruft asynchron die Methode `getBwWKUebersichtAusMst` auf und weist das Ergebnis `dbBewertungWkaMst` zu.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
 */

async callBwUebersichtAusMst() {
await this.getBwWKUebersichtAusMst().forEach(formen_ => {
  this.dbBewertungWkaMst = formen_;
 // console.log(formen_); 
});}

  /**
   * Vergleicht zwei Objekte basierend auf ihrer `jahr`-Eigenschaft.
   *
   * @param a - Das erste zu vergleichende Objekt.
   * @param b - Das zweite zu vergleichende Objekt.
   * @returns -1, wenn `a.jahr` kleiner als `b.jahr` ist, 1, wenn `a.jahr` größer als `b.jahr` ist, und 0, wenn sie gleich sind.
   */
 compare(a, b) {
    if (a.jahr < b.jahr) {
      return -1;
    }
    if (a.jahr > b.jahr) {
      return 1;
    }
    return 0;
  }

  /**
   * Konvertiert und verarbeitet Daten aus den Arrays `dbStamWk` und `dbBewertungWk`, um `wkUebersicht` zu befüllen.
   * 
   * Die Methode führt folgende Schritte aus:
   * 1. Initialisiert `wkUebersicht` als leeres Array.
   * 2. Iteriert über jedes Element in `dbStamWk`.
   * 3. Filtert und sortiert `dbBewertungWk` basierend auf `wk_id`, das mit dem aktuellen `dbStamWk`-Element übereinstimmt.
   * 4. Initialisiert `jahrstart` mit dem Jahr des ersten Elements im sortierten `dbBewertungWk`.
   * 5. Iteriert über jedes Element im sortierten `dbBewertungWk`:
   *    - Wenn sich das Jahr ändert und es nicht das erste Element ist, fügt es das aktuelle `_uebersicht` zu `wkUebersicht` hinzu und setzt `_uebersicht` zurück.
   *    - Setzt verschiedene Eigenschaften von `_uebersicht` basierend auf dem `id_para`-Wert des aktuellen Elements.
   *    - Wenn es das letzte Element ist, fügt es das aktuelle `_uebersicht` zu `wkUebersicht` hinzu.
   * 
   * @returns {void}
   */
   datenUmwandeln() {
    this.wkUebersicht=[];
     for (let i = 0, l = this.dbStamWk.length; i < l; i += 1) {

      let jahrstart:number;
      let dbBewertungWkTemp: any = this.dbBewertungWk.filter(excelspalten => excelspalten.wk_id === this.dbStamWk[i].id);
      //console.log(dbBewertungWkTemp);

      if (dbBewertungWkTemp.length>0){
      let dbBewertungwk = dbBewertungWkTemp.sort(this.compare);
     // console.log(dbBewertungwk);

      jahrstart=dbBewertungwk[0].jahr;
      this._uebersicht = {} as WkUebersicht

      for (let a = 0, l = dbBewertungwk.length; a < l; a += 1) {
        if (jahrstart!==dbBewertungwk[a].jahr && a>0){
          this.wkUebersicht.push(this._uebersicht);
          this._uebersicht = {} as WkUebersicht;
          jahrstart=dbBewertungwk[a].jahr;}


          this._uebersicht.Jahr = dbBewertungwk[a].jahr;
          this._uebersicht.idwk=dbBewertungwk[a].wk_id;
          this._uebersicht.WKname=dbBewertungwk[a].wk_name;
         
          // 1	ÖKZ_TK_MP
          // 2	ÖKZ_TK_Dia
          // 3	ÖKZ_QK_MZB
          // 4	ÖKZ_QK_F
          // 5	ÖKZ_QK_P
          // 6	ÖKZ
        switch (dbBewertungwk[a].id_para) {
          case "1": {
            
            this._uebersicht.OKZ_TK_MP = dbBewertungwk[a].wert ;
            break;
          }
          case "2": {
            this._uebersicht.OKZ_TK_Dia = dbBewertungwk[a].wert;
            break;
          }
          case "3": {
            this._uebersicht.OKZ_QK_MZB = dbBewertungwk[a].wert;
            break;
          }
          case "4": {
            this._uebersicht.OKZ_QK_F = dbBewertungwk[a].wert;
            break;
          }
          case "5": {
            this._uebersicht.OKZ_QK_P = dbBewertungwk[a].wert;
            break;
          }
          case "6": {
            this._uebersicht.OKZ = dbBewertungwk[a].wert;
            break;
          }
         }

        if (a+1 === l){this.wkUebersicht.push(this._uebersicht);} //letzter Wert
      } 

    }}}
    /**
     * Konvertiert und verarbeitet Daten aus `dbStamWk` und `dbBewertungWkaMst`, um `wkUebersichtaMst` zu befüllen.
     * 
     * Diese Methode iteriert über das `dbStamWk`-Array und filtert das `dbBewertungWkaMst`-Array, um passende Einträge zu finden.
     * Anschließend sortiert sie die gefilterten Einträge und verarbeitet sie, um eine Übersicht (`WkUebersicht`) für jedes Jahr zu erstellen.
     * Die verarbeiteten Daten werden im `wkUebersichtaMst`-Array gespeichert.
     * 
     * Die Methode behandelt verschiedene Parameter (`id_para`) und weist deren Werte den entsprechenden Eigenschaften
     * des `WkUebersicht`-Objekts zu.
     * 
     * @returns {void}
     */
    datenUmwandeln_mstausWK() {
      let _uebersichtaMst: WkUebersicht={} as WkUebersicht;
      this.wkUebersichtaMst=[];
       for (let i = 0, l = this.dbStamWk.length; i < l; i += 1) {
  
        let jahrstart:number;
        const dbBewertungWkTemp: any = this.dbBewertungWkaMst.filter(excelspalten => excelspalten.wk_id === this.dbStamWk[i].id);
        //console.log(dbBewertungWkTemp);
  
        if (dbBewertungWkTemp.length>0){
        let dbBewertungwk = dbBewertungWkTemp.sort(this.compare);
       // console.log(dbBewertungwk);
  
        jahrstart=dbBewertungwk[0].jahr;
        _uebersichtaMst = {} as WkUebersicht
  
        for (let a = 0, l = dbBewertungwk.length; a < l; a += 1) {
          if (jahrstart!==dbBewertungwk[a].jahr && a>0){
            this.wkUebersichtaMst.push(_uebersichtaMst);
            _uebersichtaMst = {} as WkUebersicht;
            jahrstart=dbBewertungwk[a].jahr;}
  
  
            _uebersichtaMst.Jahr = dbBewertungwk[a].jahr;
            _uebersichtaMst.idwk=dbBewertungwk[a].wk_id;
            _uebersichtaMst.WKname=dbBewertungwk[a].wk_name;
           
            // 1	ÖKZ_TK_MP
            // 2	ÖKZ_TK_Dia
            // 3	ÖKZ_QK_MZB
            // 4	ÖKZ_QK_F
            // 5	ÖKZ_QK_P
            // 6	ÖKZ
          switch (dbBewertungwk[a].id_para.toString()) {
            case "1": {
              
              _uebersichtaMst.OKZ_TK_MP = dbBewertungwk[a].wert ;
              break;
            }
            case "2": {
              _uebersichtaMst.OKZ_TK_Dia = dbBewertungwk[a].wert;
              break;
            }
            case "3": {
              _uebersichtaMst.OKZ_QK_MZB = dbBewertungwk[a].wert;
              break;
            }
            case "4": {
              _uebersichtaMst.OKZ_QK_F = dbBewertungwk[a].wert;
              break;
            }
            case "5": {
              _uebersichtaMst.OKZ_QK_P = dbBewertungwk[a].wert;
              break;
            }
            case "6": {
              _uebersichtaMst.OKZ = dbBewertungwk[a].wert;
              break;
            }
           }
  
          if (a+1 === l){this.wkUebersichtaMst.push(_uebersichtaMst);} //letzter Wert
        } 
  
      }}
      // console.log(this.wkUebersichtaMst);
      }
  
  }