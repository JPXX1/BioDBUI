import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstMakrophyten } from '../interfaces/mst-makrophyten';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

//abundanzen Taxa an den Messstellen
/**
 * Service zur Handhabung der Bewertung von Makrophyten (MstMakrophyten) Daten.
 * 
 * Dieser Service bietet Methoden zum Abrufen, Filtern und Verwalten von Makrophyten-Daten von einer API.
 * Er ermöglicht auch die Zuordnung und Anzeige spezifischer Spalten basierend auf Komponententypen.
 * 
 * @class
 * @property {MstMakrophyten[]} mstMakrophyten - Array gefilterter Makrophyten.
 * @property {MstMakrophyten} mstMakrophytenKl - Einzelne Makrophyten-Instanz.
 * @property {any} dbBewertungMst - Datenbankbewertung der Makrophyten.
 * @property {string[]} displayedColumns - Anzuzeigende Spalten in der Tabelle.
 * @property {MstMakrophyten[]} Taxa_MP - Array von Makrophyten für die MP-Komponente.
 * @property {MstMakrophyten[]} Taxa_Dia - Array von Makrophyten für die Dia-Komponente.
 * @property {MstMakrophyten[]} Taxa_MZB - Array von Makrophyten für die MZB-Komponente.
 * @property {MstMakrophyten[]} Taxa_Phyto - Array von Makrophyten für die Phyto-Komponente.
 * @property {string} apiUrl - API-URL aus der Umgebungskonfiguration.
 * @property {string} Artvalue - Artwert.
 * @property {string} value - Wert.
 * 
 * @constructor
 * @param {HttpClient} httpClient - Angular HTTP-Client zum Ausführen von API-Anfragen.
 * 
 * @method getBwMstTaxa - Ruft Makrophyten-Daten basierend auf dem Komponententyp ab.
 * @param {number} komp - Komponententyp.
 * @returns {Observable<any>} - Observable der abgerufenen Daten.
 * 
 * @method callBwMstTaxa - Ruft die Methode getBwMstTaxa auf und verarbeitet die Daten.
 * @param {number} komp - Komponententyp.
 * @returns {Promise<void>} - Promise, das aufgelöst wird, wenn die Daten verarbeitet sind.
 * 
 * @method callImpMstMP - Ruft die Methode bwMstAbundanzenImportID auf und verarbeitet die Daten.
 * @param {number} komp - Komponententyp.
 * @returns {Promise<void>} - Promise, das aufgelöst wird, wenn die Daten verarbeitet sind.
 * 
 * @method bwMstAbundanzenImportID - Ruft importierte Makrophyten-Daten basierend auf dem Komponententyp ab.
 * @param {number} komp - Komponententyp.
 * @returns {Observable<any>} - Observable der abgerufenen Daten.
 * 
 * @method FilterRichtigesArray - Filtert und gibt ein Array von Makrophyten basierend auf den angegebenen Parametern zurück.
 * @param {number} komp - Komponententyp zum Filtern.
 * @param {string} FilterMst - Filterstring für 'mst' oder 'gewaessername'.
 * @param {string} art - Filterstring für 'taxon'.
 * @param {number} min - Mindestjahr für den Filter.
 * @param {number} max - Höchstjahr für den Filter.
 * @returns {MstMakrophyten[]} - Gefiltertes Array von Makrophyten.
 * 
 * @method displayedColumnsMP - Legt die anzuzeigenden Spalten für die MP-Tabelle basierend auf der Komponentennummer fest.
 * @param {number} komp - Komponentennummer zur Bestimmung des Satzes anzuzeigender Spalten.
 * 
 * @method filterTaxadaten - Filtert ein Array von Makrophyten basierend auf den angegebenen Kriterien.
 * @param {MstMakrophyten[]} arr - Zu filterndes Array von Makrophyten.
 * @param {string} FilterMst - Filterstring für 'mst' oder 'gewaessername'.
 * @param {string} art - Filterstring für 'taxon'.
 * @param {number} min - Mindestjahr für den Filter.
 * @param {number} max - Höchstjahr für den Filter.
 * @returns {MstMakrophyten[]} - Gefiltertes Array von Makrophyten.
 * 
 * @method arrayNeuFuellen - Füllt das mstMakrophyten-Array mit Daten aus dbBewertungMst.
 * @param {number} komp - Komponententyp.
 * 
 * @method arrayZuweisen - Weist ein Array einer Klassen-Eigenschaft basierend auf dem angegebenen Komponentenindex zu.
 * @param {number} komp - Komponentenindex zur Bestimmung, welches Array zugewiesen wird.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class AnzeigeBewertungMPService {
  public mstMakrophyten: MstMakrophyten[] = [];//gefiltert
  public mstMakrophytenKl: MstMakrophyten; //
  public dbBewertungMst: any;
  displayedColumns: string[] = ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];

   Taxa_MP: MstMakrophyten[] = [];
   Taxa_Dia: MstMakrophyten[] = [];
   Taxa_MZB: MstMakrophyten[] = [];
   Taxa_Phyto: MstMakrophyten[] = [];
  //  Taxa_MP_gefitert: MstMakrophyten[] = [];
  //  Taxa_Dia_gefitert: MstMakrophyten[] = [];
  //  Taxa_MZB_gefitert: MstMakrophyten[] = [];
  //  Taxa_Phyto_gefitert: MstMakrophyten[] = [];
  private apiUrl = environment.apiUrl;
public Artvalue:string;
public value:string;

  constructor(private httpClient: HttpClient) { }

  
  /**
   * Ruft die BwMstAbundanzen-Daten für eine gegebene Komponente ab.
   *
   * @param komp - Die ID der Komponente, für die Daten abgerufen werden sollen.
   * @returns Ein Observable, das die BwMstAbundanzen-Daten enthält.
   */
  getBwMstTaxa(komp:number) {
    let params = new HttpParams().set('id',komp);
    
    return this.httpClient.get(`${this.apiUrl}/bwMstAbundanzen`, {params});
 }
