import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../../app.component'; // AppComponent importieren
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * Die LoginComponent ist verantwortlich für die Handhabung der Benutzerauthentifizierung.
 * Sie bietet Funktionen für die Benutzeranmeldung, das Umschalten der Passwortsichtbarkeit
 * und das Öffnen eines Registrierungs-Popups per E-Mail.
 * 
 * @class
 * @property {string} username - Der vom Benutzer eingegebene Benutzername.
 * @property {string} password - Das vom Benutzer eingegebene Passwort.
 * @property {string} errorMessage - Die Fehlermeldung, die im Falle eines fehlgeschlagenen Logins angezeigt wird.
 * @property {string} passwordFieldType - Der Typ des Passwortfeldes, entweder 'password' oder 'text'.
 * 
 * @constructor
 * @param {AppComponent} appComponent - Die Hauptanwendungskomponente.
 * @param {AuthService} authService - Der Authentifizierungsdienst, der für die Anmeldung verwendet wird.
 * @param {Router} router - Der Angular Router, der für die Navigation verwendet wird.
 * @param {MatDialog} dialog - Der Angular Material Dialog-Service, der zum Öffnen von Dialogen verwendet wird.
 * 
 * @method login - Authentifiziert den Benutzer mit dem angegebenen Benutzernamen und Passwort.
 * @method openRegisterPopup - Öffnet den Standard-Mail-Client mit einer vorab ausgefüllten Registrierungs-E-Mail.
 * @method togglePasswordVisibility - Schaltet die Sichtbarkeit des Passwortfeldes um.
 */
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  passwordFieldType: string = 'password';

  constructor(private appComponent: AppComponent ,private authService: AuthService, private router: Router,private dialog: MatDialog) {}
  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        sessionStorage.setItem('token', response.token);  // Token speichern
        
        // Rollen als Array speichern
        const rolesArray = Object.keys(response.roles).filter(role => response.roles[role]);
        sessionStorage.setItem('roles', JSON.stringify(rolesArray));  // Rollen als Array speichern
        this.appComponent.getlink2();  // AppComponent neu laden
        this.router.navigate(['/monitoringdaten']);  // Navigation nach erfolgreichem Login
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
  
  
   /**
     * Öffnet den Standard-Mail-Client mit einer vorab ausgefüllten E-Mail, um Zugang zur BioDatenbank EU-WRRL Senat Berlin anzufordern.
     * Die E-Mail enthält einen Betreff und einen Textkörper.
     *
     * Die E-Mail ist an 'vivien.rosin@SenMVKU.berlin.de' adressiert mit dem Betreff 
     * 'Zugang zur BioDatenbank EU-WRRL Senat Berlin' und einem Textkörper, der Zugangsdaten anfordert.
     *
     * @bemerkungen
     * Diese Funktion erstellt einen mailto-Link mit dem angegebenen Betreff und Textkörper 
     * und setzt die Fensterposition auf diesen Link, wodurch der Standard-Mail-Client geöffnet wird.
     */
  openRegisterPopup() {
    // Betreff und Nachrichtentext für die E-Mail definieren
    const mailSubject = 'Zugang zur BioDatenbank EU-WRRL Senat Berlin';
    const mail = 'vivien.rosin@SenMVKU.berlin.de';
    const mailBody = `Sehr geehrte Damen und Herren,\n\nbitte senden Sie mir Zugangsdaten zur BioDatenbank EU-WRRL Senat Berlin zu.\n\nMit freundlichen Grüßen`;
  
    // Mailto-Link erstellen, mit korrekt kodiertem Betreff und Nachrichtentext
    const mailtoLink = `mailto:${mail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  
    // Öffnet das Standard-Mailprogramm des Benutzers
    window.location.href = mailtoLink;
  }
  /**
   * Schaltet die Sichtbarkeit des Passwortfeldes um.
   * Ändert den Eingabetyp zwischen 'password' und 'text'.
   */
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
