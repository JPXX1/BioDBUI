import { Component,Input,EventEmitter,Output } from '@angular/core';
import { Sort} from '@angular/material/sort';
import { differenceInWeeks, parse } from 'date-fns';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import {DialogJaNeinComponent} from 'src/app/dialog-ja-nein/dialog-ja-nein.component';
import {UebersichtImportService} from 'src/app/services/uebersicht-import.service';
import { MatDialog  } from '@angular/material/dialog';

@Component({
  selector: 'app-select-uebersicht-import',
  templateUrl: './select-uebersicht-import.component.html',
  styleUrls: ['./select-uebersicht-import.component.css'],
  
 
 
})

export class SelectUebersichtImportComponent {
  @Input()uebersicht:UebersichtImport[];//selectedUebersicht: string;
  @Output() importID =new EventEmitter<number>();
  @Output() loeschen =new EventEmitter<number>();
  @Output() sortDataue=new EventEmitter<Sort>(); 

  displayedColumns: string[] = ['dateiname', 'importiert','verfahren', 'probenehmer','komponente', 'jahr','anzahlmst','anzahlwerte','bemerkung','Bearbeiten'];
  
  temp:any=[];
  constructor(public dialog: MatDialog,private uebersichtImportService:UebersichtImportService) { }
 
  isWithinFourWeeks(dateString: string): boolean {
    const date = this.parseDate(dateString);
    const now = new Date();
    return differenceInWeeks(now, date) <= 4;
  }

  sortData(sort: Sort) {
    const data = this.uebersicht.slice(); // Erstelle eine Kopie des Arrays

    if (!sort.active || sort.direction === '') {
      return;
    }

    this.uebersicht = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'importiert':
          return this.compareDates(a.importiert, b.importiert, isAsc); // Datumssortierung
        default:
          return this.compare(a[sort.active], b[sort.active], isAsc); // Generische Sortierung
      }
    });

    this.sortDataue.emit(sort); // Sende das Sortierevent weiter, falls benötigt
  }

 
 // Vergleichsfunktion für Datum mit Hilfe von date-fns
 compareDates(dateA: string, dateB: string, isAsc: boolean): number {
  const parsedDateA = this.parseDate(dateA);
  const parsedDateB = this.parseDate(dateB);
  return (parsedDateA < parsedDateB ? -1 : 1) * (isAsc ? 1 : -1);
}

// Datumsparser mit date-fns
parseDate(dateString: string): Date {
  return parse(dateString, 'dd.MM.yy HH:mm', new Date()); // Parsen des Strings mit dem Format
}

// Generische Vergleichsfunktion für andere Felder
compare(a: any, b: any, isAsc: boolean): number {
  if (typeof a === 'string' && typeof b === 'string') {
    return (a.localeCompare(b)) * (isAsc ? 1 : -1); // Stringvergleich
  } else if (typeof a === 'number' && typeof b === 'number') {
    return ((a < b ? -1 : 1) * (isAsc ? 1 : -1)); // Zahlenvergleich
  } else {
    return 0; // Für andere Typen keine Sortierung
  }
}


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

// loescheDaten(id_imp:number){
//  // this.UebersichtImportService.loescheDatenMstAbundanz(id_imp);

// }
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
