import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
/**
 * @class RegisterComponent
 * @description Diese Komponente verwaltet die Benutzerregistrierungsfunktionalität.
 * 
 * @property {string} username - Der vom Benutzer eingegebene Benutzername.
 * @property {string} password - Das vom Benutzer eingegebene Passwort.
 * @property {string} errorMessage - Die Fehlermeldung, die angezeigt wird, wenn die Registrierung fehlschlägt.
 * @property {string} passwordFieldType - Der Typ des Passwortfeldes, entweder 'password' oder 'text'.
 * 
 * @constructor
 * @param {AuthService} authService - Der Authentifizierungsdienst, der zur Registrierung des Benutzers verwendet wird.
 * @param {Router} router - Der Router-Dienst, der zur Navigation verwendet wird.
 * 
 * @method register - Registriert einen neuen Benutzer mit dem angegebenen Benutzernamen und Passwort.
 * @method togglePasswordVisibility - Schaltet die Sichtbarkeit des Passwortfeldes zwischen 'password' und 'text' um.
 * @autor Dr. Jens Päzolt, Umweltsoft 
*/
export class RegisterComponent {
  username = '';
  password = '';
  errorMessage = '';
  passwordFieldType: string = 'password';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Registriert einen neuen Benutzer mit dem angegebenen Benutzernamen und Passwort.
   * Bei erfolgreicher Registrierung wird zur Login-Seite navigiert.
   * Wenn die Registrierung fehlschlägt, wird eine Fehlermeldung gesetzt.
   */
  register() {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
      }
    );
  }

  /**
   * Schaltet die Sichtbarkeit des Passwortfeldes um.
   * Ändert den Eingabetyp des Passwortfeldes zwischen 'password' und 'text'.
   */
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
