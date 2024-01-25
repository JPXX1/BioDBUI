import { Component,Input } from '@angular/core';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
@Component({
  selector: 'app-eineldatenimp',
  templateUrl: './eineldatenimp.component.html',
  styleUrls: ['./eineldatenimp.component.css']
})
export class EineldatenimpComponent {


  constructor(private Farbebewertg: FarbeBewertungService) { }	
  @Input()  Einzeldat:messdata[]=[];	
  displayedColumns: string[] = ['mst', 'probe','tiefe', 'taxon', 'form', 'wert', 'einheit','rl'];
 
  getColor(OZK){
    return this.Farbebewertg.getColorRL(OZK);
     
  }
	dataSource=this.Einzeldat; 
}

interface messdata{
  _Nr:number;
  _Messstelle: string;
  _Tiefe:String;
  _Probe: string;
  _Taxon: string;
  _Form: string;
  _Messwert: string;
  _Einheit: string;
  _cf: string;
  MstOK:boolean;
  OK:boolean;
  _AnzahlTaxa: number;
  _RoteListeD: string;
}