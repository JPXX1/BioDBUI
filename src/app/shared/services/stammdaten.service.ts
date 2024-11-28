import { Injectable } from '@angular/core';
import { MessstellenStam } from 'src/app/shared/interfaces/messstellen-stam';
import { WasserkoerperStam } from 'src/app/shared/interfaces/wasserkoerper-stam';
import { TypWrrl } from 'src/app/shared/interfaces/typ-wrrl';
import { MeldeMst } from 'src/app/shared/interfaces/melde-mst';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable} from 'rxjs';


import {Probenehmer} from 'src/app/shared/interfaces/probenehmer';


@Injectable({
  providedIn: 'root'
})
/**
 * Die `StammdatenService` Klasse bietet Methoden zur Interaktion mit verschiedenen Endpunkten
 * zur Verwaltung und Abruf von Daten zu Wasserkoerpern, Messstellen und verwandten Typen. 
 * Sie umfasst Methoden zum Abfragen, Filtern und Archivieren von Daten sowie Methoden zum 
 * Hinzufügen und Aktualisieren von Datensätzen.
 * 
 * @class
 * @property {MessstellenStam} messstellenStam - Die aktuellen Messstellendaten.
 * @property {MessstellenStam[]} messstellenarray - Array der Messstellendaten.
 * @property {MeldeMst[]} meldemst - Array der meldenden Messstellen.
 * @property {TypWrrl[]} wrrltyp - Array der WRRL-Typen.
 * @property {TypWrrl[]} diatyp - Array der Dia-Typen.
 * @property {TypWrrl[]} mptyp - Array der MP-Typen.
 * @property {TypWrrl[]} pptyp - Array der PP-Typen.
 * @property {TypWrrl[]} gewaesser - Array der Gewässertypen.
 * @property {any} mst - Allgemeine Messstellendaten.
 * @property {any} komponenten - Allgemeine Komponentendaten.
 * @property {any} diatyp_t - Temporäre Dia-Typen-Daten.
 * @property {any} mptyp_t - Temporäre MP-Typen-Daten.
 * @property {any} pptyp_t - Temporäre PP-Typen-Daten.
 * @property {any} wrrltyp_t - Temporäre WRRL-Typen-Daten.
 * @property {any} gewaesser_T - Temporäre Gewässertypen-Daten.
 * @property {any} archivMst - Archivierte Messstellendaten.
 * @property {any} archivWK - Archivierte Wasserkoerperdaten.
 * @property {any} wk - Allgemeine Wasserkoerperdaten.
 * @property {string} apiUrl - Die Basis-URL für API-Endpunkte.
 * @property {WasserkoerperStam} wkStam - Die aktuellen Wasserkoerperdaten.
 * @property {WasserkoerperStam[]} wkarray - Array der Wasserkoerperdaten.
 * 
 * @constructor
 * @param {HttpClient} httpClient - Der HTTP-Client für API-Anfragen.
 * 
 * @method holeArchivWK - Ruft asynchron archivierte Wasserkoerperdaten für einen gegebenen Parameter ab.
 * @method queryArten - Fragt Typen basierend auf angegebenen Parametern ab.
 * @method holeArchiv - Ruft asynchron archivierte Messstellendaten für einen gegebenen Parameter ab.
 * @method startwk - Startet den Workflow durch Abrufen und Filtern von Daten.
 * @method start - Startet den Prozess durch Aufrufen der Übersicht und Filtern von Daten.
 * @method getStammMst - Ruft die StammMst-Daten von der API ab.
 * @method getStammDiaTyp - Ruft die Liste der StammDiaTypen von der API ab.
 * @method getStammMpTyp - Ruft die Liste der StammMpTypen von der API ab.
 * @method getStammPpTyp - Ruft die StammPpTyp-Daten von der API ab.
 * @method getStammWrrlTyp - Ruft die WRRL-Typen von der API ab.
 * @method getKomponenten - Ruft die Liste der Komponenten vom Server ab.
 * @method getStammGewasser - Ruft die Liste der "Stamm Gewässer" von der API ab.
 * @method getWk - Ruft die Wasserkoerper (WK)-Daten von der API ab.
 * @method holeSelectDataWK - Ruft asynchron Daten mit der getWk-Methode ab und weist sie der wk-Eigenschaft zu.
 * @method callBwUebersicht - Ruft asynchron die getStammMst-Methode auf und verarbeitet jedes Element im zurückgegebenen Array.
 * @method callDiatyp - Ruft asynchron die getStammDiaTyp-Methode auf und weist das Ergebnis diatyp_t zu.
 * @method callGewaesser - Ruft asynchron die getStammGewasser-Methode auf und verarbeitet jedes Element im zurückgegebenen Array.
 * @method callMptyp - Ruft asynchron die getStammMpTyp-Methode auf und verarbeitet jedes Element im zurückgegebenen Array.
 * @method callPptyp - Ruft asynchron die getStammPpTyp-Methode auf und weist das Ergebnis pptyp_t zu.
 * @method callKomponenten - Ruft asynchron die getKomponenten-Methode auf und weist das Ergebnis komponenten zu.
 * @method callWrrltyp - Ruft asynchron die getStammWrrlTyp-Methode auf und verarbeitet das Ergebnis.
 * @method wandleTypWRRLAlle - Konvertiert den WRRL-Typ für alle Einträge in wrrltyp_t und aktualisiert das wrrltyp-Array.
 * @method wandleTypWRRL - Konvertiert den WRRL-Typ basierend auf dem angegebenen booleschen Wert für 'see'.
 * @method neueMst - Erstellt ein neues MessstellenStam-Objekt mit Standardwerten und fügt es in die Datenbank ein.
 * @method wandleTypDia - Konvertiert und filtert das diatyp_t-Array basierend auf den angegebenen Parametern.
 * @method wandleTypMP - Verarbeitet und transformiert das mptyp_t-Array basierend auf den angegebenen Parametern.
 * @method wandleTypPP - Konvertiert und filtert das pptyp_t-Array basierend auf den angegebenen Parametern und aktualisiert das pptyp-Array.
 * @method wandleGewaesser - Verarbeitet die Liste der Gewässer und aktualisiert das gewaesser-Array basierend auf den angegebenen Kriterien.
 * @method filterWK - Filtert das wk-Array basierend auf den angegebenen Kriterien und füllt das wkarray mit den gefilterten Ergebnissen.
 * @method filterMst - Filtert das mst-Array basierend auf den angegebenen Kriterien und füllt das messstellenarray mit den gefilterten Ergebnissen.
 * @method archiviereWKStamm - Archiviert die angegebenen WasserkoerperStam-Daten, indem eine POST-Anfrage an den Server gesendet wird.
 * @method insertNewMstStamm - Fügt ein neues MessstellenStam (Messstellendaten) in die Datenbank ein.
 * @method archiviereMstStamm - Archiviert die angegebenen MessstellenStam-Daten, indem eine POST-Anfrage an den Server gesendet wird.
 * @method speichereWK - Speichert die Wasserkoerperdaten, indem eine POST-Anfrage an den Server gesendet wird.
 * @method speichereMst - Speichert die Messstellendaten, indem eine POST-Anfrage an den Server gesendet wird.
 * @method getArchivMstStamm - Ruft asynchron archivierte Messstellendaten für einen gegebenen Parameter ab.
 * @method getArchivWKStamm - Ruft asynchron archivierte Wasserkoerperdaten für einen gegebenen Parameter ab.
 * @method addRowGewaesser - Fügt eine neue Zeile zur Gewässertabelle hinzu.
 * @method addRowTypWRRL - Fügt eine neue Zeile zur WRRL-Typ-Tabelle hinzu.
 * @method addRowPPWRRL - Fügt eine neue Zeile zur PP WRRL-Tabelle hinzu.
 * @method addRowMpWRRL - Fügt eine neue Zeile zur MP WRRL-Tabelle hinzu.
 * @method addRowDiaWRRL - Fügt eine neue Zeile zur Dia WRRL-Tabelle hinzu.
 * @method aktualisierePPTyp - Aktualisiert den PP-Typ in der Datenbank.
 * @method aktualisiereMpTyp - Aktualisiert den MP-Typ in der Datenbank.
 * @method aktualisiereDiaTyp - Aktualisiert den Dia-Typ in der Datenbank.
 * @method aktualisiereWrrlTyp - Aktualisiert den WRRL-Typ in der Datenbank.
 * @method aktualisiereGewaesser - Aktualisiert das Gewässer in der Datenbank.
 * @method getProbenehmer - Ruft die Liste der Probenehmer ab.
 * @method addProbenehmer - Fügt einen neuen Probenehmer hinzu.
 * @method updateProbenehmer - Aktualisiert einen bestehenden Probenehmer.
 */
