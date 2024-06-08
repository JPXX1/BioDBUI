import { Component,OnInit } from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
@Component({
  selector: 'app-editable-table-typwrrl',
  templateUrl: './editable-table-typwrrl.component.html',
  styleUrls: ['./editable-table-typwrrl.component.css']
})
// export class EditableTableTypwrrlComponent {

// }

// // src/app/editable-table-typwrrl/editable-table-typwrrl.component.ts

// // import { DataService, TypWrrl } from '../data.service';

// @Component({
//   selector: 'app-editable-table-typwrrl',
//   templateUrl: './editable-table-typwrrl.component.html',
//   styleUrls: ['./editable-table-typwrrl.component.css']
// })
export class EditableTableTypwrrlComponent implements OnInit {
  displayedColumns: string[] = ['id', 'typ', 'seefliess', 'actions'];
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
    if (field === 'seefliess') {
      element[field] = event.checked;
    } else {
      element[field] = event.target.textContent;
    }
  }
}

