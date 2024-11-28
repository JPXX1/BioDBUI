import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstUebersicht } from 'src/app/shared/interfaces/mst-uebersicht';
import { AnzeigeBewertungService } from './anzeige-bewertung.service';
import { WkUebersicht } from 'src/app/shared/interfaces/wk-uebersicht';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

//Artdaten
/**
 * Service zur Verwaltung und Verarbeitung der Übersicht von Messstellen (MST) und Wasserkörpern (WK).
 * Dieser Service bietet Methoden zum Filtern, Sortieren und Transformieren von Daten im Zusammenhang mit Messstellen und deren Bewertungen.
 * 
 * @class AnzeigenMstUebersichtService
 * 
 * @property {MstUebersicht[]} mstUebersicht - Array zur Speicherung der Übersicht von Messstellen.
 * @property {MstUebersicht} mstUebersichtKl - Objekt zur Speicherung einer einzelnen Messstellenübersicht.
 * @property {any} dbMPUebersichtMst - Datenbankübersicht der Messstellen.
 * @property {string[]} uniqueJahr - Array zur Speicherung einzigartiger Jahre.
 * @property {string[]} uniqueMst - Array zur Speicherung einzigartiger Messstellen.
 * @property {string[]} displayColumnNames - Array zur Speicherung der anzuzeigenden Spaltennamen.
 * @property {string[]} displayedColumns - Array zur Speicherung der anzuzeigenden Spalten.
 * @property {WkUebersicht[]} FilterwkUebersicht - Array zur Speicherung der gefilterten Wasserkörperübersicht.
 * @property {string} apiUrl - API-URL aus der Umgebungskonfiguration.
 * @property {string} Artvalue - Artwert.
 * @property {string} value - Wert.
 * 
 * @constructor
 * @param {HttpClient} httpClient - HTTP-Client für API-Anfragen.
 * @param {AnzeigeBewertungService} anzeigeBewertungService - Service zur Handhabung von Bewertungen.
 * 
 * @method call - Hauptmethode zur Verarbeitung und Filterung von Daten basierend auf den angegebenen Parametern.
 * @param {string} filter - Filterstring.
 * @param {string} art - Artstring.
 * @param {number} min - Mindestjahr.
 * @param {number} max - Höchstjahr.
 * @param {number} komp_id - Komponenten-ID.
 * 
 * @method erzeugeDisplayColumnNames - Generiert die anzuzeigenden Spaltennamen basierend auf dem Komponenten-Flag.
 * @param {boolean} komponente - Flag zur Einbeziehung der Komponentenspalte.
 * 
 * @method filterMst - Filtert Messstellen basierend auf dem angegebenen Filter, Art, Min und Max Werten.
 * @param {string} filter - Filterstring.
 * @param {string} art - Artstring.
 * @param {number} min - Mindestjahr.
 * @param {number} max - Höchstjahr.
 * 
 * @method erzeugeDisplayedColumnNames - Generiert die anzuzeigenden Spaltennamen basierend auf den einzigartigen Jahren.
 * @param {boolean} komponente - Flag zur Einbeziehung der Komponentenspalte.
 * 
 * @method getBwWKUebersicht - Ruft die Wasserkörperübersicht von der API ab.
 * @param {number} selectedItems - Ausgewählte Elemente für die Anfrage.
 * @returns {Promise<any[]>} - Promise, das ein Array der Wasserkörperübersicht auflöst.
 * 
 * @method getBwMSTUebersicht - Ruft die Messstellenübersicht von der API ab.
 * @param {number[]} selectedItems - Ausgewählte Elemente für die Anfrage.
 * @returns {Promise<any[]>} - Promise, das ein Array der Messstellenübersicht auflöst.
 * 
 * @method callBwUebersicht - Ruft die API auf, um die Messstellenübersicht abzurufen und zu verarbeiten.
 * @param {number} komp_id - Komponenten-ID.
 * 
 * @method callBwUebersichtExp - Ruft die API auf, um die Messstellenübersicht mit Expertenurteil abzurufen und zu verarbeiten.
 * @param {number} komp_id - Komponenten-ID.
 * 
 * @method uniqueMstSortCall - Sortiert und setzt einzigartige Messstellen.
 * 
 * @method uniqueJahrSortCall - Sortiert und setzt einzigartige Jahre.
 * 
 * @method anwelcherStelleStehtdasJahr - Bestimmt die Position des Jahres im Array der einzigartigen Jahre.
 * @param {string} temp - Jahrstring.
 * @returns {number} - Position des Jahres.
 * 
 * @method mstUebersichtFiltern - Filtert die Messstellenübersicht basierend auf der Wasserkörperübersicht.
 * 
 * @method datenUmwandeln - Transformiert die Daten für die Messstellenübersicht.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class AnzeigenMstUebersichtService {
  public mstUebersicht: MstUebersicht[] = [];
  public mstUebersichtKl: MstUebersicht;
  public dbMPUebersichtMst: any;
  public uniqueJahr:string[]=[];
  public uniqueMst:string[]=[];
  public displayColumnNames:string[]=[];
  public displayedColumns:string[]=[];
  public FilterwkUebersicht: WkUebersicht[] = [];
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,anzeigeBewertungService:AnzeigeBewertungService) { }
public Artvalue:string;
public value:string;

  /**
   * Ruft verschiedene Methoden auf, um Daten basierend auf den angegebenen Parametern zu verarbeiten und zu filtern.
   *
   * @param {string} filter - Die anzuwendenden Filterkriterien.
   * @param {string} art - Die Art der zu verarbeitenden Daten.
   * @param {number} min - Der Mindestwert für die Filterung.
   * @param {number} max - Der Höchstwert für die Filterung.
   * @param {number} komp_id - Die ID der zu verarbeitenden Komponente.
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die gesamte Verarbeitung abgeschlossen ist.
   */
  async call(filter:string,art:string,min:number,max:number,komp_id:number) {

 
  await this.callBwUebersichtExp(komp_id);
  await this.filterMst(filter,art,min,max);
   this.uniqueMstSortCall();
   this.uniqueJahrSortCall();
     this.datenUmwandeln();
    this.erzeugeDisplayedColumnNames(false);
     this.erzeugeDisplayColumnNames(false);
    
  }
 
   /**
     * Generiert Anzeigespaltennamen für eine Tabelle.
     * 
     * Diese Methode initialisiert das `displayColumnNames` Array und füllt es mit 
     * Standardspaltennamen wie 'Wasserköper' und 'Messstelle'. Wenn der `komponente` 
     * Parameter wahr ist, fügt sie auch 'Komponente' zu den Spaltennamen hinzu. 
     * Zusätzlich fügt sie eindeutige Jahre aus dem `uniqueJahr` Array zu den Spaltennamen hinzu.
     * 
     * @param {boolean} komponente - Ein boolesches Flag, das angibt, ob die 'Komponente' Spalte eingeschlossen werden soll.
     */
  erzeugeDisplayColumnNames(komponente:boolean){
    this.displayColumnNames=[];
    this.displayColumnNames.push('Wasserköper');
    this.displayColumnNames.push('Messstelle');
    if (komponente===true){ this.displayColumnNames.push('Komponente');}
    for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
      this.displayColumnNames.push(this.uniqueJahr[a])  

  }}

  /**
   * Filtert das `dbMPUebersichtMst` Array basierend auf den angegebenen Filterkriterien.
   * 
   * @param filter - Der String, um die `namemst` Eigenschaft zu filtern. Wenn leer, wird der Filter ignoriert.
   * @param art - Die Art des anzuwendenden Filters (derzeit nicht verwendet).
   * @param min - Der Mindestwert für das Jahr zur Filterung.
   * @param max - Der Höchstwert für das Jahr zur Filterung.
   * 
   * @returns Ein Promise, das aufgelöst wird, wenn der Filtervorgang abgeschlossen ist.
   */
  /**
   * Filtert das `dbMPUebersichtMst` Array basierend auf den angegebenen Filterkriterien.
   * 
   * @param filter - Ein String, um die `namemst` Eigenschaft zu filtern.
   * @param art - Ein String, der den Filtertyp darstellt (derzeit nicht verwendet).
   * @param min - Der Mindestwert für das Jahr zur Filterung.
   * @param max - Der Höchstwert für das Jahr zur Filterung.
   * 
   * @returns Ein Promise, das aufgelöst wird, wenn der Filtervorgang abgeschlossen ist.
   */
  async filterMst(filter:string,art:string,min:number,max:number){
   
    let temp: any = this.dbMPUebersichtMst;

    this.dbMPUebersichtMst = [];

    await Promise.all(
      temp.map(async (f) => {
                
          if (!filter){
            if ((Number(f.jahr)>=min && Number(f.jahr)<=max)){
              {this.dbMPUebersichtMst.push(f);}}}
         else {
          if (f.namemst.includes(filter) && (Number(f.jahr)>=min && Number(f.jahr)<=max)){
         
             {this.dbMPUebersichtMst.push(f);}}
          // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
      }})
  )
  // console.log (this.dbMPUebersichtMst);
   
  }
  /**
   * Generiert die anzuzeigenden Spaltennamen basierend auf dem Komponenten-Flag und der Länge der einzigartigen Jahre.
   * 
   * @param {boolean} komponente - Ein Flag, das angibt, ob die 'komponente' Spalte eingeschlossen werden soll.
   * 
   * Diese Methode initialisiert das `displayedColumns` Array und fügt standardmäßig die 'wk' und 'mst' Spalten hinzu.
   * Wenn der `komponente` Parameter wahr ist, fügt sie auch die 'komponente' Spalte hinzu.
   * 
   * Abhängig von der Länge des `uniqueJahr` Arrays fügt sie eine entsprechende Anzahl von 'sp' Spalten
   * (z.B. 'sp1', 'sp2', ..., 'sp15') zum `displayedColumns` Array hinzu.
   */
  erzeugeDisplayedColumnNames(komponente:boolean){
  this.displayedColumns=[];
  this.displayedColumns.push('wk');
  this.displayedColumns.push('mst');
if (komponente===true){ this.displayedColumns.push('komponente');}

  switch (this.uniqueJahr.length){

    case 1: {
      this.displayedColumns.push('sp1');
      break;
    }
    case 2: {
      this.displayedColumns.push('sp1','sp2');
      break;
    }
    case 3: {
      this.displayedColumns.push('sp1','sp2','sp3');
      break;
    }
    case 4: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4');
      break;
    }
    case 5: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5');
      break;
    }
    case 6: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6');
      break;
    }
    case 7: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7');
      break;
    }
    case 8: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8');
      break;
    }
    case 9: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9');
      break;
    }
    case 10: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10');
      break;
    }
    case 11: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11');
      break;
    }
    case 12: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12');
      break;
    }
    case 13: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13');
      break;
    }
    case 14: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','sp14');
      break;
    }
    case 15: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','sp14','sp15');
      break;
    }
    
  
}
  }
  /**
   * Ruft die BW WK Übersicht basierend auf den ausgewählten Elementen ab.
   * 
   * @param {number} selectedItems - Die ausgewählten Elemente, die in der Anfrage gesendet werden.
   * @returns {Promise<any[]>} - Ein Promise, das ein Array der BW WK Übersicht auflöst.
   * @throws {Error} - Wirft einen Fehler, wenn die Antwort kein Array ist.
   */
  async getBwWKUebersicht(selectedItems: number): Promise<any[]> {
    const response = await this.httpClient.post(`${this.apiUrl}/bwWKUebersicht`, selectedItems).toPromise();
    
    // Hier sicherstellen, dass die API ein Array zurückgibt
    if (!Array.isArray(response)) {
      throw new Error('Die Antwort ist kein Array');
    }
    
    return response;
  }

 
  /**
   * Ruft die MST-Übersicht für die angegebenen ausgewählten Elemente ab.
   *
   * @param {number[]} selectedItems - Ein Array von ausgewählten Element-IDs.
   * @returns {Promise<any[]>} Ein Promise, das ein Array von MST-Übersichtsdaten auflöst.
   * @throws {Error} Wirft einen Fehler, wenn die Antwort kein Array ist.
   */
  
  async getBwMSTUebersicht(selectedItems: number[]): Promise<any[]> {
    const response = await this.httpClient.post(`${this.apiUrl}/bwMstUebersicht`, { selectedItems }).toPromise();
    
    // Hier sicherstellen, dass die API ein Array zurückgibt
    if (!Array.isArray(response)) {
      throw new Error('Die Antwort ist kein Array');
    }
    
    return response;
  }

  

  /**
   * Ruft asynchron die Übersichtsdaten für eine gegebene Komponenten-ID ab und verarbeitet sie.
   * 
   * @param {number} komp_id - Die ID der Komponente, für die die Übersicht abgerufen werden soll.
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten abgerufen und verarbeitet wurden.
   * 
   * @throws Protokolliert eine Fehlermeldung, wenn ein Problem beim Abrufen der Übersichtsdaten auftritt.
   * 
   * Die Methode führt die folgenden Schritte aus:
   * 1. Initialisiert ein Array mit der angegebenen Komponenten-ID.
   * 2. Ruft die Übersichtsdaten mit der Methode `getBwMSTUebersicht` ab.
   * 3. Stellt sicher, dass die abgerufenen Daten im Array-Format vorliegen.
   * 4. Mappt die Daten auf eine spezifische Struktur und weist sie `dbMPUebersichtMst` zu.
   */
  async callBwUebersicht(komp_id: number) {
    let selectedItems: number[] = [];
    selectedItems.push(komp_id);
  
    try {
      const formen_ = await this.getBwMSTUebersicht(selectedItems);
  
      // Falls kein Array, konvertiere es zu einem Array
      const dataArray = Array.isArray(formen_) ? formen_ : [formen_];
  
      // Mapping der Daten
      this.dbMPUebersichtMst = dataArray.map(form => ({
        wkName: form.wk_name,
        id: form.id,
        parameter: form.parameter,
        idMst: form.id_mst,
        namemst: form.namemst,
        repraesent: form.repraesent,
        idKomp: form.id_komp,
        komponente: form.komponente,
        idImport: form.id_import,
        jahr: form.jahr,
        letzteAenderung: form.letzte_aenderung,
        idEinh: form.id_einh,
        firma: form.firma,
        wert: form.wert,
        expertenurteil: form.expertenurteil,
        begruendung: form.begruendung,
        expertenurteilChanged: new Date(form.expertenurteil_changed),
        idNu: form.id_nu,
        ausblenden:form.ausblenden
      }));
  
     // console.log('Verarbeitete Daten: ', this.dbMPUebersichtMst);
    } catch (error) {
      console.error('Fehler beim Abrufen der Übersicht:', error);
    }
  }
  
 
  /**
   * Bewertung ersetzt um Expertenurteil: Asynchrones Abrufen und Verarbeiten der Übersichtsdaten für eine gegebene Komponenten-ID.
   * 
   * @param {number} komp_id - Die ID der Komponente, für die die Übersicht abgerufen werden soll.
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten abgerufen und verarbeitet wurden.
   * 
   * @throws Protokolliert eine Fehlermeldung, wenn ein Problem beim Abrufen der Übersichtsdaten auftritt.
   * 
   * Die Methode führt die folgenden Schritte aus:
   * 1. Initialisiert ein Array mit der angegebenen Komponenten-ID.
   * 2. Ruft die Übersichtsdaten mit der Methode `getBwMSTUebersicht` ab.
   * 3. Stellt sicher, dass die abgerufenen Daten im Array-Format vorliegen.
   * 4. Filtert Einträge aus, bei denen die Eigenschaft `ausblenden` auf true gesetzt ist.
   * 5. Mappt die gefilterten Daten auf ein neues Format, einschließlich bedingter Logik für die Eigenschaft `wert`.
   * 6. Weist die verarbeiteten Daten der Eigenschaft `dbMPUebersichtMst` zu.
   */
  async callBwUebersichtExp(komp_id: number) {
    let selectedItems: number[] = [];
    selectedItems.push(komp_id);
  
    try {
      const formen_ = await this.getBwMSTUebersicht(selectedItems);
  
      // Falls kein Array, konvertiere es zu einem Array
      const dataArray = Array.isArray(formen_) ? formen_ : [formen_];
  
      // Mapping der Daten
      this.dbMPUebersichtMst = dataArray 
      .filter(form => !form.ausblenden) // Filtere Datensätze aus, bei denen 'ausblenden' true ist

      .map(form => ({
        wkName: form.wk_name,
        id: form.id,
        parameter: form.parameter,
        idMst: form.id_mst,
        namemst: form.namemst,
        repraesent: form.repraesent,
        idKomp: form.id_komp,
        komponente: form.komponente,
        idImport: form.id_import,
        jahr: form.jahr,
        letzteAenderung: form.letzte_aenderung,
        idEinh: form.id_einh,
        firma: form.firma,
        // Setze wert auf form.expertenurteil, wenn vorhanden, sonst form.wert
        wert: ['1', '2', '3', '4', '5'].includes(form.expertenurteil) ?  `${form.expertenurteil} *` : form.wert,
        expertenurteil: form.expertenurteil,
        begruendung: form.begruendung,
        expertenurteilChanged: new Date(form.expertenurteil_changed),
        idNu: form.id_nu
      }));
  
      // console.log('Verarbeitete Daten: ', this.dbMPUebersichtMst);
    } catch (error) {
      console.error('Fehler beim Abrufen der Übersicht:', error);
    }
  }
  
  
  /**
   * Sortiert und entfernt Duplikate aus dem `dbMPUebersichtMst` Array basierend auf der `namemst` Eigenschaft.
   * 
   * Diese Methode iteriert durch das `dbMPUebersichtMst` Array, extrahiert die `namemst` Eigenschaft von jedem Element
   * und speichert sie in einem temporären Array. Anschließend entfernt sie Duplikate aus dem Array und sortiert es
   * in aufsteigender Reihenfolge unter Verwendung eines lokalen Vergleichs mit numerischer Sortierung.
   * 
   * Das sortierte und eindeutige Array wird dann der `uniqueMst` Eigenschaft zugewiesen.
   */
   uniqueMstSortCall(){

    let array:string[]=[];
    for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {

      array.push(this.dbMPUebersichtMst[i].namemst)
     
           
    } 



    const temp =  [...new Set(array)] ;
    this.uniqueMst=temp.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

    /**
     * Sortiert und filtert einzigartige Jahre aus dem `dbMPUebersichtMst` Array.
     * 
     * Diese Methode iteriert durch das `dbMPUebersichtMst` Array, extrahiert die `jahr` Eigenschaft von jedem Element
     * und speichert diese Werte in einem neuen Array. Anschließend entfernt sie doppelte Werte aus dem Array und sortiert die 
     * resultierenden einzigartigen Werte in aufsteigender Reihenfolge, wobei numerische Werte berücksichtigt werden.
     * 
     * @returns {void}
     */
    uniqueJahrSortCall(){

      let array:string[]=[];
      for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {
  
        array.push(this.dbMPUebersichtMst[i].jahr);
  
           
      }
      
      let temp =  [...new Set(array)] ;
      this.uniqueJahr =temp

      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }

      /**
       * Bestimmt den Index des angegebenen Jahres im uniqueJahr-Array.
       *
       * @param {string} temp - Das Jahr, das im uniqueJahr-Array gefunden werden soll.
       * @returns {number} Der Index des Jahres im uniqueJahr-Array oder null, wenn das Jahr nicht gefunden wird.
       */
      anwelcherStelleStehtdasJahr(temp:string):number{
        let r:number=null;
        for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
          if(this.uniqueJahr[a]===temp){


            r= a;
          }
        }
      return r;
      }



      /**
       * Filtert das `mstUebersicht` Array basierend auf der `WKname` Eigenschaft des `FilterwkUebersicht` Arrays.
       * Iteriert durch jedes Element im `mstUebersicht` Array und wendet die Filterbedingung an.
       * 
       * @returns {void}
       */
      mstUebersichtFiltern(){
        for (let a = 0, l = this.mstUebersicht.length; a < l; a += 1) {

          
        let tempFilterwkUebersicht: any = this.FilterwkUebersicht.filter(excelspalten => excelspalten.WKname === this.mstUebersicht[a].wk);
         
      if (!tempFilterwkUebersicht){
      }}}
  
      /**
       * Konvertiert und verarbeitet Daten, um das `mstUebersicht` Array zu füllen.
       * 
       * Diese Methode führt die folgenden Schritte aus:
       * 1. Leert das `mstUebersicht` Array.
       * 2. Iteriert über das `uniqueMst` Array.
       * 3. Filtert und sortiert das `dbMPUebersichtMst` Array basierend auf dem aktuellen `uniqueMst` Element.
       * 4. Initialisiert ein neues `MstUebersicht` Objekt.
       * 5. Füllt das `MstUebersicht` Objekt mit Daten aus dem gefilterten und sortierten Array.
       * 6. Weist Werte den entsprechenden Eigenschaften (`sp1` bis `sp15`) basierend auf der Jahresposition zu.
       * 7. Fügt das gefüllte `MstUebersicht` Objekt dem `mstUebersicht` Array hinzu.
       * 
       * @bemerkungen
       * - Die Methode geht davon aus, dass `uniqueMst`, `dbMPUebersichtMst` und `anwelcherStelleStehtdasJahr` innerhalb der Klasse definiert und zugänglich sind.
       * - Das `MstUebersicht` Objekt hat Eigenschaften `wk`, `mst`, `komponente` und `sp1` bis `sp15`.
       * - Die Methode `anwelcherStelleStehtdasJahr` wird verwendet, um die Position des Jahres zu bestimmen und den entsprechenden Wert der passenden Eigenschaft zuzuweisen.
       */
      datenUmwandeln(){
 
        this.mstUebersicht=[];

    for (let a = 0, l = this.uniqueMst.length; a < l; a += 1) {
      
      let dbBewertungMSTTemp0: any = this.dbMPUebersichtMst.filter(excelspalten => excelspalten.namemst === this.uniqueMst[a]);
      let dbBewertungMSTTemp: any =dbBewertungMSTTemp0.sort();

      this.mstUebersichtKl = {} as MstUebersicht;
      if (dbBewertungMSTTemp.length>0){
        
        this.mstUebersichtKl.wk=dbBewertungMSTTemp[0].wkName;
        this.mstUebersichtKl.mst=dbBewertungMSTTemp[0].namemst;
        this.mstUebersichtKl.komponente=dbBewertungMSTTemp[0].komponente;
        for (let i = 0, l = dbBewertungMSTTemp.length; i < l; i += 1) {
        
        switch (this.anwelcherStelleStehtdasJahr(dbBewertungMSTTemp[i].jahr)){

          case 0: {
            
            this.mstUebersichtKl.sp1 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 1: {
            this.mstUebersichtKl.sp2 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 2: {
            this.mstUebersichtKl.sp3 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 3: {
            this.mstUebersichtKl.sp4 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 4: {
            this.mstUebersichtKl.sp5 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 5: {
            this.mstUebersichtKl.sp6 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 6: {
            this.mstUebersichtKl.sp7 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 7: {
            this.mstUebersichtKl.sp8 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 8: {
            this.mstUebersichtKl.sp9 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 9: {
            this.mstUebersichtKl.sp10 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 10: {
            this.mstUebersichtKl.sp11 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 11: {
            this.mstUebersichtKl.sp12 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 12: {
            this.mstUebersichtKl.sp13 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 13: {
            this.mstUebersichtKl.sp14 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 14: {
            this.mstUebersichtKl.sp15 = dbBewertungMSTTemp[i].wert;
            break;
          }
          
        }

        if (i+1 === l){this.mstUebersicht.push(this.mstUebersichtKl);} //letzter Wert }}}}
      }
    
  }
}
    }
  }
