import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { CommentService } from './comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})
/**
 * Service zur Verwaltung und Anzeige von Hilfetexten in einer Angular-Anwendung.
 * 
 * Der `HelpService` bietet Funktionen zum Aktivieren und Deaktivieren der Hilfe-Funktion,
 * zum Setzen von Hilfetexten und zur Registrierung von Mouseover-Ereignissen auf DOM-Elementen
 * mit der Klasse 'helpable'. Wenn die Hilfe-Funktion aktiviert ist, werden Hilfetexte in einer
 * benutzerdefinierten Snackbar-Komponente angezeigt, wenn der Benutzer mit der Maus über diese
 * Elemente fährt.
 * 
 * @example
 * // Beispiel für die Verwendung des HelpService in einer Angular-Komponente
 * constructor(private helpService: HelpService) { }
 * 
 * // Hilfe-Funktion umschalten
 * this.helpService.toggleHelp();
 * 
 * // Hilfetext setzen
 * this.helpService.setHelpText('Dies ist ein Hilfetext.');
 * 
 * // DOM-Änderungen beobachten und Mouseover-Ereignisse registrieren
 * this.helpService.observeDomChanges();
 * 
 * @class
 * @property {BehaviorSubject<boolean>} helpActive - Ein BehaviorSubject, das den aktuellen Zustand der Hilfe-Funktion speichert.
 * @property {BehaviorSubject<string>} helpText - Ein BehaviorSubject, das den aktuellen Hilfetext speichert.
 * @property {Observable<boolean>} helpActive$ - Ein Observable, das den aktuellen Zustand der Hilfe-Funktion bereitstellt.
 * @property {Observable<string>} helpText$ - Ein Observable, das den aktuellen Hilfetext bereitstellt.
 * @method observeDomChanges - Beobachtet Änderungen im DOM und registriert Mouseover-Ereignisse.
 * @method toggleHelp - Schaltet den aktuellen Zustand der Hilfe-Funktion um.
 * @method setHelpText - Setzt den Hilfetext, der angezeigt werden soll.
 * @method absatzhtml - Konvertiert Zeilenumbrüche in einem gegebenen String zu HTML-Zeilenumbruch-Elementen.
 * @method registerMouseoverEvents - Registriert Mouseover-Ereignisse für Elemente mit der Klasse 'helpable'.
 */
export class HelpService {
  private helpActive = new BehaviorSubject<boolean>(false);
  private helpText = new BehaviorSubject<string>('');

  constructor(
    private commentService: CommentService,
    private snackBar: MatSnackBar,
  ) { }

  helpActive$ = this.helpActive.asObservable();
  helpText$ = this.helpText.asObservable();
  
  /**
   * Beobachtet Änderungen im DOM und registriert Mouseover-Ereignisse, wenn Änderungen erkannt werden.
   * 
   * Diese Methode erstellt einen `MutationObserver`, der auf Änderungen der Kindelemente und des Unterbaums
   * des DOM hört. Wenn eine Änderung erkannt wird, ruft er die Methode `registerMouseoverEvents` auf, um 
   * Mouseover-Ereignisse zu registrieren.
   * 
   * @private
   */
  private observeDomChanges() {
    const observer = new MutationObserver(() => {
      this.registerMouseoverEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  /**
   * Schaltet den aktuellen Zustand der Hilfe-Funktion um.
   * Wenn die Hilfe-Funktion derzeit aktiv ist, wird sie deaktiviert und umgekehrt.
   */
  toggleHelp() {
    this.helpActive.next(!this.helpActive.value);
  }

  /**
   * Setzt den Hilfetext, der angezeigt werden soll.
   * 
   * @param text - Der anzuzeigende Hilfetext.
   */
pText(text: string) {
    this.helpText.next(text);
  }

  /**
   * Konvertiert Zeilenumbrüche in einem gegebenen String zu HTML-Zeilenumbruch-Elementen.
   *
   * Diese Methode konvertiert zuerst escapte Zeilenumbrüche (`\\n`) zu tatsächlichen Zeilenumbrüchen (`\n`),
   * und ersetzt dann alle Zeilenumbrüche (`\n`) durch HTML `<br>` Tags.
   *
   * @param kommentar - Der Eingabestring, der Zeilenumbrüche enthält.
   * @returns Der modifizierte String mit HTML-Zeilenumbruch-Elementen.
   */
  absatzhtml(kommentar: string) {
    // Erstes Replace um \\n in \n zu konvertieren
    const messageWithActualNewlines = kommentar.replace(/\\n/g, '\n');
    return messageWithActualNewlines.replace(/\n/g, '<br>');
  }

  /**
   * Registriert Mouseover-Ereignisse für Elemente mit der Klasse 'helpable'.
   * Wenn ein Mouseover-Ereignis auf diesen Elementen auftritt, wird ein Kommentar
   * vom Kommentar-Service abgerufen und in einer benutzerdefinierten Snackbar-Komponente angezeigt.
   * 
   * Die Snackbar wird in der Nähe des Cursors positioniert und für eine bestimmte Dauer angezeigt.
   * Wenn beim Abrufen des Kommentars ein Fehler auftritt, wird eine Fehlermeldung in der Snackbar angezeigt.
   * 
   * Elemente werden als registriert markiert, indem ein 'data-registered' Attribut gesetzt wird,
   * um zu vermeiden, dass mehrere Event-Listener an dasselbe Element angehängt werden.
   */
  registerMouseoverEvents() {
    const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
    elements.forEach((element: HTMLElement) => {
      if (!element.getAttribute('data-registered')) {
        element.addEventListener('mouseover', (event) => {
          if (this.helpActive.value) {
            const templateRef = element.id;
            this.commentService.getComment(templateRef).subscribe(
              response => {
                this.snackBar.openFromComponent(CustomSnackbarComponent, {
                  data: {
                    message: this.absatzhtml(response.kommentar),
                    top: event.clientY + 10, // Adjust to position near the cursor
                    left: event.clientX + 10 // Adjust to position near the cursor
                  },
                  duration: 25000,
                  horizontalPosition: 'start',
                  verticalPosition: 'top',
                  panelClass: ['custom-snackbar-container']
                });
              },
              error => {
                console.error('Fehler beim Abrufen des Kommentars', error);
                this.snackBar.openFromComponent(CustomSnackbarComponent, {
                  data: {
                    message: 'Fehler beim Abrufen des Kommentars',
                    top: event.clientY + 10, // Adjust to position near the cursor
                    left: event.clientX + 10 // Adjust to position near the cursor
                  },
                  duration: 3000,
                  horizontalPosition: 'start',
                  verticalPosition: 'top',
                  panelClass: ['custom-snackbar-container']
                });
              }
            );
          }
        });
        element.setAttribute('data-registered', 'true');
      }
    });
  }
}
