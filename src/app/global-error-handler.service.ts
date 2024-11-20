import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
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
    const message = error.message || 'Unknown error occurred';
    const stack = error.stack || 'No stack trace';
  
    // Loggen von Fehlern direkt im GlobalErrorHandler
    console.error('Global Error:', message);
    console.error('Stack:', stack);
  
    // Optional: Senden an Fastify-Backend
    this.http.post(`${this.apiUrl}/log-error`, { message, stack }).subscribe({
      next: () => console.log('Error logged successfully'),
      error: (err) => console.error('Failed to log error:', err),
    });
  }
}