/**
 * Service zur Verwaltung von Stammdaten in einer Angular-Anwendung.
 * 
 * Dieser Service bietet Methoden zum Abrufen, Speichern und Archivieren von Stammdaten
 * wie Messstellen, Wasserkoerper, Typen und Gewässer. Die Daten werden über HTTP-Anfragen
 * von einer API abgerufen und verarbeitet.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class StammdatenService {
  messstellenStam:MessstellenStam;
  public messstellenarray: MessstellenStam[];
  public meldemst:MeldeMst[];
  public wrrltyp:TypWrrl[];
  public diatyp:TypWrrl[];
  public mptyp:TypWrrl[];
  public pptyp:TypWrrl[];
  public gewaesser:TypWrrl[];
  public mst:any;

  public komponenten:any;
  public diatyp_t:any;
  public mptyp_t:any;
  public pptyp_t:any;
  public wrrltyp_t:any;
  public gewaesser_T:any;
  public archivMst:any;
  public archivWK:any;
  constructor( private httpClient: HttpClient) {}
  public wk:any;
  private apiUrl = environment.apiUrl;
  wkStam:WasserkoerperStam;
  public wkarray:WasserkoerperStam[];


  /**
     * Ruft asynchron Archivdaten für einen gegebenen Parameter ab.
     *
     * @param {number} parameter - Der Parameter, der verwendet wird, um die Archivdaten abzurufen.
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Archivdaten abgerufen wurden.
     */
  async holeArchivWK(parameter :number){
    await this.getArchivWKStamm(parameter);
  
  }
  


  /**
   * Fragt Arten basierend auf den angegebenen Parametern ab.
   *
   * @param {string} type - Der Typ der Abfrage, die durchgeführt werden soll.
   * @param {number[]} ids - Ein Array von IDs, die in die Abfrage einbezogen werden sollen.
   * @param {number} yearFrom - Das Startjahr für den Abfragezeitraum.
   * @param {number} yearTo - Das Endjahr für den Abfragezeitraum.
   * @param {number[]} selectedItems - Ein Array von ausgewählten Element-IDs, die in die Abfrage einbezogen werden sollen.
   * @returns {Observable<any>} Ein Observable, das die Abfrageergebnisse enthält.
   */
  queryArten(type: string,  ids: number[], yearFrom: number, yearTo: number, selectedItems: number[]): Observable<any> {
   
    return this.httpClient.post<any>(`${this.apiUrl}/queryArten`, { type, ids, yearFrom, yearTo, selectedItems });
  }
/**
 * Ruft asynchron Archivdaten basierend auf dem angegebenen Parameter ab.
 *
 * @param {number} parameter - Der Parameter, der verwendet wird, um die Archivdaten abzurufen.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Archivdaten abgerufen wurden.
 */
