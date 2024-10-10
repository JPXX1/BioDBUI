import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {
  isSaveDisabled = true;  // Standardmäßig deaktiviert
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    // Prüfen, ob ein Vorname vorhanden ist, und den Zustand des Formulars aktualisieren
    this.onFormChange();
  }
 // Funktion zum Überprüfen des Benutzers und Speichern
 async onSubmit(): Promise<void> {
  await this.generateUniqueLogin(this.data.user.vornahme);
}
onVornameChange(newValue: string): void {
  this.data.user.vornahme = newValue;  // Vorname im Modell aktualisieren
  this.onFormChange();  // Formularstatus überprüfen
}

// Methode, um den Zustand des Formulars zu überprüfen
onFormChange(): void {
  // Überprüfen, ob sowohl Vorname als auch Nachname vorhanden sind
  if (this.data.user.vornahme && this.data.user.vornahme.trim() !== ''){
    this.isSaveDisabled = false;  // Speichern-Button aktivieren
  } else {
    this.isSaveDisabled = true;  // Speichern-Button deaktivieren
  }
}
// Funktion, die aus dem Vornamen einen Login erstellt und überprüft, ob er einzigartig ist
async generateUniqueLogin(vornahme: string): Promise<void> {
  // Überprüfen, ob bereits ein Login vorhanden ist
  if (this.data.user.login && this.data.user.login.trim() !== '') {
    // Falls ein Login vorhanden ist, Dialog schließen und Benutzer speichern
    this.dialogRef.close(this.data.user);
    return;
  }

  // Falls kein Vorname vorhanden ist, gib einen leeren Login zurück und speichere ohne Login
  if (!vornahme) {
    this.data.user.login = '';  
    this.dialogRef.close(this.data.user);
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

  // Starte den ersten Versuch
  let login = generateLoginAttempt();
  let isUnique = await this.checkLoginUnique(login);

  // Schritt 3: Überprüfe, ob der Login einzigartig ist, und wiederhole bei Bedarf
  while (!isUnique) {
    login = generateLoginAttempt();
    isUnique = await this.checkLoginUnique(login);
  }

  // Falls der Login einzigartig ist, speichere ihn und schließe den Dialog
  this.data.user.login = login;
  this.dialogRef.close(this.data.user);  // Gibt den aktualisierten Benutzer zurück
}


// Funktion, um zu überprüfen, ob der Login einzigartig ist (asynchron)
async checkLoginUnique(login: string): Promise<boolean> {
  try {
    const exists = await firstValueFrom(this.userService.checkLoginExists(login));
    return !exists;  // Gibt true zurück, wenn der Login einzigartig ist
  } catch (error) {
    console.error('Fehler beim Überprüfen der Login-Einzigartigkeit:', error);
    return false;
  }
}

onCancel(): void {
  this.dialogRef.close(); // Schließe den Dialog ohne Änderungen
}
}