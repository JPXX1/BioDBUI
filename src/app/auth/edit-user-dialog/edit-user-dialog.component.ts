import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    this.dialogRef.close(this.data.user); // Gibt den aktualisierten Benutzer zurück
  }
    // Funktion, die aus dem Vornamen einen Login erstellt und überprüft, ob er einzigartig ist
    generateUniqueLogin(vornahme: string): void {
      if (!vornahme) {
        this.data.user.login = '';  // Falls kein Vorname vorhanden ist, gib einen leeren Login zurück
        return;
      }
  
      // Schritt 1: Generiere einen Basis-Login
      let baseLogin = vornahme.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  
      // Schritt 2: Füge eine Zufallszahl zur Basis hinzu (falls nötig)
      let attempt = 0;
      const generateLoginAttempt = () => {
        let login = baseLogin;
        if (attempt > 0) {
          login = `${baseLogin}${attempt}`;
        }
        attempt++;
        return login;
      };
  
      // Schritt 3: Überprüfe, ob der Login einzigartig ist
      const checkLoginUnique = (login: string) => {
        this.userService.checkLoginExists(login).subscribe((exists) => {
          if (exists) {
            // Falls der Login bereits existiert, generiere einen neuen Versuch
            const newLogin = generateLoginAttempt();
            checkLoginUnique(newLogin);
          } else {
            // Falls der Login einzigartig ist, speichere ihn
            this.data.user.login = login;
          }
        });
      };
  
      // Starte den ersten Versuch
      const initialLogin = generateLoginAttempt();
      checkLoginUnique(initialLogin);
    }
  onCancel(): void {
    this.dialogRef.close(); // Schließe den Dialog ohne Änderungen
  }
}
