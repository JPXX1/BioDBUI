import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit ,AfterViewInit,AfterViewChecked} from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HelpService } from 'src/app/shared/services/help.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatDialog} from '@angular/material/dialog';
import { DialogJaNeinComponent } from 'src/app/shared/dialog-ja-nein/dialog-ja-nein.component';

@Component({
  selector: 'app-editable-table-mzbtyp',
  templateUrl: './editable-table-mzbtyp.component.html',
  styleUrls: ['./editable-table-mzbtyp.component.css']
})
/**
 * Komponente zur Anzeige und Bearbeitung einer Tabelle von TypWrrl-Daten.
 * 
 * @class EditableTableMZBtypComponent
 * @implements {OnInit, OnChanges, AfterViewChecked, AfterViewInit}
 * 
 * @property {MatSort} sort - Referenz zur MatSort-Direktive für die Sortierung der Tabelle.
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {MatTableDataSource<TypWrrl>} dataSource - Datenquelle für die Tabelle.
 * 
 * @constructor
 * @param {StammdatenService} dataService - Service zur Handhabung von Datenoperationen.
 * @param {HelpService} helpService - Service zur Handhabung von hilfebezogenen Operationen.
 * 
 * @method ngOnInit - Lifecycle-Hook, der aufgerufen wird, nachdem die datengebundenen Eigenschaften initialisiert wurden.
 * @method ngAfterViewChecked - Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht überprüft wurde.
 * @method ngAfterViewInit - Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht initialisiert wurde.
 * @method ngOnChanges - Lifecycle-Hook, der aufgerufen wird, wenn sich eine datengebundene Eigenschaft einer Direktive ändert.
 * @param {SimpleChanges} changes - Objekt der Änderungen.
 * 
 * @method updateValue - Aktualisiert den Wert eines angegebenen Feldes in einem TypWrrl-Element.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method updateSee - Aktualisiert das 'seefliess'-Feld eines TypWrrl-Elements und toggelt das 'fliess'-Feld.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method updateFliess - Aktualisiert das 'fliess'-Feld eines TypWrrl-Elements und toggelt das 'seefliess'-Feld.
 * @param {TypWrrl} element - Das zu aktualisierende TypWrrl-Element.
 * @param {string} field - Das zu aktualisierende Feld.
 * @param {any} event - Das Ereignis, das den neuen Wert enthält.
 * 
 * @method save - Speichert das aktualisierte TypWrrl-Element.
 * @param {TypWrrl} element - Das zu speichernde TypWrrl-Element.
 * 
 * @method new - Fügt der Tabelle eine neue Zeile hinzu und aktualisiert die Datenquelle.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditableTableMZBtypComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess', 'fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl> = new MatTableDataSource();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: StammdatenService,
    private helpService: HelpService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.dataService.callMZBtyp();
    await this.dataService.wandleTypMZB(true, null);
    console.log(this.dataService.mptyp);
    this.dataSource.data = this.dataService.mzbtyp;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    this.helpService.registerMouseoverEvents();
  }

  ngAfterViewInit() {
    this.helpService.registerMouseoverEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mzbTyp']) {
      this.dataSource.data = this.dataService.mzbtyp;
    }
  }

  updateValue(element: TypWrrl, field: string, event: any): void {
    element[field] = event.target.textContent;
  }

  updateSee(element: TypWrrl, field: string, event: any): void {
    if (field === 'seefliess') {
      element[field] = event.checked;
      element.fliess = !event.checked;
    } else {
      element[field] = event.target.textContent;
    }
  }

  updateFliess(element: TypWrrl, field: string, event: any): void {
    if (field === 'fliess') {
      element[field] = event.checked;
      element.seefliess = !event.checked;
    } else {
      element[field] = event.target.textContent;
    }
  }

  save(element: TypWrrl): void {
    this.dataService.aktualisiereMZBTyp(element.typ, element.id, element.seefliess).subscribe(
      (response) => {
        const aktualisierterEintrag = {
          id: response.id || element.id,
          typ: element.typ,
          seefliess: element.seefliess,
          fliess: !element.seefliess, // Abgeleitete Eigenschaft
        };
  
        const data = this.dataSource.data;
        const index = data.findIndex((item) => item.id === element.id);
  
        if (index !== -1) {
          // Vorhandene Zeile aktualisieren
          data[index] = { ...data[index], ...aktualisierterEintrag };
        } else {
          // Neue Zeile hinzufügen (falls nicht vorhanden)
          data.push(aktualisierterEintrag);
        }
  
        // Datenquelle aktualisieren
        this.dataSource.data = [...data];
  
        // Erfolgsmeldung anzeigen
        this.snackBar.open('Makrozoobenthos-Typ erfolgreich gespeichert!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Fehler beim Speichern des Makrozoobenthos-Typs:', error);
        this.snackBar.open('Fehler beim Speichern des Makrozoobenthos-Typs!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
  

  new() {
    const newRowData = {
      field1: 'neuer Typ',
      field2: true
    };

    this.dataService.addRowMZBWRRL(newRowData).subscribe(
      (response) => {
        let neuerTyp: TypWrrl = {} as TypWrrl;
        neuerTyp.id = response.id;
        neuerTyp.typ = 'neuer Typ';
        neuerTyp.seefliess = true;
        neuerTyp.fliess = false;
        const data = this.dataSource.data;
        data.push(neuerTyp);
        this.snackBar.open('Neuer Makrozoobenthostyp angelegt!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.dataSource.data = data;
        this.dataSource.data = [...this.dataSource.data];
      },
      (error) => {
        console.error('Fehler beim Hinzufügen der Zeile:', error);
      }
    );
  }
  deleteRow(row: TypWrrl): void {
    let dialog = this.dialog.open(DialogJaNeinComponent);
   dialog.afterClosed().subscribe(result => {
     if (result===true){
   this.dataService.deleteMZBtyp( row).subscribe(
     () => {
       console.log('Row saved:', row);
       this.snackBar.open('Makrozoobenthostyp erfolgreich gelöscht!', 'Schließen', {
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
       console.error('Makrozoobenthostyp kann nicht gelöscht werden:', error);
       this.snackBar.open('Makrozoobenthostyp kann nicht gelöscht werden!', 'Schließen', {
         duration: 3000,
         horizontalPosition: 'center',
         verticalPosition: 'top',
       });
     }
   );
 } });}
}