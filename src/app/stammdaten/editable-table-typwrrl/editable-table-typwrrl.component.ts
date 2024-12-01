import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatDialog} from '@angular/material/dialog';
import { DialogJaNeinComponent } from 'src/app/shared/dialog-ja-nein/dialog-ja-nein.component';

@Component({
  selector: 'app-editable-table-typwrrl',
  templateUrl: './editable-table-typwrrl.component.html',
  styleUrls: ['./editable-table-typwrrl.component.css']
})

export class EditableTableTypwrrlComponent implements OnInit, OnChanges {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>=new MatTableDataSource();//dataSource: TypWrrl[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: StammdatenService) {}

  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callWrrltyp();
    await this.dataService.wandleTypWRRLAlle();
    console.log(this.dataService.wrrltyp);
   this.dataSource.data=this.dataService.wrrltyp;
   this.dataSource.sort = this.sort;
   
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['wrrlTyp']) {
      this.dataSource.data = this.dataService.wrrltyp;
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
  save(element: TypWrrl): void {
    this.dataService.aktualisiereWrrlTyp(element.typ, element.id, element.seefliess).subscribe(
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
        this.snackBar.open('WRRL-Typ erfolgreich gespeichert!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Fehler beim Speichern des WRRL-Typs:', error);
        this.snackBar.open('Fehler beim Speichern des WRRL-Typs!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  }
  
  new(){
   
      const newRowData = {
        field1: 'neuer Typ',
        field2: true
      };
  
      this.dataService.addRowTypWRRL(newRowData).subscribe(
        (response) => {
          
          let neuerTyp:TypWrrl= {} as TypWrrl;
       
          neuerTyp.id=response.id;
          neuerTyp.typ='neuer Typ';
          neuerTyp.seefliess=true;
          neuerTyp.fliess=false;
          this.snackBar.open('Neuer WRRL-Typ angelegt!', 'Schließen', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          const data = this.dataSource.data;
          data.push(neuerTyp);
          this.dataSource.data = data;
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
   this.dataService.deletewrrltyp( row).subscribe(
     () => {
       console.log('Row saved:', row);
       this.snackBar.open('WRRL-Typ erfolgreich gelöscht!', 'Schließen', {
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
       console.error('WRRL-Typ kann nicht gelöscht werden:', error);
       this.snackBar.open('WRRL-Typ kann nicht gelöscht werden!', 'Schließen', {
         duration: 3000,
         horizontalPosition: 'center',
         verticalPosition: 'top',
       });
     }
   );
 } });}}

