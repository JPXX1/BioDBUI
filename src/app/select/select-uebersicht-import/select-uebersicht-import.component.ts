import { Component,Input } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
import {CdkListbox, CdkOption} from '@angular/cdk/listbox';

@Component({
  selector: 'app-select-uebersicht-import',
  templateUrl: './select-uebersicht-import.component.html',
  styleUrls: ['./select-uebersicht-import.component.css'],
  standalone: true,
  imports: [CdkListbox, CdkOption],
})
export class SelectUebersichtImportComponent {
  @Input() selectedUebersicht: string;
  uebersicht:any=[];
  constructor(private impPhylibServ: ImpPhylibServ) { }
  onSelect(newValue) {
    console.log(newValue);
    this.selectedUebersicht = newValue;
   
}
  ngOnInit() {
		this.impPhylibServ.getProbenehmer().subscribe(jahre_ => { 
      this.uebersicht  =jahre_;
     
     console.log(this.uebersicht);
    });
   }
}
