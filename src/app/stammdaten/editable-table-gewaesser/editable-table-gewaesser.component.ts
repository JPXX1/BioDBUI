import { Component,  OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
@Component({
  selector: 'app-editable-table-gewaesser',
  templateUrl: './editable-table-gewaesser.component.html',
  styleUrls: ['./editable-table-gewaesser.component.css']
})
export class EditableTableGewaesserComponent  implements OnInit{
  constructor(private dataService: StammdatenService) {}
  displayedColumns: string[] = ['id', 'typ', 'seefliess','fliess', 'actions'];
  dataSource: TypWrrl[] = [];

 

  async ngOnInit(): Promise<void> {
    //this.dataSource = await this.dataService.getStammWrrlTyp2();
 
    
    await this.dataService.callGewaesser();

    await this.dataService.wandleGewaesser(true);
    console.log(this.dataService.gewaesser);
   this.dataSource=this.dataService.gewaesser;
   
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
          this.dataSource.push(neuerTyp);
          this.dataSource = [...this.dataSource];
        },
        (error) => {
          console.error('Error adding row:', error);
        }
      );
  }
}
