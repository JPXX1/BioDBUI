import { Component,Input,OnInit,ViewChild,OnChanges, SimpleChanges } from '@angular/core';
import { DataAbiotik } from 'src/app/shared/interfaces/data-abiotik';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-data-abiotik-table-component',
  templateUrl: './data-abiotik-table-component.component.html',
  styleUrls: ['./data-abiotik-table-component.component.css']
})
/**
 * Komponente, die eine Tabelle zur Anzeige von abiotischen Daten darstellt.
 * 
 * @export
 * @class DataAbiotikTableComponentComponent
 * 
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {MatTableDataSource<DataAbiotik>} dataSource - Datenquelle für die Tabelle, die abiotische Daten enthält.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class DataAbiotikTableComponentComponent implements  OnChanges{
  @Input() dataAbiotikSource: DataAbiotik[] = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['wk_name',  'namemst', 'jahr',  'parameter', 'wert', 'einheit', 'letzte_aenderung'];
  dataSource = new MatTableDataSource<DataAbiotik>([
    // Add your data here
  ]);



  
  /**
   * Reagiert auf Änderungen der Eingabe-Eigenschaften der Komponente.
   * 
   * @param changes - Ein Objekt vom Typ `SimpleChanges`, das die aktuellen und vorherigen Werte der Eingabe-Eigenschaften enthält.
   * 
   * Wenn sich die Eigenschaft `dataAbiotikSource` ändert, wird diese Methode:
   * - Die aktuellen Daten in der `dataSource` löschen.
   * - Die `dataSource` mit dem neuen Wert von `dataAbiotikSource` aktualisieren.
   * - Die `sort`-Eigenschaft der `dataSource` auf die `sort`-Eigenschaft der Komponente setzen.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataAbiotikSource']) {
      this.dataSource.data =[];
      this.dataSource.data = this.dataAbiotikSource;
    this.dataSource.sort = this.sort;
    }
    }
}
