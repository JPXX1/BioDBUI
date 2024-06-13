import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-editable-table-typ-pp',
  templateUrl: './editable-table-typ-pp.component.html',
  styleUrls: ['./editable-table-typ-pp.component.css']
})
export class EditableTableTypPPComponent implements OnInit, OnChanges{
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: MatTableDataSource<TypWrrl>=new MatTableDataSource();

  constructor(private dataService: StammdatenService) {}
  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callPptyp();
    await this.dataService.wandleTypPP(true);
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
          
          this.dataSource.data = [...this.dataSource.data];
        },
        (error) => {
          console.error('Error adding row:', error);
        }
      );
  }
}
