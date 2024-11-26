import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WikiTreeEntry {
  name: string; // Name des Knotens (header1, header2, oder body)
  children: WikiTreeEntry[]; // Untergeordnete Knoten
}



@Injectable({
  providedIn: 'root',
})
export class WikiService {
  //private apiUrl = 'http://localhost:3000/api/wiki2'; // Passe die URL an dein Backend an
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getWikiTreeEntries(): Observable<WikiTreeEntry[]> {
    return this.http.get<WikiTreeEntry[]>(`${this.apiUrl}/wiki2`);
  }
}