/**
 * Ruft asynchron die Methode `getBwMstTaxa` mit dem angegebenen `komp` Parameter auf,
 * verarbeitet die zurückgegebenen Daten und aktualisiert das `dbBewertungMst` Array.
 * Nach der Verarbeitung der Daten werden die Methoden `arrayNeuFuellen`, `arrayZuweisen` und `displayedColumnsMP`
 * mit dem gleichen `komp` Parameter aufgerufen.
 *
 * @param {number} komp - Der Parameter, der verwendet wird, um die Daten abzurufen und zu verarbeiten.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn alle Operationen abgeschlossen sind.
 */
 async callBwMstTaxa(komp:number) {
 this.dbBewertungMst = [];
  await this.getBwMstTaxa(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;

    console.log(this.dbBewertungMst);
   
  });
this.arrayNeuFuellen(komp);
this.arrayZuweisen(komp);
this.displayedColumnsMP(komp);
}
/**
 * Ruft die Methode `bwMstAbundanzenImportID` mit dem angegebenen `komp` Parameter auf
 * und weist das Ergebnis `dbBewertungMst` zu.
 *
 * @param {number} komp - Der Parameter, der an die Methode `bwMstAbundanzenImportID` übergeben wird.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
 */

async callImpMstMP(komp:number) {
 
  await this.bwMstAbundanzenImportID(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;
   
  });
}
/**
 * Ruft die Import-ID der Häufigkeiten für die gegebene Komponente ab.
 *
 * @param {number} komp - Die Komponenten-ID, für die die Import-ID der Häufigkeiten abgerufen werden soll.
 * @returns {Observable<any>} Ein Observable, das die Antwort von der API enthält.
 */
