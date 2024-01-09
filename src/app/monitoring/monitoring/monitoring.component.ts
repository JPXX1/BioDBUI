import { Component,OnInit } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';


@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{
  public wkUebersicht: WkUebersicht[] = [];
  public mstMakrophyten:MstMakrophyten[]=[];
  public MakrophytenAnzeige:boolean=false;

  constructor(private anzeigeBewertungService: AnzeigeBewertungService, private anzeigeBewertungMPService:AnzeigeBewertungMPService) { 
	}
  async ngOnInit() {
		await this. anzeigeBewertungService.ngOnInit();
    this.wkUebersicht=this.anzeigeBewertungService.wkUebersicht;
	}
  handleUebersicht(){
    this.MakrophytenAnzeige=false;
  }
  async handleMakrophytenClick(){
  await this.anzeigeBewertungMPService.callBwMstMP();
  this.anzeigeBewertungMPService.datenUmwandeln();
  this.MakrophytenAnzeige=true;
  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
  }
}
