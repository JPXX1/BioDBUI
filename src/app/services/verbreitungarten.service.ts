import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VerbreitungartenService {

  //private apiUrl = 'http://localhost:3000/comment';
  private apiUrl = environment.apiUrl;
  public dbKomponenten: any[] = [];public dbArten: any[] = [];;public dbArtenListe: any[] = [];  // Initialisiere dbArtenListe als leeres Array
  constructor(private httpClient: HttpClient) {}




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
 
  // async callArtenListe() {
  //   try {
  //     const formenList = await this.getVerbreitungArtenListe(); // Warte auf das Ergebnis der API-Abfrage
  
  //     // Durchlaufe die Ergebnisse mit einer for...of-Schleife
  //     for (const formen_ of formenList) {
  //       this.dbArtenListe.push(formen_);
  //       console.log(formen_);
  //     }
  //   } catch (error) {
  //     console.error('Fehler beim Abrufen der Artenliste:', error);
  //   }
  // }
  

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