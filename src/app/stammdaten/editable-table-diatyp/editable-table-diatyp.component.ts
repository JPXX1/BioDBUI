import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatDialog} from '@angular/material/dialog';
import { DialogJaNeinComponent } from 'src/app/shared/dialog-ja-nein/dialog-ja-nein.component';


@Component({
  selector: 'app-editable-table-diatyp',
  templateUrl: './editable-table-diatyp.component.html',
  styleUrls: ['./editable-table-diatyp.component.css']
})
/**
 * @fileoverview EditableTableDiatypComponent ist eine Angular-Komponente, die eine Tabelle mit TypWrrl-Daten verwaltet und anzeigt.
 * Sie ermöglicht das Sortieren, Aktualisieren und Hinzufügen neuer Zeilen zur Tabelle.
 * 
 * @class EditableTableDiatypComponent
 * @implements {OnInit, OnChanges}
 * 
 * @property {MatSort} sort - Referenz auf die MatSort-Direktive zum Sortieren der Tabelle.
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {MatTableDataSource<TypWrrl>} dataSource - Datenquelle für die Tabelle, die TypWrrl-Objekte enthält.
 * 
 * @constructor
 * @param {StammdatenService} dataService - Service zur Handhabung von Datenoperationen im Zusammenhang mit TypWrrl.
 * 
 * @method ngOnInit - Lifecycle-Hook, der die Komponente initialisiert, Daten abruft und das Sortieren einrichtet.
 * @returns {Promise<void>}
 * 
 * @method ngOnChanges - Lifecycle-Hook, der Änderungen an Eingabe-Eigenschaften behandelt.
 * @param {SimpleChanges} changes - Objekt, das die Änderungen an den Eingabe-Eigenschaften enthält.
 * 
 * @method updateValue - Aktualisiert den Wert eines bestimmten Feldes in einem TypWrrl-Element.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method updateSee - Aktualisiert das 'seefliess'-Feld eines TypWrrl-Elements und passt das 'fliess'-Feld entsprechend an.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method updateFliess - Aktualisiert das 'fliess'-Feld eines TypWrrl-Elements und passt das 'seefliess'-Feld entsprechend an.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method save - Speichert das aktualisierte TypWrrl-Element, indem der Datenservice aufgerufen wird.
 * @param {TypWrrl} element - Das zu speichernde TypWrrl-Element.
 * 
 * @method new - Fügt der Tabelle eine neue Zeile mit Standardwerten hinzu und aktualisiert die Datenquelle.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditableTableDiatypComponent  implements OnInit, OnChanges{

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>=new MatTableDataSource();

  constructor(   
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: StammdatenService) {}
  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callDiatyp();
    await this.dataService.wandleTypDia(true,null);
    console.log(this.dataService.diatyp);
   this.dataSource.data=this.dataService.diatyp;
   this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['diaTyp']) {
      this.dataSource.data = this.dataService.diatyp;
    }
  }
  updateValue(element: TypWrrl, field: string, event: any): void {

    element[field] = event.target.textContent;
  }
  updateSee(element: TypWrrl, field: string, event: any): void {
    if (field === 'seefliess') {
      element[field] = event.checked;
      if (event.checked===true){element.fliess=false;}else{element.fliess=true}
    } else {
      element[field] = event.target.textContent;
    }
  }
  updateFliess(element: TypWrrl, field: string, event: any): void {
    if (field === 'fliess') {
      element[field] = event.checked;
      if (event.checked===true){element.seefliess=false;}else{element.seefliess=true}
    } else {
      element[field] = event.target.textContent;
    }
  }
  save(element: TypWrrl) {
    this.dataService.aktualisiereDiaTyp(element.typ, element.id, element.seefliess).subscribe(
      resp => {
        this.snackBar.open('Diatomeentyp erfolgreich gespeichert!', 'Schließen', {
          duration: 3000, // Dauer der Snackbar in Millisekunden
          horizontalPosition: 'center', // Position (z.B., start, center, end)
          verticalPosition: 'top', // Position (z.B., top, bottom)
        });
        // Weitere Verarbeitung des Responses hier
      },
      error => {
        console.error('Fehler beim Speichern:', error);
        // Fehlerhandling hier
      }
    );
  }
  
  new(){
   
      const newRowData = {
        field1: 'neuer Typ',
        field2: true
      };
  
      this.dataService.addRowDiaWRRL(newRowData).subscribe(
        (response) => {
          
          let neuerTyp:TypWrrl= {} as TypWrrl;
       
          neuerTyp.id=response.id_dia;
          neuerTyp.typ='neuer Typ';
          neuerTyp.seefliess=true;
          neuerTyp.fliess=false;
          const data = this.dataSource.data;
          data.push(neuerTyp);
          this.dataSource.data = data; 
          this.snackBar.open('Diatomeentyp erfolgreich angelegt!', 'Schließen', {
            duration: 3000, // Dauer der Snackbar in Millisekunden
            horizontalPosition: 'center', // Position (z.B., start, center, end)
            verticalPosition: 'top', // Position (z.B., top, bottom)
          });
          this.dataSource.data = [...this.dataSource.data];
        },
        (error) => {
          console.error('Error adding row:', error);
        }
      );
  }
  deleteRow(row: TypWrrl): void {
    let dialog = this.dialog.open(DialogJaNeinComponent);
   dialog.afterClosed().subscribe(result => {
     if (result===true){
   this.dataService.deleteDiatyp( row).subscribe(
     () => {
       console.log('Row saved:', row);
       this.snackBar.open('Diatomeentyp erfolgreich gelöscht!', 'Schließen', {
         duration: 3000, // Dauer der Snackbar in Millisekunden
         horizontalPosition: 'center', // Position (z.B., start, center, end)
         verticalPosition: 'top', // Position (z.B., top, bottom)
       });
       const data = this.dataSource.data; // Bestehende Daten holen
       const index = data.findIndex(p => p.id === row.id); // Element finden
       if (index > -1) {
         data.splice(index, 1); // Element entfernen
         this.dataSource.data = [...data]; // Datenquelle aktualisieren
       }
     },
     (error) => {
       console.error('Diatomeentyp kann nicht gelöscht werden:', error);
       this.snackBar.open('Diatomeentyp kann nicht gelöscht werden!', 'Schließen', {
         duration: 3000,
         horizontalPosition: 'center',
         verticalPosition: 'top',
       });
     }
   );
 } });}
}

