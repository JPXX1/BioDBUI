import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
/**
 * Service zur Verwaltung benutzerbezogener Operationen.
 * 
 * @class UserService
 * @constructor
 * @param {HttpClient} http - Angulars HttpClient zur Durchführung von HTTP-Anfragen.
 * 
 * @property {string} apiUrl - Die Basis-URL für die API-Endpunkte.
 * 
 * @method getUsers
 * @description Ruft eine Liste von Benutzern ab.
 * @returns {Observable<User[]>} Ein Observable, das ein Array von Benutzern enthält.
 * 
 * @method checkLoginExists
 * @description Überprüft, ob ein Login bereits existiert.
 * @param {string} login - Das zu überprüfende Login.
 * @returns {Observable<boolean>} Ein Observable, das einen Boolean enthält, der angibt, ob das Login existiert.
 * 
 * @method getUser
 * @description Ruft einen Benutzer anhand der ID ab.
 * @param {number} id - Die ID des abzurufenden Benutzers.
 * @returns {Observable<User>} Ein Observable, das den Benutzer enthält.
 * 
 * @method addUser
 * @description Fügt einen neuen Benutzer hinzu.
 * @param {User} user - Der hinzuzufügende Benutzer.
 * @returns {Observable<User>} Ein Observable, das den hinzugefügten Benutzer enthält.
 * 
 * @method updateUser
 * @description Aktualisiert einen bestehenden Benutzer.
 * @param {number} id - Die ID des zu aktualisierenden Benutzers.
 * @param {User} user - Die aktualisierten Benutzerdaten.
 * @returns {Observable<User>} Ein Observable, das den aktualisierten Benutzer enthält.
 * 
 * @method deleteUser
 * @description Löscht einen Benutzer anhand der ID.
 * @param {number} id - Die ID des zu löschenden Benutzers.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Benutzer gelöscht wurde.
 * 
 * @method updatePassword
 * @description Aktualisiert das Passwort eines Benutzers.
 * @param {number} id - Die ID des Benutzers, dessen Passwort aktualisiert werden soll.
 * @param {string} password - Das neue Passwort.
 * @returns {Observable<any>} Ein Observable, das die Antwort vom Server enthält.
  * @autor Dr. Jens Päzolt, Umweltsoft
	 */
export class UserService {
  
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getusers`);
  }



   // Methode zum Überprüfen, ob ein Login bereits existiert
   checkLoginExists(login: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/check-login/${login}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getuser/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/insertuser`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/userschange/${id}`, user);
  }

  deleteUser(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/deleteuser/${id}`));
  }
   // Passwort aktualisieren
   updatePassword(id: number, password: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/register/${id}/password`, { password });
  }
}
