import { Component,OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';

@Component({
  selector: 'app-editable-table-typwrrl',
  templateUrl: './editable-table-typwrrl.component.html',
  styleUrls: ['./editable-table-typwrrl.component.css']
})

export class EditableTableTypwrrlComponent implements OnInit {
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: TypWrrl[] = [];

  constructor(private dataService: StammdatenService) {}

  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callWrrltyp();
    await this.dataService.wandleTypWRRLAlle();
    console.log(this.dataService.wrrltyp);
   this.dataSource=this.dataService.wrrltyp;
   
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
  
      this.dataService.addRowTypWRRL(newRowData).subscribe(
        (response) => {
          
          let neuerTyp:TypWrrl= {} as TypWrrl;
       
          neuerTyp.id=response.id;
          neuerTyp.typ='neuer Typ';
          neuerTyp.seefliess=true;
          neuerTyp.fliess=false;
          this.dataSource.push(neuerTyp);
          this.dataSource = [...this.dataSource];
        },
        (error) => {
          console.error('Error adding row:', error);
        }
      );
  }
}

