import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to handle operations related to comments.
 */
export class CommentService {
  /**
   * URL der API-Endpunkt.
   * @private
   */
  private apiUrl = environment.apiUrl;

  /**
   * Konstruktor zum Injizieren von HttpClient.
   * @param httpClient - Die HttpClient-Instanz, um HTTP-Anfragen zu stellen.
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Ruft einen Kommentar basierend auf der bereitgestellten Vorlagenreferenz ab.
   * @param templateRef - Die Referenz der Vorlage, für die der Kommentar abgerufen werden soll.
   * @returns Ein Observable, das ein Objekt mit dem Kommentar ausgibt.
   */
  getComment(templateRef: string): Observable<{ kommentar: string }> {
    return this.httpClient.get<{ kommentar: string }>(`${this.apiUrl}/wiki?templateRef=${templateRef}`);
  }
}
