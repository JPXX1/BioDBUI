import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/user';
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
export class UserManagementComponent implements OnInit {
  // users: User[] = [];
  displayedColumns: string[] = ['id_nu', 'vornahme', 'zunahme', 'mail','login','password','administrator','nutzer1', 'nutzer2', 'nutzer3', 'actions']; // Definiere die Spalten der Tabelle
  users = new MatTableDataSource([]); // Benutzerdaten in einer MatTableDataSource

  @ViewChild(MatSort) sort!: MatSort; // Zugriff auf die Sortierung
  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }
   // Funktion, um eine E-Mail an alle Nutzer zu senden
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
 // Funktion zum Speichern des neuen Passworts
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
  
  // loadUsers(): void {
  //   this.userService.getUsers().subscribe((data) => {
  //     this.users = data;
  //   });
  // }
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users.data = data;
      this.users.sort = this.sort; // Sortierung aktivieren
      this.users.sort.active = 'id_nu'; // Standard-Sortierung festlegen
      this.users.sort.direction = 'asc'; // Sortierreihenfolge aufsteigend festlegen
    });
  }
  // Öffnet den Dialog mit einem leeren Benutzerobjekt
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
  // deleteUser(id: number): void {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.loadUsers(); // Aktualisiere die Liste nach dem Löschen
  //   });
  // }
  
}