async holeArchiv(parameter :number){
  await this.getArchivMstStamm(parameter);

}
/**
 * Initiates the workflow by fetching and filtering data.
 * 
 * @param kat - Ein Boolean, der angibt, ob ein bestimmter Kategorienfilter angewendet werden soll.
 * @param allewk - Ein Boolean, der angibt, ob alle Workflow-Elemente einbezogen werden sollen.
 * @returns Ein Promise, das aufgelöst wird, wenn die Workflow-Initiierung abgeschlossen ist.
 */
async startwk(kat:boolean,allewk:boolean){
  await this.holeSelectDataWK();
 
  await  this.filterWK(kat,allewk);
  //console.log(this.wk);
    }

  /**
   * Startet den Prozess, indem die Übersicht aufgerufen und die Daten gefiltert werden.
   * 
   * @param {boolean} kat - Ein boolescher Parameter zur Bestimmung der Kategorie.
   * @param {boolean} allemst - Ein boolescher Parameter zur Bestimmung, ob alle Elemente einbezogen werden sollen.
   * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn der Prozess abgeschlossen ist.
   */
  
  async start(kat:boolean,allemst:boolean){
    await this.callBwUebersicht();
    //console.log(this.mst);
    await  this.filterMst(kat,allemst);
    //console.log(this.mst);
      }
  /**
   * Ruft die StammMst-Daten von der API ab.
   *
   * @returns Ein Observable, das die StammMst-Daten enthält.
   */
  getStammMst() {
    return this.httpClient.get(`${this.apiUrl}/stamMst`);
  }
  /**
   * Ruft die Liste der StammDiaTypen von der API ab.
   *
   * @returns Ein Observable, das die Antwort von der API enthält.
   */
  getStammDiaTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamDiaTypen`);
  }
  /**
   * Ruft die Liste der StammMpTypen von der API ab.
   *
   * @returns Ein Observable, das die Antwort von der API enthält.
   */
  getStammMpTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamMpTypen`);
  }
  /**
   * Ruft die StammPpTyp-Daten von der API ab.
   *
   * @returns Ein Observable, das die Antwort von der API enthält.
   */
  getStammPpTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamPPTypen`);
  }
  /**
   * Ruft die WRRL-Typen von der API ab.
   *
   * @returns Ein Observable, das die WRRL-Typen enthält.
   */
  getStammWrrlTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamWRRLTypen`);
  }


  /**
   * Ruft die Liste der Komponenten vom Server ab.
   *
   * @returns Ein Observable, das die Liste der Komponenten enthält.
   */
  getKomponenten(){
    return this.httpClient.get(`${this.apiUrl}/tblkomp`);
    
  }
 
    /**
     * Ruft die Liste der "Stamm Gewässer" von der API ab.
     *
     * @returns Ein Observable, das die Antwort von der API enthält.
     */
  getStammGewasser() {
    
    return this.httpClient.get(`${this.apiUrl}/stamGewaesser`);
  }
