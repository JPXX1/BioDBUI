import { Component, Input } from '@angular/core';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';


@Component({
  selector: 'app-makorphyten-tabelle',
  templateUrl: './makorphyten-tabelle.component.html',
  styleUrls: ['./makorphyten-tabelle.component.css']
})

export class MakorphytenTabelleComponent {
  @Input()  mstMakrophyten: MstMakrophyten[] = [];
  	
  displayedColumns: string[] = ['mst', 'jahr','taxon','wert',  'einheit','taxonzusatz', 'letzte_aenderung',  'tiefe_m'];
 
  // mst: string;
  // taxonzusatz: string;
  // firma: string;
  // jahr: number;
  // taxon: string;
  // letzte_aenderung: string;
  // wert: string;
  // cf: boolean;
  // tiefe_m: string;
  // einheit: string;
	dataSource=this.mstMakrophyten; 
}
