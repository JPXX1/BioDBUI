import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
/**
 * Dienst zum Interagieren mit der VerbreitungArten-API.
 * 
 * @class VerbreitungartenService
 * @constructor
 * @param {HttpClient} httpClient - Der HTTP-Client für Anfragen.
 * 
 * @property {string} apiUrl - Die Basis-URL für die API.
 * @property {any[]} dbKomponenten - Array zum Speichern von Komponentendaten.
 * @property {any[]} dbArten - Array zum Speichern von Artendaten.
 * @property {any[]} dbArtenListe - Array zum Speichern einer eindeutigen Artenliste.
 * 
 * @method getArten - Ruft Artendaten von der API ab.
 * @param {number} min - Minimalwert für den Abfrageparameter.
 * @param {number} max - Maximalwert für den Abfrageparameter.
 * @param {number} id_komponente - Komponenten-ID für den Abfrageparameter.
 * @returns {Promise<any[]>} - Ein Promise, das ein Array von Artendaten auflöst.
 * 
 * @method getVerbreitungArtenListe - Ruft die Artenliste von der API ab.
 * @returns {Promise<any[]>} - Ein Promise, das ein Array von Artenlisten auflöst.
 * 
 * @method getKomponenten - Ruft Komponentendaten von der API ab.
 * @returns {Promise<any[]>} - Ein Promise, das ein Array von Komponentendaten auflöst.
 * 
 * @method callArten - Ruft getArten auf und verarbeitet die Daten, um dbArten und dbArtenListe zu füllen.
 * @param {number} min - Minimalwert für den Abfrageparameter.
 * @param {number} max - Maximalwert für den Abfrageparameter.
 * @param {number} id_komponente - Komponenten-ID für den Abfrageparameter.
 * 
 * @method callKomponenten - Ruft getKomponenten auf und verarbeitet die Daten, um dbKomponenten zu füllen.
 */
export class VerbreitungartenService {


  private apiUrl = environment.apiUrl;
  public dbKomponenten: any[] = [];public dbArten: any[] = [];;public dbArtenListe: any[] = [];  // Initialisiere dbArtenListe als leeres Array
  constructor(private httpClient: HttpClient) {}




  /**
   * Ruft eine Liste von "VerbreitungArten" von der API basierend auf den angegebenen Parametern ab.
   *
   * @param min - Der Minimalwert für den Abfrageparameter.
   * @param max - Der Maximalwert für den Abfrageparameter.
   * @param id_komponente - Die ID der Komponente für den Abfrageparameter.
   * @returns Ein Promise, das ein Array von "VerbreitungArten" auflöst.
   * @throws Wirft einen Fehler, wenn die HTTP-Anfrage fehlschlägt.
   */
  async getArten(min:number,max:number,id_komponente:number): Promise<any[]> {
    
    const params = new HttpParams()
    .set('min', min.toString())
    .set('max', max.toString())
    .set('id_komponente', id_komponente.toString());
    try {
      // Verwende lastValueFrom, um das Observable in ein Promise zu konvertieren
      const response = await lastValueFrom(this.httpClient.get<any[]>(`${this.apiUrl}/VerbreitungArten`, { params }));
      console.log(response);
      return response;
    } catch (error) {
      console.error('Fehler beim Abrufen der VerbreitungArtenListe:', error);
      throw error;
    }
  }

 
  /**
   * Ruft die Liste der Verbreitung Arten von der API ab.
   * 
   * @returns {Promise<any[]>} Ein Promise, das ein Array von Verbreitung Arten auflöst.
   * @throws Wirft einen Fehler, wenn die Anfrage fehlschlägt.
   */
  async getVerbreitungArtenListe(): Promise<any[]> {
    try {
      // Verwende lastValueFrom, um das Observable in ein Promise zu konvertieren
      const response = await lastValueFrom(this.httpClient.get<any[]>(`${this.apiUrl}/VerbreitungArtenListe`));
      return response;
    } catch (error) {
      console.error('Fehler beim Abrufen der VerbreitungArtenListe:', error);
      throw error;
    }
  }




/**
 * Ruft die Liste der Komponenten von der API ab.
 *
 * @returns {Promise<any[]>} Ein Promise, das ein Array von Komponenten auflöst.
 * @throws Wirft einen Fehler, wenn die Anfrage fehlschlägt.
 */
async getKomponenten(): Promise<any[]> {
  try {
    // Verwende lastValueFrom, um das Observable in ein Promise zu konvertieren
    const response = await lastValueFrom(this.httpClient.get<any[]>(`${this.apiUrl}/VerbreitungKomponente`));
    return response;
  } catch (error) {
    console.error('Fehler beim Abrufen der VerbreitungArtenListe:', error);
    throw error;
  }
}
/**
 * Ruft asynchron die Methode `getArten` auf, um eine Liste von Arten innerhalb des angegebenen Bereichs und der Komponenten-ID abzurufen.
 * Filtert die Ergebnisse, um eine eindeutige Liste von Arten zu erstellen und gibt diese in der Konsole aus.
 * 
 * @param min - Der Minimalwert für den Bereich der abzurufenden Arten.
 * @param max - Der Maximalwert für den Bereich der abzurufenden Arten.
 * @param id_komponente - Die ID der Komponente, um die Arten zu filtern.
 * @returns Ein Promise, das aufgelöst wird, wenn der Vorgang abgeschlossen ist.
 * @throws Wirft einen Fehler, wenn der API-Aufruf fehlschlägt.
 */
async callArten(min:number,max:number,id_komponente:number) {
  this.dbArtenListe=[];
  try {
    const formenList = await this.getArten(min,max,id_komponente); // Warte auf das Ergebnis der API-Abfrage
    const uniqueArten = new Set();
    // Durchlaufe die Ergebnisse mit einer for...of-Schleife
    for (const formen_ of formenList) {
      this.dbArten.push(formen_);
      


      if (!uniqueArten.has(formen_.taxon)) {
        uniqueArten.add(formen_.taxon); // Füge die Art hinzu, wenn sie noch nicht existiert
        this.dbArtenListe.push(formen_.taxon);
        console.log(formen_.taxon); // Gib die einzigartige Art aus
      }


    }

    console.log(this.dbArtenListe);
  } catch (error) {
    console.error('Fehler beim Abrufen der Artenliste:', error);
  }
}
 
 
  

  /**
   * Ruft asynchron die Methode `getKomponenten` auf, um eine Liste von Komponenten abzurufen,
   * durchläuft dann die Liste und fügt jede Komponente dem `dbKomponenten` Array hinzu.
   * Wenn ein Fehler während des API-Aufrufs auftritt, wird der Fehler in der Konsole protokolliert.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Vorgang abgeschlossen ist.
   * @throws Protokolliert eine Fehlermeldung in der Konsole, wenn der API-Aufruf fehlschlägt.
   */
  
  async callKomponenten() {
    try {
      const formenList = await this.getKomponenten(); // Warte auf das Ergebnis der API-Abfrage
  
      // Durchlaufe die Ergebnisse mit einer for...of-Schleife
      for (const formen_ of formenList) {
        this.dbKomponenten.push(formen_);
        // console.log(formen_);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Artenliste:', error);
    }
  }

}