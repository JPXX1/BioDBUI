import { Component,  OnInit ,ViewChild,OnChanges,SimpleChanges} from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-editable-table-gewaesser',
  templateUrl: './editable-table-gewaesser.component.html',
  styleUrls: ['./editable-table-gewaesser.component.css']
})
/**
 * Komponente zur Anzeige und Bearbeitung einer Tabelle von Gewässern.
 * 
 * @class
 * @implements {OnInit, OnChanges}
 * 
 * @constructor
 * @param {StammdatenService} dataService - Service zur Handhabung von Datenoperationen.
 * 
 * @property {string[]} displayedColumns - Anzuzeigende Spalten in der Tabelle.
 * @property {MatTableDataSource<TypWrrl>} dataSource - Datenquelle für die Tabelle.
 * @property {MatSort} sort - Sortierfunktionalität für die Tabelle.
 * 
 * @method ngOnInit - Lifecycle-Hook, der aufgerufen wird, nachdem daten-gebundene Eigenschaften initialisiert wurden.
 * @method ngOnChanges - Lifecycle-Hook, der aufgerufen wird, wenn sich eine daten-gebundene Eigenschaft einer Direktive ändert.
 * @method updateValue - Aktualisiert den Wert eines angegebenen Feldes in einem gegebenen Element.
 * @method updateSee - Aktualisiert das 'seefliess'-Feld und stellt sicher, dass 'fliess' entsprechend aktualisiert wird.
 * @method updateFliess - Aktualisiert das 'fliess'-Feld und stellt sicher, dass 'seefliess' entsprechend aktualisiert wird.
 * @method save - Speichert die aktualisierten Gewässerdaten.
 * @method new - Fügt eine neue Zeile zur Gewässer-Tabelle hinzu.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditableTableGewaesserComponent implements OnInit, OnChanges {
  constructor(  private dataService: StammdatenService) { this.dataSource = new MatTableDataSource(this.dataService.gewaesser) }
  displayedColumns: string[] = ['id', 'typ', 'seefliess', 'fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>;
  isHelpActive: boolean = false;
  helpText: string = '';
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit(): Promise<void> {
    await this.dataService.callGewaesser();
    await this.dataService.wandleGewaesser(true);
    this.dataSource.data = this.dataService.gewaesser;
    this.dataSource.sort = this.sort;
  
 

        
      
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wkUebersicht']) {
      this.dataSource.data = this.dataService.gewaesser;
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

  save(element: TypWrrl) {
    this.dataService.aktualisiereGewaesser(element.typ, element.id, element.seefliess);
  }

  new() {
    const newRowData = {
      field1: 'neues Gewässer',
      field2: 's'
    };

    this.dataService.addRowGewaesser(newRowData).subscribe(
      (response) => {
        let neuerTyp: TypWrrl = {} as TypWrrl;
        neuerTyp.id = response.idgewaesser;
        neuerTyp.typ = 'neues Gewässer';
        neuerTyp.seefliess = true;
        neuerTyp.fliess = false;

        const data = this.dataSource.data;
        data.push(neuerTyp);
        this.dataSource.data = data;
        this.dataSource.data = [...this.dataSource.data];
      },
      (error) => {
        console.error('Fehler beim Hinzufügen der Zeile:', error);
      }
    );
  }
}
