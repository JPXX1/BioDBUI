import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-password-dialog',
  templateUrl: './confirm-password-dialog.component.html',
})
/**
 * Komponente zur Bestätigung von Passwortänderungen in einem Dialog.
 * 
 * Diese Komponente bietet eine Dialogschnittstelle, mit der Benutzer Passwortänderungen bestätigen oder abbrechen können.
 * Sie verwendet Angular Materials MatDialogRef, um den Dialogzustand zu verwalten.
 * 
 * @export
 * @class ConfirmPasswordDialogComponent
 *  @autor Dr. Jens Päzolt, Umweltsoft
 */
export class ConfirmPasswordDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmPasswordDialogComponent>) {}

  onCancelClick(): void {
    this.dialogRef.close(false);  // Passwortänderung abbrechen
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);  // Passwortänderung bestätigen
  }
}
