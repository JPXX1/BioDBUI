import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
/**
 * GlobalErrorHandler ist ein benutzerdefinierter Fehlerbehandler, der das ErrorHandler-Interface implementiert.
 * Er protokolliert Fehler in der Konsole und sendet sie optional an ein Fastify-Backend zur Protokollierung.
 *
 * @class GlobalErrorHandler
 * @implements {ErrorHandler}
 *
 * @constructor
 * @param {HttpClient} http - Angulars HttpClient zum Ausführen von HTTP-Anfragen.
 * @param {NgZone} ngZone - Angulars NgZone-Dienst, um Code innerhalb oder außerhalb der Angular-Zone auszuführen.
 *
 * @method handleError
 * @param {any} error - Das Fehlerobjekt, das die Fehlermeldung und den Stack-Trace enthält.
 * @returns {void}
 *
 * @description
 * Die handleError-Methode protokolliert die Fehlermeldung und den Stack-Trace in der Konsole.
 * Sie sendet auch die Fehlerdetails zur Protokollierung an ein Fastify-Backend.
 */
export class GlobalErrorHandler implements ErrorHandler {
  // URL zum Backend
  private apiUrl = environment.apiUrl;
  // private logEndpoint = 'http://localhost:3000/log-error';
  
  constructor(private http: HttpClient, private ngZone: NgZone) {}

   /**
    * Behandelt globale Fehler, indem sie in der Konsole protokolliert und optional an ein Fastify-Backend gesendet werden.
    *
    * @param error - Das Fehlerobjekt, das die Fehlermeldung und den Stack-Trace enthält.
    *
    * Protokolliert die Fehlermeldung und den Stack-Trace in der Konsole.
    * Sendet die Fehlerdetails zur Protokollierung an das Fastify-Backend.
    */
  handleError(error: any): void {
   const message = error.message || 'Unbekannter Fehler aufgetreten';
   const stack = error.stack || 'Kein Stack-Trace';
  
   // Loggen von Fehlern direkt im GlobalErrorHandler
   console.error('Globaler Fehler:', message);
   console.error('Stack:', stack);
  
   // Optional: Senden an Fastify-Backend
   this.http.post(`${this.apiUrl}/log-error`, { message, stack }).subscribe({
    next: () => console.log('Fehler erfolgreich protokolliert'),
    error: (err) => console.error('Fehlerprotokollierung fehlgeschlagen:', err),
   });
  }
}