bwMstAbundanzenImportID(komp:number) {
  let params = new HttpParams().set('id',komp);
  
  return this.httpClient.get(`${this.apiUrl}/bwMstAbundanzenImportID`, {params});
}
/**
 * Filtert und gibt ein Array von MstMakrophyten basierend auf den angegebenen Parametern zurück.
 *
 * @param {number} komp - Der Komponententyp zum Filtern.
 *                        0: Gibt das ursprüngliche mstMakrophyten-Array zurück.
 *                        1: Filtert mit Taxa_MP.
 *                        2: Filtert mit Taxa_Dia.
 *                        3: Filtert mit Taxa_MZB.
 *                        5: Filtert mit Taxa_Phyto.
 * @param {string} FilterMst - Der anzuwendende Filterstring.
 * @param {string} art - Der Typ der Art zum Filtern.
 * @param {number} min - Der Mindestwert für den Filter.
 * @param {number} max - Der Höchstwert für den Filter.
 * @returns {MstMakrophyten[]} - Das gefilterte Array von MstMakrophyten.
 */
FilterRichtigesArray(komp: number, FilterMst: string, art: string, min: number, max: number): MstMakrophyten[] {
  switch (komp) {
      case 0:
        return this.mstMakrophyten;
      case 1:
          return this.filterTaxadaten(this.Taxa_MP, FilterMst, art, min, max);
      case 2:
          return this.filterTaxadaten(this.Taxa_Dia, FilterMst, art, min, max);
      case 3:
          return this.filterTaxadaten(this.Taxa_MZB, FilterMst, art, min, max);
      case 5:
          return this.filterTaxadaten(this.Taxa_Phyto, FilterMst, art, min, max);
      default:
        return this.mstMakrophyten; // Return an empty array for any other case
  }
}
 
/**
 * Legt die angezeigten Spalten für die MP-Tabelle basierend auf der angegebenen Komponentennummer fest.
 * 
 * @param komp - Die Komponentennummer, die verwendet wird, um den Satz von anzuzeigenden Spalten zu bestimmen.
 *                Wenn `komp` 5 ist, wird ein spezifischer Satz von Spalten angezeigt.
 *                Andernfalls wird ein anderer Satz von Spalten angezeigt.
 */
displayedColumnsMP(komp: number) {
if (komp === 5) {
  this.displayedColumns= ['mst', 'gewaessername','datum', 'taxon', 'wert', 'einheit', 'taxonzusatz',  'letzteAenderung'];
}else {


this.displayedColumns= ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];
}}
/**
 * Filtert ein Array von MstMakrophyten-Objekten basierend auf den angegebenen Kriterien.
 *
 * @param arr - Das zu filternde Array von MstMakrophyten-Objekten.
 * @param FilterMst - Der Filterstring für die Eigenschaften 'mst' oder 'gewaessername'.
 * @param art - Der Filterstring für die Eigenschaft 'taxon'.
 * @param min - Das Mindestjahr für die Eigenschaft 'jahr'.
 * @param max - Das Höchstjahr für die Eigenschaft 'jahr'.
 * @returns Ein Array von MstMakrophyten-Objekten, die den Filterkriterien entsprechen.
 */
filterTaxadaten(arr: MstMakrophyten[], FilterMst: string, art: string, min: number, max: number): MstMakrophyten[] {
  return arr.filter(item => 
      item.jahr >= min && 
      item.jahr <= max && 
      (art === '' || item.taxon.toUpperCase().includes(art.toUpperCase())) && 
      (FilterMst === '' || item.mst.toUpperCase().includes(FilterMst.toUpperCase()) ||
      item.gewaessername.toUpperCase().includes(FilterMst.toUpperCase()))
  );
}
/**
 * Füllt das `mstMakrophyten`-Array mit Daten aus `dbBewertungMst` basierend auf dem angegebenen `komp`-Parameter.
 * 
 * @param {number} komp - Ein Parameter, der bestimmt, ob das `datum`-Feld gefüllt werden soll.
 * 
 * Die Methode führt die folgenden Schritte aus:
 * 1. Löscht das `mstMakrophyten`-Array.
 * 2. Iteriert über jedes Element im `dbBewertungMst`-Array.
 * 3. Erstellt ein neues `MstMakrophyten`-Objekt für jedes Element.
 * 4. Kopiert relevante Eigenschaften vom aktuellen `dbBewertungMst`-Element in das neue `MstMakrophyten`-Objekt.
 * 5. Setzt bedingt die `datum`-Eigenschaft, wenn `komp` gleich 5 ist.
 * 6. Fügt das neue `MstMakrophyten`-Objekt dem `mstMakrophyten`-Array hinzu.
 * 7. Sortiert das `mstMakrophyten`-Array nach `jahr` (absteigend), `mst`, `tiefe_m` und `taxon`.
 */

