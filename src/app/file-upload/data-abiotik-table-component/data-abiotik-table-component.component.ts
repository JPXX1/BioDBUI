import { Component,Input,OnInit,ViewChild,OnChanges, SimpleChanges } from '@angular/core';
import { DataAbiotik } from 'src/app/interfaces/data-abiotik';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-data-abiotik-table-component',
  templateUrl: './data-abiotik-table-component.component.html',
  styleUrls: ['./data-abiotik-table-component.component.css']
})
/**
 * Component representing a table for displaying abiotik data.
 * 
 * @export
 * @class DataAbiotikTableComponentComponent
 * 
 * @property {string[]} displayedColumns - Array of column names to be displayed in the table.
 * @property {MatTableDataSource<DataAbiotik>} dataSource - Data source for the table containing abiotik data.
 */
export class DataAbiotikTableComponentComponent implements  OnChanges{
  @Input() dataAbiotikSource: DataAbiotik[] = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['wk_name',  'namemst', 'jahr',  'parameter', 'wert', 'einheit', 'letzte_aenderung'];
  dataSource = new MatTableDataSource<DataAbiotik>([
    // Add your data here
  ]);



  // ngOnInit() {
  //   this.dataSource.data = this.dataAbiotikSource;
  //   this.dataSource.sort = this.sort;
  // }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataAbiotikSource']) {
      this.dataSource.data =[];
      this.dataSource.data = this.dataAbiotikSource;
    this.dataSource.sort = this.sort;
    }
    }
}
