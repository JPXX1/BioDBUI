import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Stellt einen Eintrag in einer Wiki-Baumstruktur dar.
 * 
 * @interface WikiEntry
 * @property {string} name - Der Name des Knotens (z.B. header1, header2 oder body).
 * @property {WikiTreeEntry[]} children - Die untergeordneten Knoten dieses Eintrags.
 */


export interface WikiEntry {
  id: number;
  header1: string;
  header2: string;
  body: string;
}




@Injectable({
  providedIn: 'root',
})
export class WikiService {
  //private apiUrl = 'http://localhost:3000/api/wiki2'; // Passe die URL an dein Backend an
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // getWikiTreeEntries(): Observable<WikiTreeEntry[]> {
  //   return this.http.get<WikiTreeEntry[]>(`${this.apiUrl}/wiki2`);
  // }
  // getTreeData(): Observable<WikiEntry[]> {
  //   return this.http.get<WikiEntry[]>(`${this.apiUrl}/wiki2`);
  // }
  getWikiEntries(): Observable<WikiEntry[]> {
    return this.http.get<WikiEntry[]>(`${this.apiUrl}/wiki2`);
  }
}
