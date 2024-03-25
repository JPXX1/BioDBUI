import { Component,Input } from '@angular/core';

import { HttpClient,HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-select-wasserkoerper',
  templateUrl: './select-wasserkoerper.component.html',
  styleUrls: ['./select-wasserkoerper.component.css']
})
export class SelectWasserkoerperComponent {
  @Input() selectedWK: string;
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
    console.log(newValue.wk_name);
    this.selectedWK = newValue.wk_name;
   
}
}
