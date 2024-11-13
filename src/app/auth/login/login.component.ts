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
  
  // login() {
  //   this.authService.login(this.username, this.password).subscribe(
  //     response => {
  //       sessionStorage.setItem('token', response.token);
  //       this.router.navigate(['/monitoringdaten']);
  //     },
  //     error => {
  //       this.errorMessage = 'Login failed. Please check your credentials and try again.';
  //     }
  //   );
  // }
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
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
