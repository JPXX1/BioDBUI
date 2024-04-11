import { Component,Input,Output,EventEmitter } from '@angular/core';
import { Sort} from '@angular/material/sort';

import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
@Component({
  selector: 'app-stamm-wk',
  templateUrl: './stamm-wk.component.html',
  styleUrls: ['./stamm-wk.component.css']
})
export class StammWkComponent {
  
  @Input()  wasserkoerperStam: WasserkoerperStam[] = []; 
  //@Output() newData =new EventEmitter<MessstellenStam>();
  @Output() sortDataWK=new EventEmitter<Sort>(); 


  displayedColumns: string[] = ['id', 'wk_name', 'see','kuenstlich','hmwb','bericht_eu','eu_cd_wb','land','pp_typ_str','dia_typ_str','wrrl_typ_str','mp_typ_str','gewaessername','updated_at','actions'];
  dataSource = this.wasserkoerperStam;

  sortData(sort:Sort){

    this.sortDataWK.emit(sort);

  }

  async edit(person: WasserkoerperStam) {}

  showArchiv(person:WasserkoerperStam){

  }
}
