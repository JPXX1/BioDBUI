import { Component, Input } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';

@Component({
  selector: 'app-uebersicht-tabelle',
  templateUrl: './uebersicht-tabelle.component.html',
  styleUrls: ['./uebersicht-tabelle.component.css']
})
export class UebersichtTabelleComponent {


  

  @Input()  wkUebersicht: WkUebersicht[] = [];	
  displayedColumns: string[] = ['WKname', 'Jahr','OKZ_TK_MP', 'OKZ_TK_Dia', 'OKZ_QK_MZB', 'OKZ_QK_F', 'OKZ_QK_P', 'OKZ'];
 

	dataSource=this.wkUebersicht; 


}
