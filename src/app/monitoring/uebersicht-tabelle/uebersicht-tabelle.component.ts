import { Component, Input } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';

@Component({
  selector: 'app-uebersicht-tabelle',
  templateUrl: './uebersicht-tabelle.component.html',
  styleUrls: ['./uebersicht-tabelle.component.css']
})
export class UebersichtTabelleComponent {


  

  @Input()  wkUebersicht: WkUebersicht[] = [];	
  displayedColumns: string[] = ['WKname', 'Jahr','OKZ_TK_MP','OKZ_TK_Dia',  'OKZ_QK_P','OKZ_QK_MZB', 'OKZ_QK_F',  'OKZ'];
 

	dataSource=this.wkUebersicht; 

  getColor(OZK) {
    switch (OZK) {
      case '1':
        return 'rgb(0, 158, 224)';
      case '2':
        return 'rgb(0, 144, 54)';
        case '3':
          return 'rgb(255, 255, 0)';
          case '4':
        return 'rgb(255, 153, 0)';
        case '5':
        return 'rgb(226, 0, 26)';
        default:
          return 'withe';
    }
  }
}
