import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;
   
    
        constructor(private http: HttpClient) { }
        
        register(username: string, password: string): Observable<any> {
            return this.http.post(`${this.apiUrl}/register`, { username, password });
        }
    
        login(username: string, password: string): Observable<any> {
            if (username === 'admin' && password === 'umweltsoft') {
              // Wenn der Admin sich anmeldet, gib alle Rollen zurück
              const adminRoles = {
                token: 'admin-token', // Beispiel für ein Token
                roles: {
                  administrator: true,
                  nutzer1: true,
                  nutzer2: true,
                  nutzer3: true
                }
              };
              // Verwende `of` aus `rxjs`, um ein Observable aus dem Objekt zurückzugeben
              return of(adminRoles);
            } else {
              // Führe einen HTTP-POST-Aufruf aus und gib ein Observable zurück
              return this.http.post(`${this.apiUrl}/login`, { username, password });
            }
          }
    
  // Rollen des Benutzers aus dem Session Storage holen
  getUserRoles(): string[] {
    const roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('administrator');
  }

  //  Prüfen, ob der Benutzer nutzer1 ist
  isNutzer1(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('nutzer1');
  }

  // Prüfen, ob der Benutzer nutzer2 ist
  isNutzer2(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('nutzer2');
  }

  //  Prüfen, ob der Benutzer nutzer3 ist
  isNutzer3(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('nutzer3');
  }

 
 

        isLoggedIn(): boolean {
            return !!sessionStorage.getItem('token');
        }
    
        getToken(): string {
            return sessionStorage.getItem('token');
        }
    }
    

