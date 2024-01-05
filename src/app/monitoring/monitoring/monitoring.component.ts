import { Component,OnInit } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service'

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{
  public wkUebersicht: WkUebersicht[] = [];
  constructor(private anzeigeBewertungService: AnzeigeBewertungService) { 
	}
  async ngOnInit() {
		await this. anzeigeBewertungService.ngOnInit();
    this.wkUebersicht=this.anzeigeBewertungService.wkUebersicht;
	}
}
