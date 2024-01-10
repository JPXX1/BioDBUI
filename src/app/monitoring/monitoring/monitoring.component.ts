import { Component,OnInit } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { MakrophytenMstUebersichtComponent } from '../makrophyten-mst-uebersicht/makrophyten-mst-uebersicht.component';
import { MstUebersicht } from 'src/app/interfaces/mst-uebersicht';


@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{
  public wkUebersicht: WkUebersicht[] = [];//Wasserkoerper
  public mstMakrophyten:MstMakrophyten[]=[];//Taxa
  public mstUebersicht:MstUebersicht[]=[];//MstBewertungKreuztabelle
  public MakrophytenAnzeige:boolean=false;
  public MakrophytenMstAnzeige:boolean=false;
  

  constructor(private anzeigeBewertungService: AnzeigeBewertungService, private anzeigeBewertungMPService:AnzeigeBewertungMPService,private anzeigenMstUebersichtService:AnzeigenMstUebersichtService) { 
	}
  async ngOnInit() {
		await this. anzeigeBewertungService.ngOnInit();
    this.wkUebersicht=this.anzeigeBewertungService.wkUebersicht;
	}
  handleUebersicht(){
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
  }
  async handleMakrophytenClick(){
  await this.anzeigeBewertungMPService.callBwMstMP();
  this.anzeigeBewertungMPService.datenUmwandeln();
  this.MakrophytenAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
  }

  async handleMakrophytenMPClick(){
    await this.anzeigenMstUebersichtService.call();
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=true;
    this.mstUebersicht=this.anzeigenMstUebersichtService.mstUebersicht ;
    }
}
