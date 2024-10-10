import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getusers`);
  }



   // Methode zum Überprüfen, ob ein Login bereits existiert
   checkLoginExists(login: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-login/${login}`);
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

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
