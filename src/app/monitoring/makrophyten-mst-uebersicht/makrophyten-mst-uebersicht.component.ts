import { Component, Input } from '@angular/core';
import { MstUebersicht } from 'src/app/interfaces/mst-uebersicht';

@Component({
  selector: 'app-makrophyten-mst-uebersicht',
  templateUrl: './makrophyten-mst-uebersicht.component.html',
  styleUrls: ['./makrophyten-mst-uebersicht.component.css']
})
export class MakrophytenMstUebersichtComponent {
  @Input()  mstUebersicht: MstUebersicht[] = [];	


  displayedColumns: string[] = ['wk', 'mst','sp1','sp2',  'sp3','sp4', 'sp5',  'sp6'];
  dataSource=this.mstUebersicht;
}
