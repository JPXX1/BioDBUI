import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
/**
 * Komponente zum Bearbeiten von Benutzerdetails in einem Dialog.
 * 
 * Diese Komponente bietet Funktionen zum Bearbeiten von Benutzerdetails wie Vorname und generiert einen eindeutigen Login für den Benutzer.
 * Sie verwaltet auch den Zustand der Speichern-Schaltfläche basierend auf der Gültigkeit des Formulars.
 * 
 * @class
 * @implements {OnInit}
 * 
 * @property {boolean} isSaveDisabled - Gibt an, ob die Speichern-Schaltfläche deaktiviert ist.
 * 
 * @constructor
 * @param {MatDialogRef<EditUserDialogComponent>} dialogRef - Referenz auf den geöffneten Dialog.
 * @param {UserService} userService - Service zur Verwaltung benutzerbezogener Operationen.
 * @param {any} data - An den Dialog übergebene Daten, einschließlich Benutzerdetails.
 * 
 * @method ngOnInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem daten-gebundene Eigenschaften initialisiert wurden.
 * @method onSubmit - Funktion zur Verarbeitung der Formularübermittlung und Generierung eines eindeutigen Logins für den Benutzer.
 * @method onVornameChange - Funktion zur Verarbeitung von Änderungen im Vornamen-Eingabefeld.
 * @method onFormChange - Methode zur Überprüfung der Gültigkeit des Formulars und Aktualisierung des Zustands der Speichern-Schaltfläche.
 * @method generateUniqueLogin - Funktion zur Generierung eines eindeutigen Logins aus dem Vornamen und Überprüfung seiner Einzigartigkeit.
 * @method checkLoginUnique - Funktion zur Überprüfung, ob ein Login eindeutig ist.
 * @method onCancel - Funktion zum Schließen des Dialogs ohne Speichern der Änderungen.
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditUserDialogComponent implements OnInit {
  isSaveDisabled = true;  // Standardmäßig deaktiviert
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  /**
   * Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular alle daten-gebundenen Eigenschaften einer Direktive initialisiert hat.
   * Diese Methode wird verwendet, um zu überprüfen, ob ein Vorname vorhanden ist, und den Zustand des Formulars entsprechend zu aktualisieren.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    // Prüfen, ob ein Vorname vorhanden ist, und den Zustand des Formulars aktualisieren
    this.onFormChange();
  }
 // Funktion zum Überprüfen des Benutzers und Speichern
 async onSubmit(): Promise<void> {
  await this.generateUniqueLogin(this.data.user.vornahme);
}

/**
 * Aktualisiert den Vornamen des Benutzers im Datenmodell und überprüft den Formularstatus.
 *
 * @param newValue - Der neue Vorname, der im Modell gesetzt werden soll.
 */
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
/**
 * Generiert einen eindeutigen Login für einen Benutzer basierend auf seinem Vornamen.
 * 
 * Diese Methode führt die folgenden Schritte aus:
 * 1. Überprüft, ob bereits ein Login für den Benutzer existiert. Falls ja, wird der Dialog geschlossen und der Benutzer gespeichert.
 * 2. Wenn kein Vorname angegeben ist, wird ein leerer Login zugewiesen und der Benutzer gespeichert.
 * 3. Generiert einen Basis-Login, indem der Vorname getrimmt, in Kleinbuchstaben umgewandelt und nicht-alphanumerische Zeichen entfernt werden.
 * 4. Hängt eine zufällige Zahl an den Basis-Login an, falls dies zur Sicherstellung der Einzigartigkeit erforderlich ist.
 * 5. Überprüft, ob der generierte Login eindeutig ist. Falls nicht, wird der Prozess wiederholt, bis ein eindeutiger Login gefunden wird.
 * 6. Speichert den eindeutigen Login und schließt den Dialog.
 * 
 * @param {string} vornahme - Der Vorname des Benutzers.
 * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn der eindeutige Login generiert und der Benutzer gespeichert wurde.
 */
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
/**
 * Überprüft, ob der angegebene Login eindeutig ist.
 *
 * Diese Methode sendet eine Anfrage an den Benutzerdienst, um zu überprüfen, ob der Login bereits existiert.
 * Wenn der Login existiert, wird `false` zurückgegeben, andernfalls `true`.
 *
 * @param {string} login - Der Login-String, der auf Einzigartigkeit überprüft werden soll.
 * @returns {Promise<boolean>} Ein Promise, das auf `true` aufgelöst wird, wenn der Login eindeutig ist, andernfalls auf `false`.
 * @throws Protokolliert einen Fehler in der Konsole, wenn ein Problem mit der Anfrage auftritt.
 */
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