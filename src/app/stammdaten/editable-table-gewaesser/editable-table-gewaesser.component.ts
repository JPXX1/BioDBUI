import { Component,  OnInit ,ViewChild,OnChanges,SimpleChanges} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-editable-table-gewaesser',
  templateUrl: './editable-table-gewaesser.component.html',
  styleUrls: ['./editable-table-gewaesser.component.css']
})
export class EditableTableGewaesserComponent  implements OnInit, OnChanges{
  constructor(private dataService: StammdatenService) { this.dataSource = new MatTableDataSource(this.dataService.gewaesser)}
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
 

  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callGewaesser();

    await this.dataService.wandleGewaesser(true);
    this.dataSource.data = this.dataService.gewaesser;
    //console.log(this.dataService.gewaesser);
    this.dataSource.sort = this.sort;
   //this.dataSource=this.dataService.gewaesser;
   
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
    this.dataService.aktualisiereGewaesser(element.typ,element.id,element.seefliess)  
  }
  new(){
   
      const newRowData = {
        field1: 'neues Gewässer',
        field2: 's'
      };
  
      this.dataService.addRowGewaesser(newRowData).subscribe(
        (response) => {
          
          let neuerTyp:TypWrrl= {} as TypWrrl;
       
          neuerTyp.id=response.idgewaesser;
          neuerTyp.typ='neues Gewässer';
          neuerTyp.seefliess=true;
          neuerTyp.fliess=false;

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
}
