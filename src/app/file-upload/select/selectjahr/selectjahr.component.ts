import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-selectjahr',
  templateUrl: './selectjahr.component.html',
  styleUrls: ['./selectjahr.component.css']
})

export class SelectjahrComponent {
  @Input()  Jahr:jahr[]=[];	


  selectedCar = this.Jahr[0].Jahr;

  selectCar(event: Event) {
    this.selectedCar = (event.target as HTMLSelectElement).value;
  }
}
interface jahr{
  Jahr: string;
}