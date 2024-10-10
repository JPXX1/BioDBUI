import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
})
export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Benutzer hat "Nein" gewählt
  }

  onConfirmClick(): void {
    this.dialogRef.close(true); // Benutzer hat "Ja" gewählt
  }
}