arrayNeuFuellen(komp: number) {
  this.mstMakrophyten = [];
  for (let i = 0, l = this.dbBewertungMst.length; i < l; i += 1) {
    this.mstMakrophytenKl = {} as MstMakrophyten;
    // let wk: string = this.dbBewertungMst[i].namemst;
    
    this.mstMakrophytenKl.mst = this.dbBewertungMst[i].namemst;
    this.mstMakrophytenKl.gewaessername=this.dbBewertungMst[i].gewaessername;
    if (komp === 5) { this.mstMakrophytenKl.datum = this.dbBewertungMst[i].datumpn} 
   
    this.mstMakrophytenKl.jahr = this.dbBewertungMst[i].jahr;
    this.mstMakrophytenKl.roteListeD = this.dbBewertungMst[i].rld;
    this.mstMakrophytenKl.cf = this.dbBewertungMst[i].cf;
    this.mstMakrophytenKl.einheit = this.dbBewertungMst[i].einheit;
    this.mstMakrophytenKl.firma = this.dbBewertungMst[i].firma;
    this.mstMakrophytenKl.taxonzusatz = this.dbBewertungMst[i].taxonzusatz;
    this.mstMakrophytenKl.taxon = `${this.dbBewertungMst[i].taxon} (${this.dbBewertungMst[i].dvnr})`;
    

      this.mstMakrophytenKl.wert = this.dbBewertungMst[i].wert;
    
   
    this.mstMakrophytenKl.tiefe_m = this.dbBewertungMst[i].tiefe_m;
    this.mstMakrophytenKl.letzte_aenderung = this.dbBewertungMst[i].letzte_aenderung;
    this.mstMakrophytenKl.dvnr = this.dbBewertungMst[i].dvnr;
    this.mstMakrophyten.push(this.mstMakrophytenKl);

  }
  this.mstMakrophyten.sort((a, b) => b.jahr - a.jahr || a.mst.localeCompare(b.mst) || a.tiefe_m.localeCompare(b.tiefe_m) || a.taxon.localeCompare(b.taxon));

}
  /**
     * Weist ein Array einer Klassen-Eigenschaft basierend auf dem angegebenen Komponentenindex zu.
     *
     * @param komp - Der Index der Komponente, um zu bestimmen, welches Array zugewiesen wird.
     * 
     * Die Methode weist die folgenden Arrays basierend auf dem Wert von `komp` zu:
     * - 0: Weist `mstMakrophyten` `Taxa_MP` zu.
     * - 1: Weist `mstMakrophyten` `Taxa_MP` zu.
     * - 2: Weist `mstMakrophyten` `Taxa_Dia` zu.
     * - 3: Weist `mstMakrophyten` `Taxa_MZB` zu.
     * - 5: Weist `mstMakrophyten` `Taxa_Phyto` zu.
     * 
     * Wenn `komp` keinem der angegebenen Fälle entspricht, wird keine Zuweisung vorgenommen.
     */
  arrayZuweisen(komp: number) {
    switch (komp) {
        case 0:
          this.Taxa_MP = this.mstMakrophyten;
          break;
        case 1:
          this.Taxa_MP = this.mstMakrophyten;
          break;
        case 2:
          this.Taxa_Dia = this.mstMakrophyten;
          break;
        case 3:
          this.Taxa_MZB = this.mstMakrophyten;
          break;
          case 5:
          this.Taxa_Phyto = this.mstMakrophyten;
          break;
        default:
          break;
    }
  }

}