/**
 * Ruft die Wasserkoerper (WK) Daten von der API ab.
 * 
 * @returns Ein Observable, das die WK-Daten enthält.
 */

 public  getWk() {
    return this.httpClient.get(`${this.apiUrl}/stamWK`); //stamWasserkoerper   
  }
    
     
  /**
   * Ruft asynchron Daten mit der Methode `getWk` ab und weist sie der Eigenschaft `wk` zu.
   * Die Methode wartet, bis die `getWk`-Methode abgeschlossen ist und iteriert über die zurückgegebenen Daten.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Datenabfrage und -zuweisung abgeschlossen ist.
   */
   async holeSelectDataWK() {
   
      await this.getWk().forEach(formen_ => {
        this.wk  = formen_;
        // console.log(formen_);
        // return formen_;
      });  
    
     }

    /**
     * Ruft asynchron die Methode `getStammMst` auf und verarbeitet jedes Element im zurückgegebenen Array.
     * Die Methode weist jedes Element der Eigenschaft `mst` zu.
     *
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn alle Elemente verarbeitet wurden.
     */
    async callBwUebersicht() {

      await this.getStammMst().forEach(formen_ => {
        this.mst = formen_;
        // console.log(formen_);
      });
    }
    /**
     * Ruft asynchron die Methode `getStammDiaTyp` auf und weist das Ergebnis `diatyp_t` zu.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async callDiatyp() {

      await this.getStammDiaTyp().forEach(formen_ => {
        this.diatyp_t = formen_;
        // console.log(formen_);
      });
    }
    /**
     * Ruft asynchron die Methode `getStammGewasser` auf und verarbeitet jedes Element im zurückgegebenen Array.
     * 
     * Diese Methode wartet auf den Abschluss der Methode `getStammGewasser`, die ein Array von Elementen zurückgibt.
     * Anschließend iteriert sie über jedes Element im Array und weist es der Eigenschaft `gewaesser_T` zu.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn alle Elemente verarbeitet wurden.
     */
    async callGewaesser() {

      await this.getStammGewasser().forEach(formen_ => {
        this.gewaesser_T = formen_;
        // console.log(formen_);
      });
    }
    /**
     * Ruft asynchron die Methode `getStammMpTyp` auf und verarbeitet jedes Element im zurückgegebenen Array.
     * 
     * Diese Methode wartet auf den Abschluss der Methode `getStammMpTyp`, die ein Array von Elementen zurückgibt.
     * Anschließend iteriert sie über jedes Element im Array, weist es der Eigenschaft `mptyp_t` zu und gibt es in der Konsole aus.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async callMptyp() {

      await this.getStammMpTyp().forEach(formen_ => {
        this.mptyp_t = formen_;
        console.log(formen_);
      });
    }
    /**
     * Ruft asynchron die Methode `getStammPpTyp` auf und weist das Ergebnis `pptyp_t` zu.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async callPptyp() {

      await this.getStammPpTyp().forEach(formen_ => {
        this.pptyp_t = formen_;
        // console.log(formen_);
      });
    }

  
    /**
     * Ruft asynchron die Methode `getKomponenten` auf und weist das Ergebnis der Eigenschaft `komponenten` zu.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async callKomponenten() {

      await this.getKomponenten().forEach(formen_ => {
        this.komponenten = formen_;
        // console.log(formen_);
      });
    }
    /**
     * Ruft asynchron die Methode `getStammWrrlTyp` auf und verarbeitet das Ergebnis.
     * 
     * Diese Methode wartet auf den Abschluss des `getStammWrrlTyp` Observables und weist
     * die ausgegebenen Werte der Eigenschaft `wrrltyp_t` zu.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async callWrrltyp() {

      await this.getStammWrrlTyp().forEach(formen_ => {
        this.wrrltyp_t = formen_;
        // console.log(formen_);
      });
    }
    /**
     * Konvertiert den WRRL-Typ für alle Einträge in `wrrltyp_t` und aktualisiert das `wrrltyp` Array.
     * 
     * Diese Methode iteriert über das `wrrltyp_t` Array und überprüft für jeden Eintrag die `seefliess` Eigenschaft.
     * Wenn `seefliess` nicht null ist, bestimmt sie den Wert von `fliess` basierend auf dem Wert von `seefliess`.
     * Anschließend wird ein Objekt, das die Eigenschaften `id`, `wrrl_typ`, `seefliess` und `fliess` enthält, in das `wrrltyp` Array eingefügt.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
     */
    async wandleTypWRRLAlle(){
      
      let temp: any = this.wrrltyp_t;
      this.wrrltyp=[];
      temp.map(async (f) => {
      if (f.seefliess!==null){
        let fliess:boolean;
      if (f.seefliess===true){fliess=false;}
      if (f.seefliess===false){fliess=true;}
        this.wrrltyp.push({id:f.id,typ:f.wrrl_typ,seefliess:f.seefliess,fliess:fliess})}
      })
    }
    /**
     * Konvertiert den WRRL-Typ basierend auf dem angegebenen booleschen Wert für 'see'.
     * 
     * @param see - Ein boolescher Wert, der angibt, ob der Typ für 'see' (true) oder 'fliess' (false) ist.
     * 
     * Die Funktion initialisiert eine lokale boolesche Variable 'fliess' basierend auf dem Wert von 'see'.
     * Anschließend iteriert sie über das 'wrrltyp_t'-Array und filtert die Elemente, bei denen 'seefliess' mit dem 'see'-Wert übereinstimmt oder null ist.
     * Die gefilterten Elemente werden dann in das 'wrrltyp'-Array mit einer zusätzlichen 'fliess'-Eigenschaft eingefügt.
     */
    async wandleTypWRRL(see:boolean){
      let fliess:boolean;
      if (see===true){fliess=false;}
      if (see===false){fliess=true;}
      let temp: any = this.wrrltyp_t;
      this.wrrltyp=[];
      temp.map(async (f) => {
        if (f.seefliess===see || f.seefliess===null){
        this.wrrltyp.push({id:f.id,typ:f.wrrl_typ,seefliess:f.seefliess,fliess:fliess})}
      })
    }

    
  /**
   * Erstellt ein neues MessstellenStam-Objekt mit Standardwerten und fügt es in die Datenbank ein.
   * 
   * @param seefliess - Ein boolescher Wert, der angibt, ob die Messstelle ein See (true) oder ein Fluss (false) ist.
   * @returns Ein Observable, das das neu erstellte MessstellenStam-Objekt ausgibt.
   * 
   * Die Funktion initialisiert ein neues MessstellenStam-Objekt mit Standardwerten und ruft die Methode `insertNewMstStamm` auf, um es in die Datenbank einzufügen.
   * Wenn das Einfügen erfolgreich ist und die Antwort eine ID enthält, wird das neue MessstellenStam-Objekt mit der ID aus der Antwort aktualisiert und dem `messstellenarray` hinzugefügt.
   * Der Observer gibt dann das neue MessstellenStam-Objekt aus und schließt ab.
   * Wenn die Antwort keine ID enthält oder ein Fehler beim Einfügen auftritt, gibt der Observer einen Fehler aus.
   */
  
   neueMst(seefliess: boolean) : Observable<MessstellenStam>{


    const messstellenStam_neu: MessstellenStam = {
      id_mst: 0,
      namemst: 'neue Messstelle',
      idgewaesser: 36,
      gewaessername: '',
      ortslage: '',
      see: seefliess,
      melde_mst: 1,
      melde_mst_str: '',
      repraesent: false,
      wrrl_typ: 5,
      mp_typ: 4,
      id_wk: 17,
      wk_name: '',
      eu_cd_sm: null,
      dia_typ: 5,
      pp_typ: 7,
      hw_etrs: 5821570,
      rw_etrs: 393198,
      updated_at: null,
    };
  
    return new Observable<MessstellenStam>((observer) => {
      this.insertNewMstStamm(messstellenStam_neu).subscribe({
        next: (response) => {
          
          if (response && response.id_mst) {
            const neueMst: MessstellenStam = { ...messstellenStam_neu };
            
            neueMst.id_mst = response.id_mst;
            this.messstellenarray.push(neueMst);
            observer.next(neueMst);
            observer.complete();
          } else {
            console.error('Response does not contain an id', response);
            observer.error('Response does not contain an id');
          }
        },
        error: (error) => {
          console.error('Error adding row:', error);
          observer.error(error);
        }
      });
    });
  }
  
 
 

   
    
    /**
     * Konvertiert und filtert das `diatyp_t` Array basierend auf den angegebenen Parametern.
     * 
     * @param diatypbearbeiten - Ein boolescher Wert, der angibt, ob der Dia-Typ bearbeitet werden soll.
     * @param seefliess - Ein boolescher Wert, der den Seefliess-Zustand angibt, nach dem gefiltert werden soll, oder null, um den Fliess-Zustand umzuschalten.
     * 
     * @returns Ein Promise, das aufgelöst wird, wenn die Konvertierung und Filterung abgeschlossen ist.
     */
    async wandleTypDia(diatypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.diatyp_t;
      this.diatyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
          if (f.seefliess===true){fliess=false;}
          if (f.seefliess===false){fliess=true;}
          if ((f.dia_typ!=='kein Typ' && diatypbearbeiten===true) || diatypbearbeiten===false){
          this.diatyp.push({id:f.id_dia,typ:f.dia_typ,seefliess:f.seefliess,fliess:fliess})}}else{
            if (f.seefliess===seefliess || f.seefliess===null )
              {  this.diatyp.push({id:f.id_dia,typ:f.dia_typ,seefliess:f.seefliess,fliess:fliess})}
          }
      })
      }
    /**
     * Verarbeitet und transformiert asynchron das `mptyp_t` Array basierend auf den angegebenen Parametern.
     * 
     * @param mptypbearbeiten - Ein boolescher Wert, der angibt, ob der Typ bearbeitet werden soll.
     * @param seefliess - Ein boolescher Wert, der den Fließzustand angibt, oder null, um alle Fließzustände zu verarbeiten.
     * 
     * @returns Ein Promise, das aufgelöst wird, wenn die Transformation abgeschlossen ist.
     */
    async wandleTypMP(mptypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.mptyp_t;
      this.mptyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
          if (f.seefliess===true){fliess=false;}
          if (f.seefliess===false){fliess=true;}
          if ((f.mp_typ!=='kein Typ' && mptypbearbeiten===true) || mptypbearbeiten===false){
          this.mptyp.push({id:f.id,typ:f.mp_typ,seefliess:f.seefliess,fliess:fliess})}}else{
            if (f.seefliess===seefliess || f.seefliess===null )
              {  this.mptyp.push({id:f.id,typ:f.mp_typ,seefliess:f.seefliess,fliess:fliess})}
          }
      })
      }
    /**
     * Konvertiert und filtert das `pptyp_t` Array basierend auf den angegebenen Parametern und aktualisiert das `pptyp` Array.
     *
     * @param pptypbearbeiten - Ein boolescher Wert, der angibt, ob das `pptyp` Array bearbeitet werden soll.
     * @param seefliess - Ein boolescher Wert oder null, um das `pptyp_t` Array basierend auf der `seefliess` Eigenschaft zu filtern.
     * 
     * Die Funktion verarbeitet jedes Element im `pptyp_t` Array und fügt die gefilterten und transformierten Elemente
     * in das `pptyp` Array ein. Wenn `seefliess` null ist, wird die `fliess` Eigenschaft basierend auf dem `seefliess` Wert
     * jedes Elements umgeschaltet. Wenn `seefliess` nicht null ist, werden die Elemente basierend auf dem `seefliess` Wert gefiltert.
     */
    async wandleTypPP(pptypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.pptyp_t;
      this.pptyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
        if (f.seefliess===true){fliess=false;}
        if (f.seefliess===false){fliess=true;}
        if ((f.pp_typ!=='kein Typ' && pptypbearbeiten===true) || pptypbearbeiten===false){
        this.pptyp.push({id:f.id,typ:f.pp_typ,seefliess:f.seefliess,fliess:fliess})}}else{
          if (f.seefliess===seefliess || f.seefliess===null )
            {  this.pptyp.push({id:f.id,typ:f.pp_typ,seefliess:f.seefliess,fliess:fliess})}
        }
    })
    }
    /**
     * Verarbeitet die Liste der Gewässer und aktualisiert das `gewaesser` Array basierend auf den angegebenen Kriterien.
     * 
     * @param gewaesserbearbeiten - Ein boolesches Flag, das angibt, ob Gewässer zur Bearbeitung verarbeitet werden sollen.
     * 
     * Die Funktion iteriert über das `gewaesser_T` Array und überprüft die Kategorie jedes Gewässers.
     * Wenn die Kategorie 'f' ist, wird es als fließendes Gewässer betrachtet; bei 's' als See.
     * Abhängig vom `gewaesserbearbeiten` Flag und dem Namen des Gewässers fügt sie das verarbeitete
     * Gewässer dem `gewaesser` Array mit seiner ID, Typ und ob es ein See oder fließendes Gewässer ist, hinzu.
     */
    async wandleGewaesser(gewaesserbearbeiten:boolean){
      let fliess:boolean;let see:boolean;
      let temp: any = this.gewaesser_T;
      this.gewaesser=[];
      temp.map(async (f) => {
        if (f.kategorie==='f'){fliess=true;see=false;}else
        if (f.kategorie==='s'){fliess=false;see=true;}
        if ((gewaesserbearbeiten===true && f.gewaessername!=='n.b.')|| (gewaesserbearbeiten===false))
        {this.gewaesser.push({id:f.idgewaesser,typ:f.gewaessername,seefliess:see,fliess:fliess})}
      })
    }
    /**
     * Filtert das `wk` Array basierend auf den angegebenen Kriterien und füllt das `wkarray` mit den gefilterten Ergebnissen.
     * 
     * @param kat - Ein Boolean, der die Kategorie angibt, nach der gefiltert werden soll.
     * @param allewk - Ein Boolean, der angibt, ob alle Elemente einbezogen oder nach der Kategorie gefiltert werden sollen.
     * 
     * @returns Ein Promise, das aufgelöst wird, wenn die Filteroperation abgeschlossen ist.
     * 
     * Die Funktion führt die folgenden Schritte aus:
     * 1. Initialisiert eine temporäre Variable `temp` mit dem Wert von `wk`.
     * 2. Leert das `wkarray`.
     * 3. Iteriert über jedes Element in `temp` und wendet die Filterlogik an:
     *    - Wenn `allewk` `false` ist, wird überprüft, ob die `see` Eigenschaft des Elements mit dem `kat` Wert übereinstimmt.
     *    - Wenn `allewk` `true` ist, werden alle Elemente einbezogen.
     * 4. Fügt die gefilterten Elemente mit ihren jeweiligen Eigenschaften in das `wkarray` ein.
     */
    async filterWK(kat:boolean,allewk:boolean){

   
      let temp: any = this.wk;

      this.wkarray =[];
     
      await Promise.all(
        temp.map(async (f) => {
                  
            
         
    if (allewk===false){
          if (f.see===kat){
    
          //erzeugt Array mit WK
          
         let gewasserart:boolean=true;
            this.wkarray.push({ id:f.id,
              wk_name: f.wk_name,
              see:f.see,
              kuenstlich:f.kuenstlich,
              hmwb:f.hmwb,
              eu_cd_wb:f.eu_cd_wb,
              bericht_eu:f.bericht_eu,
              kuerzel:f.kuerzel,
              id_gewaesser:f.id_gewaesser,
              land:f.land,
              wrrl_typ:f.wrrl_typ,
              mp_typ:f.mp_typ,
              dia_typ:f.dia_typ,
              pp_typ:f.pp_typ,
              pp_typ_str:f.pp_typ_str,
              dia_typ_str:f.dia_typ_str,
              mp_typ_str:f.mp_typ_str,
              wrrl_typ_str:f.wrrl_typ_str,
              gewaessername:f.gewaessername,
              updated_at:f.updated_at});
           
            // this.messstellenarray.push(this.messstellenStam);
            // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
    }}else{let gewasserart:boolean=true;
      this.wkarray.push({ id:f.id,
        wk_name: f.wk_name,
        see:f.see,
        kuenstlich:f.kuenstlich,
        hmwb:f.hmwb,
        eu_cd_wb:f.eu_cd_wb,
        bericht_eu:f.bericht_eu,
        kuerzel:f.kuerzel,
        id_gewaesser:f.id_gewaesser,
        land:f.land,
        wrrl_typ:f.wrrl_typ,
        mp_typ:f.mp_typ,
        dia_typ:f.dia_typ,
        pp_typ:f.pp_typ,
        pp_typ_str:f.pp_typ_str,
        dia_typ_str:f.dia_typ_str,
        mp_typ_str:f.mp_typ_str,
        wrrl_typ_str:f.wrrl_typ_str,
        gewaessername:f.gewaessername,
        updated_at:f.updated_at});}})
    )
     //console.log (this.wkarray);

    }
