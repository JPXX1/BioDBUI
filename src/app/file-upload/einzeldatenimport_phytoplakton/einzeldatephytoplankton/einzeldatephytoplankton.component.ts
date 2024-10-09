import { Component,Input } from '@angular/core';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';

@Component({
  selector: 'app-einzeldatephytoplankton',
  templateUrl: './einzeldatephytoplankton.component.html',
  styleUrls: ['./einzeldatephytoplankton.component.css']
})
export class EinzeldatephytoplanktonComponent {
  constructor(private Farbebewertg: FarbeBewertungService) { }	
  @Input()  Einzeldat:messdata[]=[];	
  displayedColumns: string[] = ['mst', 'datum', 'taxon', 'parameter', 'wert', 'einheit'];
 
  getColor(OZK){
    return this.Farbebewertg.getColorRL(OZK);
     
  }

 
  getColorFehler(Wert:String){

    return this.Farbebewertg.getColorArtfehltinDB(Wert);
  }
	dataSource=this.Einzeldat; 
}

interface messdata{
  _Nr:number;
  _Messstelle: string;
 
  _Datum?:string;
  
  _Parameter?: string;
  _Taxon: string;
 _Form: string;
  _Messwert: string;
  _Einheit: string;
  _cf: string;

 
 
}
