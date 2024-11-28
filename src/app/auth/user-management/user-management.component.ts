import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/shared/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmPasswordDialogComponent } from '../confirm-password-dialog/confirm-password-dialog.component';
import { firstValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
/**
 * Komponente zur Verwaltung von Benutzern innerhalb der Anwendung.
 * 
 * @export
 * @class UserManagementComponent
 * @implements {OnInit}
 * 
 * @property {string[]} displayedColumns - Definiert die Spalten der Tabelle.
 * @property {MatTableDataSource<User>} users - Benutzerdaten in einer MatTableDataSource.
 * @property {MatSort} sort - Zugriff auf die Sortierung.
 * 
 * @constructor
 * @param {UserService} userService - Service für benutzerbezogene Operationen.
 * @param {MatDialog} dialog - Service zum Öffnen von Dialogen.
 * 
 * @method ngOnInit - Lifecycle-Hook, der aufgerufen wird, nachdem daten-gebundene Eigenschaften initialisiert wurden.
 * @method sendMailToAllUsers - Sendet eine E-Mail an alle Benutzer.
 * @method generateRandomPassword - Generiert ein zufälliges 5-stelliges Passwort.
 * @method addPassword - Setzt ein Passwort für einen Benutzer und speichert es im Backend.
 * @method setNewPassword - Speichert das neue Passwort für einen Benutzer im Backend.
 * @method confirmDelete - Öffnet einen Dialog zur Bestätigung der Löschung eines Benutzers.
 * @method editUser - Öffnet einen Dialog zum Bearbeiten der Benutzerdetails.
 * @method loadUsers - Lädt die Liste der Benutzer aus dem Backend.
 * @method addNewUser - Öffnet einen Dialog zum Hinzufügen eines neuen Benutzers.
  * @autor Dr. Jens Päzolt, Umweltsoft 
  * */
export class UserManagementComponent implements OnInit {
  // users: User[] = [];
  displayedColumns: string[] = ['id_nu', 'vornahme', 'zunahme', 'mail','login','password','administrator','nutzer1', 'nutzer2', 'nutzer3', 'actions']; // Definiere die Spalten der Tabelle
  users = new MatTableDataSource([]); // Benutzerdaten in einer MatTableDataSource

  @ViewChild(MatSort) sort!: MatSort; // Zugriff auf die Sortierung
  constructor(private userService: UserService, public dialog: MatDialog) {}

  /**
   * Lifecycle-Hook, der aufgerufen wird, nachdem Angular alle daten-gebundenen Eigenschaften einer Direktive initialisiert hat.
   * Diese Methode wird verwendet, um zusätzliche Initialisierungsaufgaben durchzuführen.
   * In diesem Fall lädt sie die Benutzer, indem die Methode `loadUsers` aufgerufen wird.
   */
  ngOnInit(): void {
    this.loadUsers();
  }
   // Funktion, um eine E-Mail an alle Nutzer zu senden
  /**
   * Sendet eine E-Mail an alle Benutzer in der Benutzerliste.
   * 
   * Diese Methode sammelt die E-Mail-Adressen aller Benutzer, erstellt einen mailto-Link mit BCC
   * und öffnet das Standard-Mailprogramm mit den gesammelten E-Mail-Adressen.
   * 
   * @bemerkungen
   * Der Betreff und der Text der E-Mail sind innerhalb der Methode vordefiniert.
   * 
   * @beispiel
   * ```typescript
   * this.sendMailToAllUsers();
   * ```
   */
   sendMailToAllUsers(): void {
    const emailAddresses = this.users.data.map(user => user.mail).join(',');  // E-Mail-Adressen sammeln
    
    // E-Mail-Link mit BCC an alle Nutzer
    const mailSubject = 'Wichtige Informationen';
    const mailBody = 'Hallo zusammen,\n\nBitte beachtet die folgenden Informationen...';
    const mailtoLink = `mailto:?bcc=${encodeURIComponent(emailAddresses)}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  
    // Öffnet das Standard-Mailprogramm mit den gesammelten E-Mails
    window.location.href = mailtoLink;
  }
  
    // Zufälliges 5-stelliges Passwort generieren
    /**
     * Generiert ein zufälliges Passwort, das aus Großbuchstaben, Kleinbuchstaben und Ziffern besteht.
     * Das generierte Passwort wird 5 Zeichen lang sein.
     *
     * @returns {string} Ein zufällig generiertes Passwort.
     */
    generateRandomPassword(): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
        
      }
    
      return password;
    }
   
 // Passwort setzen und im Backend speichern
/**
 * Fügt ein neues Passwort für den angegebenen Benutzer hinzu. Wenn der Benutzer bereits ein Passwort hat,
 * wird ein Bestätigungsdialog angezeigt, um die Passwortänderung zu bestätigen. Wenn der Benutzer bestätigt,
 * wird ein neues Passwort generiert und gespeichert. Wenn der Benutzer kein bestehendes Passwort hat,
 * wird sofort ein neues Passwort generiert und gespeichert.
 *
 * @param user - Das Benutzerobjekt, für das das Passwort hinzugefügt oder geändert werden soll.
 */
 addPassword(user: User): void {
 
  if (user.password) {
    // Wenn ein altes Passwort existiert, zeige den Bestätigungsdialog
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        // Wenn der Benutzer bestätigt, neues Passwort generieren und speichern
        this.setNewPassword(user);
      } else {
        console.log('Passwortänderung abgebrochen');
      }
    });
  } else {
    // Kein altes Passwort, sofort neues Passwort vergeben
    this.setNewPassword(user);
  }
}
  
/**
 * Funktion zum Speichern des neuen Passworts: Setzt ein neues Passwort für den angegebenen Benutzer, aktualisiert es im Backend und öffnet das Standard-Mailprogramm,
 * um das neue Passwort an die E-Mail des Benutzers zu senden.
 *
 * @param {User} user - Das Benutzerobjekt, für das das Passwort gesetzt werden soll.
 * @returns {void}
 */
 setNewPassword(user: User): void {
  const newPassword = this.generateRandomPassword();
  const updatedUser = { ...user, password: newPassword };

  // Speichere das Passwort im Backend
  this.userService.updatePassword(user.id_nu, newPassword).subscribe(() => {
    console.log('Passwort gespeichert');

    // Öffne das Standard-Mailprogramm
    const mailSubject = 'Ihr Zugang zur BioDatenbank EU-WRRL Senat Berlin';
    const mailBody = `Ihr Zugang:\nLogin: ${user.login}\nPasswort: ${newPassword}`;
    const mailtoLink = `mailto:${user.mail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoLink;  // Öffnet das Standard-Mailprogramm
  });
}
// Dialog zum Löschen eines Benutzers öffnen
/**
 * Öffnet einen Bestätigungsdialog zum Löschen eines Benutzers. Wenn der Benutzer die Löschung bestätigt,
 * wird der Benutzerservice aufgerufen, um den Benutzer zu löschen, und die Benutzerliste wird neu geladen.
 *
 * @param {User} user - Das zu löschende Benutzerobjekt.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Löschvorgang abgeschlossen ist.
 */
async confirmDelete(user: User): Promise<void> {
  const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
    width: '300px',
  });

  // Verwende firstValueFrom anstelle von toPromise()
  const confirmed = await firstValueFrom(dialogRef.afterClosed());

  if (confirmed) {
    try {
      // Warte auf die asynchrone Löschoperation
      await this.userService.deleteUser(user.id_nu);
      console.log('Benutzer erfolgreich gelöscht');
      // Aktualisiere hier die Benutzerliste oder das UI
      this.loadUsers();
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
    }
  }
}
    
    

  /**
   * Öffnet einen Dialog zum Bearbeiten des angegebenen Benutzers.
   * 
   * @param user - Der zu bearbeitende Benutzer.
   * 
   * Der Dialog wird mit einer Breite von 480px und einer Höhe von 700px geöffnet.
   * Die Benutzerdaten werden zum Bearbeiten an den Dialog übergeben.
   * 
   * Nachdem der Dialog geschlossen wurde, wird der Benutzerservice aufgerufen, um den Benutzer zu aktualisieren, falls ein Ergebnis vorliegt.
   * Sobald der Benutzer aktualisiert wurde, wird die Benutzerliste neu geladen, um die Änderungen widerzuspiegeln.
   */
  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '480px',   // Stelle die Breite auf 480px ein (20% mehr)
      height: '700px',  // Stelle die Höhe auf 500px ein (20% mehr)00px',
      data: { user: { ...user } } // Kopiere den Benutzer in den Dialog, um ihn zu bearbeiten
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result.id_nu, result).subscribe(() => {
          this.loadUsers(); // Aktualisiere die Tabelle nach dem Bearbeiten
        });
      }
    });
  }
  
 
  /**
   * Lädt die Liste der Benutzer vom Benutzerservice und aktualisiert die Datenquelle.
   * 
   * Diese Methode abonniert den Benutzerservice, um die Benutzerdaten abzurufen. Sobald die Daten empfangen wurden,
   * wird die `users` Datenquelle aktualisiert und die Sortierung konfiguriert.
   * 
   * - Setzt die Datenquelle für Benutzer.
   * - Aktiviert die Sortierung für die Datenquelle.
   * - Setzt die Standardsortierspalte auf 'id_nu'.
   * - Setzt die Sortierrichtung auf aufsteigend.
   * 
   * @returns {void}
   */
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users.data = data;
      this.users.sort = this.sort; // Sortierung aktivieren
      this.users.sort.active = 'id_nu'; // Standard-Sortierung festlegen
      this.users.sort.direction = 'asc'; // Sortierreihenfolge aufsteigend festlegen
    });
  }
  // Öffnet den Dialog mit einem leeren Benutzerobjekt
  /**
   * Öffnet einen Dialog, um einen neuen Benutzer hinzuzufügen. Der Dialog enthält ein leeres Benutzerobjekt,
   * das vom Benutzer ausgefüllt werden kann. Sobald der Dialog geschlossen wird, wird der neue Benutzer,
   * falls ein Ergebnis zurückgegeben wird, zur Datenbank hinzugefügt und die Benutzerliste aktualisiert.
   *
   * @bemerkungen
   * Diese Methode verwendet die `EditUserDialogComponent`, um den Dialog anzuzeigen, und
   * `UserService`, um den neuen Benutzer zur Datenbank hinzuzufügen.
   */
  addNewUser(): void {
    const newUser: User = {
      vornahme: '',
      zunahme: '',
      mail: '',
      administrator: false,
      nutzer1: false,
      nutzer2: false,
      nutzer3: false,
    };

    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '480px',
      height: '500px',
      data: { user: newUser },  // Leeres Benutzerobjekt
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Neuen Benutzer in die Datenbank speichern
        this.userService.addUser(result).subscribe(() => {
          this.loadUsers(); // Aktualisiere die Liste nach dem Hinzufügen eines neuen Benutzers
        });
      }
    });
  }
 
  
}