/**
 * Filtert das `mst`-Array basierend auf den angegebenen Kriterien und füllt das `messstellenarray` mit den gefilterten Ergebnissen.
 * 
 * @param kat - Ein Boolean, der die Kategorie angibt, nach der gefiltert werden soll.
 * @param alleMst - Ein Boolean, der angibt, ob alle Elemente einbezogen oder nach Kategorie gefiltert werden sollen.
 * 
 * @returns Ein Promise, das aufgelöst wird, wenn der Filtervorgang abgeschlossen ist.
 * 
 * Die Funktion führt die folgenden Schritte aus:
 * 1. Initialisiert eine temporäre Variable `temp` mit dem Wert von `mst`.
 * 2. Löscht das `messstellenarray` und `meldemst`.
 * 3. Iteriert über jedes Element in `temp` und wendet die Filterlogik an:
 *    - Wenn `alleMst` `false` ist, wird überprüft, ob die `see`-Eigenschaft des Elements mit dem `kat`-Wert übereinstimmt.
 *    - Wenn `alleMst` `true` ist, werden alle Elemente einbezogen.
 * 4. Fügt die gefilterten Elemente mit ihren jeweiligen Eigenschaften dem `messstellenarray` hinzu.
 */
async filterMst(kat: boolean, alleMst: boolean) {
  let temp: any = this.mst;

  this.messstellenarray = [];
  this.meldemst = [];
  await Promise.all(
    temp.map(async (f) => {
      if (alleMst === false) {
        if (f.see === kat) {
          // Creates an array with reporting measurement points
          if (f.repraesent_mst === true) {
            this.meldemst.push({ id_mst: f.id_mst, namemst: f.namemst, repraesent: f.repraesent_mst });
          }
          this.messstellenarray.push({
            id_mst: f.id_mst,
            namemst: f.namemst,
            idgewaesser: f.idgewaesser,
            gewaessername: f.gewaessername,
            wk_name: f.wk_name,
            ortslage: f.ortslage,
            see: f.see,
            repraesent: f.repraesent_mst,
            melde_mst_str: f.melde_mst_str,
            melde_mst: f.melde_mst,
            wrrl_typ: f.wrrl_typ,
            mp_typ: f.mp_typ,
            id_wk: f.id_wk,
            eu_cd_sm: f.eu_cd_sm,
            dia_typ: f.dia_typ,
            pp_typ: f.pp_typ,
            hw_etrs: f.hw_etrs,
            rw_etrs: f.rw_etrs,
            updated_at: f.updated_at
          });
        }
      } else {
        this.messstellenarray.push({
          id_mst: f.id_mst,
          namemst: f.namemst,
          idgewaesser: f.idgewaesser,
          gewaessername: f.gewaessername,
          wk_name: f.wk_name,
          ortslage: f.ortslage,
          see: f.see,
          repraesent: f.repraesent_mst,
          melde_mst_str: f.melde_mst_str,
          melde_mst: f.melde_mst,
          wrrl_typ: f.wrrl_typ,
          mp_typ: f.mp_typ,
          id_wk: f.id_wk,
          eu_cd_sm: f.eu_cd_sm,
          dia_typ: f.dia_typ,
          pp_typ: f.pp_typ,
          hw_etrs: f.hw_etrs,
          rw_etrs: f.rw_etrs,
          updated_at: f.updated_at
        });
      }
    })
  );
}



