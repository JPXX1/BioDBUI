import { Component,Input } from '@angular/core';
import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
import { HttpClient,HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-select-wasserkoerper',
  templateUrl: './select-wasserkoerper.component.html',
  styleUrls: ['./select-wasserkoerper.component.css']
})
export class SelectWasserkoerperComponent {
  @Input() selectedWK: number;
  wk:any=[];
  constructor(private httpClient: HttpClient) { }

  
getWk(){
  return this.httpClient.get('http://localhost:3000/stamWasserkoerper');
      
}

  ngOnInit() {
		
    
    this.getWk().subscribe(jahre_ => { 
      this.wk  =jahre_;
     
     console.log(this.wk);
    });
   }

  onChange(newValue) {
    console.log(newValue);
    this.selectedWK = newValue;
   
}
}
