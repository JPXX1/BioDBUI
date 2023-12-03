import { Component,Input } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';
@Component({
  selector: 'app-select-probenehmer',
  templateUrl: './select-probenehmer.component.html',
  styleUrls: ['./select-probenehmer.component.css']
})
export class SelectProbenehmerComponent {
  @Input() selectedPN: string;
  pn:any=[];
  
 
  // selectedCar; 
  constructor(private impPhylibServ: ImpPhylibServ) { }
 
//speichert das ausgewählte Jahr
  onChange(newValue) {
    console.log(newValue);
    this.selectedPN = newValue;
   
}
  ngOnInit() {
		this.impPhylibServ.getProbenehmer().subscribe(jahre_ => { 
      this.pn  =jahre_;
     
     console.log(this.pn);
    });
   }
}
