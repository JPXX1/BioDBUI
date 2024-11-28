import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatDialog} from '@angular/material/dialog';
import { DialogJaNeinComponent } from 'src/app/shared/dialog-ja-nein/dialog-ja-nein.component';
@Component({
  selector: 'app-editable-table-typ-pp',
  templateUrl: './editable-table-typ-pp.component.html',
  styleUrls: ['./editable-table-typ-pp.component.css']
})

export class EditableTableTypPPComponent implements OnInit, OnChanges{
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>=new MatTableDataSource();

  constructor(public dialog: MatDialog,private dataService: StammdatenService, private snackBar: MatSnackBar) {}
  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callPptyp();
    await this.dataService.wandleTypPP(true,null);
    console.log(this.dataService.pptyp);
   this.dataSource.data=this.dataService.pptyp;
   this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ppTyp']) {
      this.dataSource.data = this.dataService.pptyp;
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
  save(element: TypWrrl){//typwrrl:string,id:number,seefliess:boolean
    this.dataService.aktualisiereWrrlTyp(element.typ,element.id,element.seefliess)  
  }
  new(){
   
      const newRowData = {
        field1: 'neuer Typ',
        field2: true
      };
  
      this.dataService.addRowPPWRRL(newRowData).subscribe(
        (response) => {
          
          let neuerTyp:TypWrrl= {} as TypWrrl;
       
          neuerTyp.id=response.id;
          neuerTyp.typ='neuer Typ';
          neuerTyp.seefliess=true;
          neuerTyp.fliess=false;
          const data = this.dataSource.data;
          data.push(neuerTyp);
          this.dataSource.data = data; 
          this.snackBar.open('Neuer Phytoplanktontyp angelegt!', 'Schließen', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dataSource.data = [...this.dataSource.data];
        },
        (error) => {
          console.error('Error adding row:', error);
        }
      );
  }
  /**
   * Löscht eine Zeile vom Typ `TypWrrl` aus der Datenquelle.
   * 
   * Diese Methode ruft die Methode `deletePPtyp` des `dataService` auf, um die angegebene Zeile zu löschen.
   * Bei erfolgreicher Löschung wird eine Nachricht protokolliert, eine Erfolgssnackbar angezeigt und die Datenquelle durch Entfernen der gelöschten Zeile aktualisiert.
   * Wenn die Löschung fehlschlägt, wird eine Fehlermeldung protokolliert und eine Fehlersnackbar angezeigt.
   * 
   * @param {TypWrrl} row - Die zu löschende Zeile.
   * @returns {void}
   */
  deleteRow(row: TypWrrl): void {
     let dialog = this.dialog.open(DialogJaNeinComponent);
    dialog.afterClosed().subscribe(result => {
      if (result===true){
    this.dataService.deletePPtyp( row).subscribe(
      () => {
        console.log('Row saved:', row);
        this.snackBar.open('Phytoplanktontyp erfolgreich gelöscht!', 'Schließen', {
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
        console.error('Phytoplanktontyp kann nicht gelöscht werden:', error);
        this.snackBar.open('Phytoplanktontyp kann nicht gelöscht werden!', 'Schließen', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
  } });}
}
