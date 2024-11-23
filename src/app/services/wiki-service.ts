import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WikiTreeEntry {
  name: string;
  body?: string;
  children?: WikiTreeEntry[];
}



@Injectable({
  providedIn: 'root',
})
export class WikiService {
  private apiUrl = 'http://localhost:3000/api/wiki2'; // Passe die URL an dein Backend an

  constructor(private http: HttpClient) {}

  getWikiTreeEntries(): Observable<WikiTreeEntry[]> {
    return this.http.get<WikiTreeEntry[]>(this.apiUrl);
  }
}