//fügt die gesamten WK ins Archiv ein
/**
 * Archiviert die angegebenen WasserkoerperStam-Daten, indem eine POST-Anfrage an den Server gesendet wird.
 * 
 * @param wasserkoerperStam - Das WasserkoerperStam-Objekt, das die zu archivierenden Daten enthält.
 * @returns void
 */
archiviereWKStamm(wasserkoerperStam:WasserkoerperStam){
         const body = new HttpParams()
        .set('id',wasserkoerperStam.id)
        .set('wk_name', wasserkoerperStam.wk_name)
        .set('see',wasserkoerperStam.see)
       
        .set('kuenstlich',wasserkoerperStam.kuenstlich)
        .set('hmwb',wasserkoerperStam.hmwb)
        .set('bericht_eu',wasserkoerperStam.bericht_eu)
        .set('id_gewaesser',wasserkoerperStam.id_gewaesser)
        .set('eu_cd_wb',wasserkoerperStam.eu_cd_wb)
        .set('land',wasserkoerperStam.land)
        .set('wrrl_typ',wasserkoerperStam.wrrl_typ)
        .set('dia_typ',wasserkoerperStam.dia_typ)
        .set('pp_typ',wasserkoerperStam.pp_typ)
        .set('mp_typ',wasserkoerperStam.mp_typ)
        .set('updated_at', wasserkoerperStam.updated_at)
        this.httpClient.post(`${this.apiUrl}/insertArchivStammWK`, body).subscribe(resp => {
    console.log("response %o, ", resp);  });
 }
 //fügt eine neue Mst in Stam_Messstellen ein
