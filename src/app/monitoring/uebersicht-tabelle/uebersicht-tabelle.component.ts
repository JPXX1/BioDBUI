import { Component, Input } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';

@Component({
  selector: 'app-uebersicht-tabelle',
  templateUrl: './uebersicht-tabelle.component.html',
  styleUrls: ['./uebersicht-tabelle.component.css']
})
export class UebersichtTabelleComponent {

constructor(private Farbebewertg: FarbeBewertungService) { }
  

  @Input()  wkUebersicht: WkUebersicht[] = [];	
  
  displayedColumns: string[] = ['WKname', 'Jahr','OKZ_TK_MP','OKZ_TK_Dia',  'OKZ_QK_P','OKZ_QK_MZB', 'OKZ_QK_F',  'OKZ'];
  

	dataSource=this.wkUebersicht; 

  getColor(OZK):string {

    return this.Farbebewertg.getColor(OZK);
   
  }
}
