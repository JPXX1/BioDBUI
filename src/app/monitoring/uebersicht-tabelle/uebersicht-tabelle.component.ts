import { Component, Input,ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-uebersicht-tabelle',
  templateUrl: './uebersicht-tabelle.component.html',
  styleUrls: ['./uebersicht-tabelle.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UebersichtTabelleComponent {

constructor(private anzeigeBewertungService:AnzeigeBewertungService,private Farbebewertg: FarbeBewertungService) {  this.dataSource = new MatTableDataSource(this.wkUebersicht); }
  
@ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()  wkUebersicht: WkUebersicht[] = [];	
  
  displayedColumns: string[] = ['WKname', 'Jahr','OKZ_TK_MP','OKZ_TK_Dia',  'OKZ_QK_P','OKZ_QK_MZB', 'OKZ_QK_F',  'OKZ'];
  
  dataSource: MatTableDataSource<WkUebersicht>;
	

  getColor(OZK):string {

    return this.Farbebewertg.getColor(OZK);
   
  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wkUebersicht']) {

      if (this.wkUebersicht.length=== 0 && this.anzeigeBewertungService.value.length===0){
        this.wkUebersicht=this.anzeigeBewertungService.wkUebersicht;}
      this.dataSource.data = this.wkUebersicht;
    }
  }
}
