import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id_nu', 'vornahme', 'zunahme', 'mail','login','administrator','nutzer1', 'nutzer2', 'nutzer3', 'actions']; // Definiere die Spalten der Tabelle

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  
// Dialog zum Löschen eines Benutzers öffnen
  confirmDelete(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px', // Breite des Bestätigungsdialogs
    });}
    
    addpasswort(){}

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '480px',   // Stelle die Breite auf 480px ein (20% mehr)
      height: '500px',  // Stelle die Höhe auf 500px ein (20% mehr)00px',
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
  
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
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
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers(); // Aktualisiere die Liste nach dem Löschen
    });
  }
  
}