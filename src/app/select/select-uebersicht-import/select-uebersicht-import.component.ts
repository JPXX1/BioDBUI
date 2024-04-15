import { Component,Input,EventEmitter,Output } from '@angular/core';
//import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import {DialogJaNeinComponent} from 'src/app/dialog-ja-nein/dialog-ja-nein.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
@Component({
  selector: 'app-select-uebersicht-import',
  templateUrl: './select-uebersicht-import.component.html',
  styleUrls: ['./select-uebersicht-import.component.css'],
  
 
 
})

export class SelectUebersichtImportComponent {
  @Input()uebersicht:UebersichtImport[];//selectedUebersicht: string;
  @Output() importID =new EventEmitter<number>();
  @Output() loeschen =new EventEmitter<number>();


  displayedColumns: string[] = ['dateiname', 'importiert','verfahren', 'probenehmer','komponente', 'jahr','anzahlmst','anzahlwerte','Bearbeiten'];
  
  temp:any=[];
  constructor(public dialog: MatDialog) { }
 
 
  openEmojiDialog(zeile) {
    let dialog = this.dialog.open(DialogJaNeinComponent);
    dialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed3');
      console.log(result + zeile.id_imp);
    });
 
}


  onSelect(newValue) {
    console.log(newValue);
    // this.selectedUebersicht = newValue;
   
}

onDeleteClick(zeile){
this.openEmojiDialog(zeile);

}


handleRowClick(zeile){
console.log(zeile);
this.importID.emit(zeile);


}

}
