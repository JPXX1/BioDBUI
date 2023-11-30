import { Component,Input } from '@angular/core';
import {ImpPhylibServ} from '/home/jens/angular-file-upload/src/app/services/impformenphylib.service';




@Component({
  selector: 'app-selectjahr',
  templateUrl: './selectjahr.component.html',
  styleUrls: ['./selectjahr.component.css'],
 

})

export class SelectjahrComponent {
  @Input() selected: string;
  jahre:any=[];
  
 
  // selectedCar; 
  constructor(private impPhylibServ: ImpPhylibServ) { }
 
//speichert das ausgewählte Jahr
  onChange(newValue) {
    console.log(newValue);
    this.selected = newValue;
   
}
  ngOnInit() {
		this.impPhylibServ.getJahr().subscribe(jahre_ => { 
      this.jahre  =jahre_;
     
     console.log(this.jahre);
    });
   }
  

}