/**
 * Fügt ein neues MessstellenStam (Messpunktdaten) in die Datenbank ein.
 *
 * @param {MessstellenStam} messstellenStam - Die einzufügenden Messpunktdaten.
 * @returns {Observable<any>} Ein Observable, das die Antwort vom Server ausgibt.
 */

 insertNewMstStamm(messstellenStam: MessstellenStam): Observable<any> {
  const body = new HttpParams()
    .set('namemst', messstellenStam.namemst)
    .set('idgewaesser', messstellenStam.idgewaesser)
    .set('ortslage', messstellenStam.ortslage)
    .set('see', messstellenStam.see) // Konvertiere Boolean zu String
    .set('repraesent', messstellenStam.repraesent) // Konvertiere Boolean zu String
    .set('wrrl_typ', messstellenStam.wrrl_typ)
    .set('mp_typ', messstellenStam.mp_typ)
    .set('id_wk', messstellenStam.id_wk)
    .set('eu_cd_sm', messstellenStam.eu_cd_sm ? messstellenStam.eu_cd_sm.toString() : '')
    .set('dia_typ', messstellenStam.dia_typ)
    .set('pp_typ', messstellenStam.pp_typ)
    .set('rw_etrs', messstellenStam.rw_etrs)
    .set('hw_etrs', messstellenStam.hw_etrs)
    .set('melde_mst', messstellenStam.melde_mst );

  return this.httpClient.post<any>(`${this.apiUrl}/addNewMst`, body);
}


//fügt die gesamte Mst ins archiv ein
/**
 * Archiviert die angegebenen MessstellenStam-Daten, indem eine POST-Anfrage an den Server gesendet wird.
 *
 * @param messstellenStam - Das MessstellenStam-Objekt, das die zu archivierenden Daten enthält.
 * @property {string} id_mst - Die ID der MessstellenStam.
 * @property {string} namemst - Der Name der MessstellenStam.
 * @property {string} idgewaesser - Die ID des Gewässers.
 * @property {string} ortslage - Die Lage der MessstellenStam.
 * @property {string} see - Das See-Attribut der MessstellenStam.
 * @property {string} repraesent - Das Repräsentations-Attribut der MessstellenStam.
 * @property {string} wrrl_typ - Der WRRL-Typ der MessstellenStam.
 * @property {string} mp_typ - Der MP-Typ der MessstellenStam.
 * @property {string} id_wk - Die ID des WK.
 * @property {string} eu_cd_sm - Das EU CD SM-Attribut der MessstellenStam.
 * @property {string} dia_typ - Der DIA-Typ der MessstellenStam.
 * @property {string} pp_typ - Der PP-Typ der MessstellenStam.
 * @property {string} rw_etrs - Die RW ETRS-Koordinate der MessstellenStam.
 * @property {string} hw_etrs - Die HW ETRS-Koordinate der MessstellenStam.
 * @property {string} melde_mst - Das Melde MST-Attribut der MessstellenStam.
 * @property {string} updated_at - Der Zeitstempel, wann die MessstellenStam zuletzt aktualisiert wurde.
 */

archiviereMstStamm(messstellenStam:MessstellenStam){

  const body = new HttpParams()
  .set('id_mst',messstellenStam.id_mst)
  .set('namemst', messstellenStam.namemst)
  .set('idgewaesser',messstellenStam.idgewaesser)
  .set('ortslage',messstellenStam.ortslage)
  .set('see',messstellenStam.see)
  .set('repraesent',messstellenStam.repraesent)
  .set('wrrl_typ',messstellenStam.wrrl_typ)
  .set('mp_typ',messstellenStam.mp_typ)
  .set('id_wk',messstellenStam.id_wk)
  .set('eu_cd_sm',messstellenStam.eu_cd_sm)
  .set('dia_typ',messstellenStam.dia_typ)
  .set('pp_typ',messstellenStam.pp_typ)
  .set('rw_etrs',messstellenStam.rw_etrs)
  .set('hw_etrs',messstellenStam.hw_etrs)
  .set('melde_mst', messstellenStam.melde_mst)
  .set('updated_at', messstellenStam.updated_at)


  
  this.httpClient.post(`${this.apiUrl}/insertArchivStammMst`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });
  
         
    
     //   const { id_mst,namemst, idgewaesser, ortslage, see, repraesent, natürlich, wrrl_typ, mp_typ, id_wk, eu_cd_sm, dia_typ, pp_typ, hw_etrs, rw_etrs, melde_mst } = request.body;
   
}

