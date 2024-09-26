import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  //private apiUrl = 'http://localhost:3000/comment';
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  getComment(templateRef: string): Observable<{ kommentar: string }> {

    //this.httpClient.get(`${this.apiUrl}/impeinheitenphylib`);
    return this.httpClient.get<{ kommentar: string }>(`${this.apiUrl}/wiki?templateRef=${templateRef}`);
  }
}
