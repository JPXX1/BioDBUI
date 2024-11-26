import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
})
/**
 * Component representing a confirmation dialog for delete actions.
 * 
 * Diese Komponente bietet zwei Methoden zur Handhabung von Benutzerinteraktionen:
 * - `onNoClick`: Schließt den Dialog und gibt `false` zurück, was anzeigt, dass der Benutzer "Nein" gewählt hat.
 * - `onConfirmClick`: Schließt den Dialog und gibt `true` zurück, was anzeigt, dass der Benutzer "Ja" gewählt hat.
 * 
 * @class
 * @param {MatDialogRef<ConfirmDeleteDialogComponent>} dialogRef - Referenz auf den geöffneten Dialog. 
 * @autor Dr. Jens Päzolt, Umweltsoft */

export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Benutzer hat "Nein" gewählt
  }

  onConfirmClick(): void {
    this.dialogRef.close(true); // Benutzer hat "Ja" gewählt
  }
}