/**
 * Speichert die Stammdaten des Wasserkörpers.
 * 
 * Diese Methode sendet eine POST-Anfrage an den Server, um die bereitgestellten
 * Stammdaten des Wasserkörpers zu speichern. Die Daten werden als HttpParams
 * im Body der Anfrage gesendet.
 * 
 * @param wasserkoerperStam - Ein Objekt vom Typ `WasserkoerperStam`, das die
 *                            zu speichernden Stammdaten enthält.
 * 
 * @returns void
 */
speichereWK(wasserkoerperStam:WasserkoerperStam){
  const body = new HttpParams()
  .set('id',wasserkoerperStam.id)
  .set('wk_name',wasserkoerperStam.wk_name)
  .set('see', wasserkoerperStam.see)
  .set('kuenstlich', wasserkoerperStam.kuenstlich)
  .set('hmwb',wasserkoerperStam.hmwb)
  .set('bericht_eu',wasserkoerperStam.bericht_eu)
  .set('id_gewaesser',wasserkoerperStam.id_gewaesser)
  .set('eu_cd_wb',wasserkoerperStam.eu_cd_wb)
  .set('land',wasserkoerperStam.land)
  .set('wrrl_typ',wasserkoerperStam.wrrl_typ)
  .set('mp_typ',wasserkoerperStam.mp_typ)
  .set('dia_typ',wasserkoerperStam.dia_typ)
  .set('pp_typ',wasserkoerperStam.pp_typ)

  
  this.httpClient.post(`${this.apiUrl}/insertStammWK`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });    
     
}
speichereMst(messstellenStam:MessstellenStam){
 
  const body = new HttpParams()
  .set('id_mst',messstellenStam.id_mst)
  .set('id_wk',messstellenStam.id_wk)
  .set('idgewaesser', messstellenStam.idgewaesser)
  .set('namemst', messstellenStam.namemst)
  .set('ortslage',messstellenStam.ortslage)
  .set('repraesent',messstellenStam.repraesent)
  .set('rw_etrs',messstellenStam.rw_etrs)
  .set('hw_etrs',messstellenStam.hw_etrs)
  .set('see',messstellenStam.see)
  


  
  this.httpClient.post(`${this.apiUrl}/insertStammMst`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });    
}



async getArchivMstStamm(parameter :number){ 

  let params = new HttpParams().set('mstid',parameter);
  console.log(params.toString())
 


  await this.httpClient.get(`${this.apiUrl}/arStammMst`, {params}).forEach(formen_ => {
    this.archivMst = formen_;
    console.log(formen_);

   


  });

  
  }
  async getArchivWKStamm(parameter :number){ 

    let params = new HttpParams().set('id',parameter);
    console.log(params.toString())
   
  
  
    await this.httpClient.get(`${this.apiUrl}/arStammWK`, {params}).forEach(formen_ => {
      this.archivWK = formen_;
      console.log(formen_);
  
     
  
  
    });
  
    
    }
    
    addRowGewaesser(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addGewaesser`, data);
    }
    addRowTypWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addTypWrrl`, data);
    }

    addRowPPWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addPPWrrl`, data);
    }
    addRowMpWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addMpWrrl`, data);
    }
    addRowDiaWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addDiaWrrl`, data);
    }
    aktualisierePPTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('pp_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamPPTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereMpTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('mp_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamMpTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereDiaTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id_dia',id)
      .set('dia_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamDiaTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereWrrlTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('wrrl_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamWrrlTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereGewaesser(gewaessername:string,id:number,seefliess:boolean){
      let kat:string;
      if (seefliess===true){kat='s'}else{kat='f'}
      const body = new HttpParams()
      .set('id',id)
      .set('name',gewaessername)
      .set('kategorie',kat)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamGewaesser`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    getProbenehmer(): Observable<Probenehmer[]> {
      return this.httpClient.get<Probenehmer[]>(`${this.apiUrl}/impProbenehmer`);
    }
    
    addProbenehmer(data: Partial<Probenehmer>): Observable<Probenehmer> {
      return this.httpClient.post<Probenehmer>(`${this.apiUrl}/addprobenehmer`, data);
    }
    
    // addProbenehmer(data: Partial<Probenehmer>): Observable<Probenehmer> {
    //   return this.httpClient.post<Probenehmer>(`${this.apiUrl}/addprobenehmer`, data);
    // }
  
    updateProbenehmer(data: Partial<Probenehmer>): Observable<Probenehmer> {
      return this.httpClient.put<Probenehmer>(`${this.apiUrl}/probenehmer`, data);
    }
    deleteProbenehmer(data: Partial<Probenehmer>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_probenehmer`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    deletePPtyp(data: Partial<TypWrrl>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_pptyp`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    deleteMPtyp(data: Partial<TypWrrl>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_mptyp`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    deleteMessstelle(data: Partial<MessstellenStam>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_messstelle`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    deletewrrltyp(data: Partial<TypWrrl>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_wrrltyp`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    deleteDiatyp(data: Partial<TypWrrl>): Observable<{ message: string }> {
      return this.httpClient.delete<{ message: string }>(`${this.apiUrl}/del_diatyp`, {
        body: data, // Include the body as part of the DELETE request
      });
    }
    // deleteProbenehmer(data: Partial<Probenehmer>): Observable<Probenehmer> {
    //   return this.httpClient.delete<Probenehmer>(`${this.apiUrl}/del_probenehmer`,data);
    // }
    
}