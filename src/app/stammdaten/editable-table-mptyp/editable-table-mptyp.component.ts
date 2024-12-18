import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit ,AfterViewInit,AfterViewChecked} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-editable-table-mptyp',
  templateUrl: './editable-table-mptyp.component.html',
  styleUrls: ['./editable-table-mptyp.component.css']
})
/**
 * Komponente zur Anzeige und Bearbeitung einer Tabelle von TypWrrl-Daten.
 * 
 * @class EditableTableMptypComponent
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
export class EditableTableMptypComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess', 'fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl> = new MatTableDataSource();

  constructor(
    private dataService: StammdatenService,
    private helpService: HelpService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.dataService.callMptyp();
    await this.dataService.wandleTypMP(true, null);
    console.log(this.dataService.mptyp);
    this.dataSource.data = this.dataService.mptyp;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewChecked() {
    this.helpService.registerMouseoverEvents();
  }

  ngAfterViewInit() {
    this.helpService.registerMouseoverEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mpTyp']) {
      this.dataSource.data = this.dataService.mptyp;
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
    this.dataService.aktualisiereMpTyp(element.typ, element.id, element.seefliess);
  }

  new() {
    const newRowData = {
      field1: 'neuer Typ',
      field2: true
    };

    this.dataService.addRowMpWRRL(newRowData).subscribe(
      (response) => {
        let neuerTyp: TypWrrl = {} as TypWrrl;
        neuerTyp.id = response.id;
        neuerTyp.typ = 'neuer Typ';
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