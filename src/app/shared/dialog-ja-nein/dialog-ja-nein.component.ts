import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-ja-nein',
  templateUrl: './dialog-ja-nein.component.html',
  styleUrls: ['./dialog-ja-nein.component.css']
})
/**
 * DialogJaNeinComponent ist eine Dialogkomponente, die eine einfache Ja/Nein-Bestätigungsschnittstelle bietet.
 * 
 * @class
 * @public
 * 
 * @example
 * <app-dialog-ja-nein></app-dialog-ja-nein>
 * 
 * @param {MatDialogRef<DialogJaNeinComponent>} dialogRef - Referenz auf den geöffneten Dialog.
 * 
 * @method cancel - Schließt den Dialog und gibt false zurück.
 * @method confirmation - Protokolliert eine Nachricht und schließt den Dialog, wobei true zurückgegeben wird.
 * @method close - Platzhaltermethode zum Schließen des Dialogs.
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class DialogJaNeinComponent {

constructor(public dialogRef: MatDialogRef<DialogJaNeinComponent>){  }

cancel(){
  this.dialogRef.close(false);
}
confirmation(){
  
  
  console.log('The dialog was closed');
  this.dialogRef.close(true);

 }

close(){

}}
