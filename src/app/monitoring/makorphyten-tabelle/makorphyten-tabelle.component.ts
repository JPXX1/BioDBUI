import { Component, Input } from '@angular/core';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';

@Component({
  selector: 'app-makorphyten-tabelle',
  templateUrl: './makorphyten-tabelle.component.html',
  styleUrls: ['./makorphyten-tabelle.component.css']
})

export class MakorphytenTabelleComponent {
  @Input()  mstMakrophyten: MstMakrophyten[] = [];
  constructor(private Farbebewertg: FarbeBewertungService) { }	
  displayedColumns: string[] = ['mst', 'jahr','taxon','wert',  'einheit','taxonzusatz', 'RoteListeD',  'tiefe_m','letzteAenderung'];
 
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

  getColor(OZK){
    return this.Farbebewertg.getColorRL(OZK);
     
  }
}
