import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

/**
 * Guard, um zu überprüfen, ob der Benutzer die erforderliche Rolle hat, um auf eine Route zuzugreifen.
 * 
 * @example
 * // In Ihrem Routing-Modul
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [RoleGuard],
 *   data: { expectedRole: 'administrator' }
 * }
 * 
 * @@Injectable
 * @class RoleGuard
 * @implements {CanActivate}
 * 
 * @constructor
 * @param {AuthService} authService - Service, um Benutzerrollen abzurufen.
 * @param {Router} router - Router, um zu navigieren, wenn der Zugriff verweigert wird.
 * 
 * @method canActivate
 * @param {ActivatedRouteSnapshot} route - Der aktuelle Routen-Snapshot.
 * @param {RouterStateSnapshot} state - Der aktuelle Router-Status-Snapshot.
 * @returns {boolean | UrlTree} - Gibt true zurück, wenn der Benutzer die erwartete Rolle hat, andernfalls wird ein UrlTree zurückgegeben, um zur Login-Seite umzuleiten.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Bestimmt, ob eine Route basierend auf den Rollen des Benutzers aktiviert werden kann.
   * 
   * Diese Guard überprüft, ob der Benutzer die in den Routen-Daten angegebene erwartete Rolle hat.
   * Wenn der Benutzer die erforderliche Rolle hat, wird der Zugriff gewährt. Andernfalls wird der Benutzer
   * zur Login-Seite umgeleitet.
   * 
   * @param route - Der aktivierte Routen-Snapshot, der die Routen-Daten enthält.
   * @param state - Der Router-Status-Snapshot.
   * @returns Ein boolean, der angibt, ob die Route aktiviert werden kann, oder ein UrlTree zur Umleitung.
   */
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
