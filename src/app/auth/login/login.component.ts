import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component'; // Importiere die Registrierungsdialog-Komponente
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private authService: AuthService, private router: Router,private dialog: MatDialog) {}
  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        sessionStorage.setItem('token', response.token);  // Token speichern
        
        // Rollen als Array speichern
        const rolesArray = Object.keys(response.roles).filter(role => response.roles[role]);
        sessionStorage.setItem('roles', JSON.stringify(rolesArray));  // Rollen als Array speichern
  
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
    this.dialog.open(RegisterDialogComponent);
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
