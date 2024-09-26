import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { CommentService } from './comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private helpActive = new BehaviorSubject<boolean>(false);
  private helpText = new BehaviorSubject<string>('');

  constructor(
    private commentService: CommentService,
    private snackBar: MatSnackBar,
  ) { }

  helpActive$ = this.helpActive.asObservable();
  helpText$ = this.helpText.asObservable();
  
  private observeDomChanges() {
    const observer = new MutationObserver(() => {
      this.registerMouseoverEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  toggleHelp() {
    this.helpActive.next(!this.helpActive.value);
  }

  setHelpText(text: string) {
    this.helpText.next(text);
  }

  absatzhtml(kommentar: string) {
    // Erstes Replace um \\n in \n zu konvertieren
    const messageWithActualNewlines = kommentar.replace(/\\n/g, '\n');
    return messageWithActualNewlines.replace(/\n/g, '<br>');
  }

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
