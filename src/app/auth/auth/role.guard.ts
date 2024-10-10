import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    // Beispiel: Überprüfen, ob der Benutzer die "administrator"-Rolle hat
    const expectedRole = route.data['expectedRole']; // Rolle aus Route-Daten
    const userRoles = this.authService.getUserRoles();

    if (userRoles.includes(expectedRole)) {
      return true; // Zugriff gewähren
    } else {
      // Zugriff verweigern und Umleitung zur Login-Seite oder Fehlermeldung
      return this.router.createUrlTree(['/login']);
    }
  }
}
