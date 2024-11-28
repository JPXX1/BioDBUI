import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css']
})
/**
 * CustomSnackbarComponent ist eine Komponente, die benutzerdefinierte Snack-Bar-Benachrichtigungen anzeigt.
 * 
 * @param data - Die Daten, die in der Snack-Bar angezeigt werden sollen.
 * @param snackBarRef - Referenz auf die MatSnackBar-Instanz, die diese Snack-Bar erstellt hat.
 * 
 * @example
 * <app-custom-snackbar [data]="yourData"></app-custom-snackbar>
 * 
 * @method dismiss - Schließt die Snack-Bar.
 */
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
