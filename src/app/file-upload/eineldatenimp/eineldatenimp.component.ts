import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-eineldatenimp',
  templateUrl: './eineldatenimp.component.html',
  styleUrls: ['./eineldatenimp.component.css']
})
export class EineldatenimpComponent  implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};

  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'data/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName',
        class: 'none'
      }],
      // Use this attribute to enable the responsive extension
      responsive: true
    };
  }
}
