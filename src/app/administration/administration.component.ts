import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  constructor(private router: Router,private authService: AuthService){}
  ngOnInit() {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
        }} 
  
  addnutzer(){this.router.navigate(['/register']);}
}
