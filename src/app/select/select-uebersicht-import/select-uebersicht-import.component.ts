import { Component,Input,EventEmitter,Output } from '@angular/core';
//import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import {DialogJaNeinComponent} from 'src/app/dialog-ja-nein/dialog-ja-nein.component';
import {UebersichtImportService} from 'src/app/services/uebersicht-import.service';
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


  displayedColumns: string[] = ['dateiname', 'importiert','verfahren', 'probenehmer','komponente', 'jahr','anzahlmst','anzahlwerte','bemerkung','Bearbeiten'];
  
  temp:any=[];
  constructor(public dialog: MatDialog,private uebersichtImportService:UebersichtImportService) { }
 
 
  openEmojiDialog(zeile) {
    let dialog = this.dialog.open(DialogJaNeinComponent);
    dialog.afterClosed().subscribe(result => {
      if (result===true){
        this.uebersichtImportService.loescheDatenMstAbundanz(zeile.id_imp);
        this.uebersichtImportService.loescheDatenMstBewertungen(zeile.id_imp);
        for (let i = 0, l = this.uebersicht.length; i < l; i += 1) {
          if (this.uebersicht[i].id_imp===zeile.id_imp)
        {
          let bem="importierte Daten gelöscht";
          this.uebersicht[i].bemerkung=bem;
          this.uebersichtImportService.aktualisiereImportdaten(0,0,bem,zeile.id_imp)
      }}

      // console.log('The dialog was closed3');
      // console.log(result + zeile.id_imp);
    } });
 
}

loescheDaten(id_imp:number){
  UebersichtImportService

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
