import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Dein AuthService für HTTP-Aufrufe
import { MatDialogRef } from '@angular/material/dialog'; // Zum Schließen des Dialogs

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent {
  registerUsername = '';  // Benutzername für die Registrierung
  registerPassword = '';  // Passwort für die Registrierung
  errorMessage = '';  // Fehlernachricht bei Problemen

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<RegisterDialogComponent> // Zum Schließen des Dialogs
  ) {}
  cancel() {
    this.dialogRef.close(); // Schließt den Dialog
  }
  // Registrierungsmethode
  register() {
    this.authService.register(this.registerUsername, this.registerPassword).subscribe(
      response => {
        alert('Registration successful!');
        this.dialogRef.close(); // Schließt das Popup nach erfolgreicher Registrierung
      },
      error => {
        // Setze die Fehlernachricht bei einem Fehler
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
