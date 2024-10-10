import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-password-dialog',
  templateUrl: './confirm-password-dialog.component.html',
})
export class ConfirmPasswordDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmPasswordDialogComponent>) {}

  onCancelClick(): void {
    this.dialogRef.close(false);  // Passwortänderung abbrechen
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);  // Passwortänderung bestätigen
  }
}
