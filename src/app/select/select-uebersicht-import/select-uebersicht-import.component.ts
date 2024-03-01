import { Component,Input } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';

@Component({
  selector: 'app-select-uebersicht-import',
  templateUrl: './select-uebersicht-import.component.html',
  styleUrls: ['./select-uebersicht-import.component.css'],
  
 
 
})


export class SelectUebersichtImportComponent {
  // @Input()  selectedUebersicht: string;
  displayedColumns: string[] = ['dateiname', 'importiert','verfahren', 'firma','komponente', 'jahr','anzahlmst','anzahlwerte'];
  uebersicht:any=[];
  constructor(private impPhylibServ: ImpPhylibServ) { }
  onSelect(newValue) {
    console.log(newValue);
    // this.selectedUebersicht = newValue;
   
}
  ngOnInit() {
		this.impPhylibServ.getimpUebersicht().subscribe(jahre_ => { 
      this.uebersicht  =jahre_;
     
     console.log(this.uebersicht);
    });
   }
}
