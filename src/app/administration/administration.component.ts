import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
/**
 * Die AdministrationComponent ist verantwortlich für die Verwaltung der Administrationsansicht der Anwendung.
 * Sie überprüft bei der Initialisierung, ob der Benutzer eingeloggt ist, und leitet bei fehlender Authentifizierung zur Login-Seite weiter.
 *
 * @class
 * @constructor
 * @param {Router} router - Der Angular Router-Dienst, der für die Navigation verwendet wird.
 * @param {AuthService} authService - Der Authentifizierungsdienst, der verwendet wird, um den Login-Status des Benutzers zu überprüfen.
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class AdministrationComponent {
  constructor(private router: Router, private authService: AuthService) {}
  
  /**
   * Lifecycle-Hook, der aufgerufen wird, nachdem daten-gebundene Eigenschaften einer Direktive initialisiert wurden.
   * Hier wird überprüft, ob der Benutzer eingeloggt ist, indem der AuthService verwendet wird. Wenn der Benutzer nicht eingeloggt ist,
   * wird zur Login-Seite navigiert.
   */
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
}
