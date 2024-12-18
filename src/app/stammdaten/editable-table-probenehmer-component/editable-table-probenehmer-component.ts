import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StammdatenService } from 'src/app/services/stammdaten.service';
import {Probenehmer} from 'src/app/interfaces/probenehmer';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editable-table-probenehmer',
  templateUrl: './editable-table-probenehmer-component.html',
  styleUrls: ['./editable-table-probenehmer-component.css'],
})
/**
 * Komponente zur Anzeige und Verwaltung einer Tabelle von Probenehmern (Probenehmer).
 * 
 * @class
 * @implements {OnInit}
 * 
 * @example
 * <app-editable-table-probenehmer></app-editable-table-probenehmer>
 * 
 * @property {string[]} displayedColumns - Die in der Tabelle angezeigten Spalten.
 * @property {MatTableDataSource<Probenehmer>} dataSource - Die Datenquelle für die Tabelle.
 * @property {MatSort} sort - Die Sortierrichtlinie für die Tabelle.
 * 
 * @constructor
 * @param {StammdatenService} service - Der Service zur Verwaltung der Probenehmer-Daten.
 * @param {MatSnackBar} snackBar - Der Service zur Anzeige von Snack-Bar-Benachrichtigungen.
 * 
 * @method
 * @name ngOnInit
 * @description Initialisiert die Komponente und lädt die Probenehmer-Daten.
 * 
 * @method
 * @name loadProbenehmer
 * @description Lädt die Probenehmer-Daten vom Service und richtet die Sortierung ein.
 * 
 * @method
 * @name addProbenehmer
 * @description Fügt der Tabelle einen neuen Probenehmer hinzu und zeigt eine Benachrichtigung an.
 * 
 * @method
 * @name updateRow
 * @param {any} row - Die zu aktualisierenden Zeilendaten.
 * @param {FocusEvent} event - Das Fokussierungsereignis, das den neuen Wert enthält.
 * @param {string} field - Das zu aktualisierende Feld.
 * @description Aktualisiert ein bestimmtes Feld in einer Zeile, wenn sich der Wert ändert.
 * 
 * @method
 * @name saveRow
 * @param {Probenehmer} row - Die zu speichernden Zeilendaten.
 * @description Speichert die aktualisierten Zeilendaten im Service und zeigt eine Benachrichtigung an.
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditableTableProbenehmerComponent implements OnInit {
  displayedColumns: string[] = ['id_pn', 'firma', 'adresse', 'mail', 'telefonnummer', 'actions'];
  dataSource = new MatTableDataSource<Probenehmer>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StammdatenService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadProbenehmer();
  }

  loadProbenehmer(): void {
    this.service.getProbenehmer().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort; // Sortierung aktivieren
    });
  }

  addProbenehmer(): void {
    const newProbenehmer = {
      firma: 'Neue Firma',
      adresse: 'Neue Adresse',
      mail: 'neue@mail.com',
      telefonnummer: '12345678'
    };
  
    this.service.addProbenehmer(newProbenehmer).subscribe(
      (response) => {
        const neuerProbenehmer = {
          id_pn: response.id_pn,
          firma: response.firma,
          adresse: response.adresse,
          mail: response.mail,
          telefonnummer: response.telefonnummer,
          isNew: true // Markierung für neue Zeile
        };
  
        const data = this.dataSource.data;
        data.push(neuerProbenehmer);
        this.dataSource.data = [...data];
  
        // Entferne die Markierung nach 3 Sekunden
        setTimeout(() => {
          neuerProbenehmer.isNew = false;
          this.dataSource.data = [...this.dataSource.data];
        }, 3000);
  
        this.snackBar.open('Neuer Probenehmer erfolgreich angelegt!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Fehler beim Hinzufügen des Probenehmers:', error);
        this.snackBar.open('Fehler beim Hinzufügen des Probenehmers!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
  
  

  updateRow(row: any, event: FocusEvent, field: string): void {
    const target = event.target as HTMLElement;
    const newValue = target.innerText.trim();
  
    // Nur aktualisieren, wenn sich der Wert geändert hat
    if (row[field] !== newValue) {
      row[field] = newValue;
      console.log(`Row updated:`, row);
    }
  }
  

  saveRow(row: Probenehmer): void {
    this.service.updateProbenehmer( row).subscribe(
      () => {
        console.log('Row saved:', row);
        this.snackBar.open('Änderungen erfolgreich gespeichert!', 'Schließen', {
          duration: 3000, // Dauer der Snackbar in Millisekunden
          horizontalPosition: 'center', // Position (z.B., start, center, end)
          verticalPosition: 'top', // Position (z.B., top, bottom)
        });
      },
      (error) => {
        console.error('Fehler beim Speichern:', error);
        this.snackBar.open('Fehler beim Speichern der Änderungen!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
  
}
