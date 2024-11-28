import { Component,Input } from '@angular/core';
import { FarbeBewertungService } from 'src/app/shared/services/farbe-bewertung.service';


@Component({
  selector: 'app-makrophyten-mst-uebersicht',
  templateUrl: './makrophyten-mst-uebersicht.component.html',
  styleUrls: ['./makrophyten-mst-uebersicht.component.css']
})
export class MakrophytenMstUebersichtComponent {
@Input()  pros:any [] = [];	

  constructor(private Farbebewertg: FarbeBewertungService) { }

  displayColumnNames:string[]=this.pros[1]//['wk','mst','2001'];
  displayedColumns: string[] = this.pros[2];//['wk','mst','2001'];
  // thi
  dataSource=this.pros[0];
  
getColor(OZK){
  return this.Farbebewertg.getColor(OZK);
   
}

}
