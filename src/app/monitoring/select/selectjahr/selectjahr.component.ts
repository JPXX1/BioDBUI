import { Component,Input,Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-selectjahr',
  templateUrl: './selectjahr.component.html',
  styleUrls: ['./selectjahr.component.css'],
 

})

/**
 * Die SelectjahrComponent ist dafür verantwortlich, dem Benutzer die Auswahl eines Jahres aus einer Dropdown-Liste zu ermöglichen.
 * Sie sendet das ausgewählte Jahr an die übergeordnete Komponente.
 *
 * @example
 * <app-selectjahr [selected]="selectedYear" (jahrSelected)="onYearSelected($event)"></app-selectjahr>
 *
 * @bemerkungen
 * Die Komponente initialisiert die Liste der Jahre von einem Mindestjahr (2005) bis zum aktuellen Jahr.
 * Sie verwendet den ImpPhylibServ-Service, um bei Bedarf zusätzliche Daten abzurufen.
 *
 * @property {string} selected - Das aktuell ausgewählte Jahr.
 * @property {any[]} jahre - Das Array der zur Auswahl stehenden Jahre.
 * @property {number} maxstart - Das maximale Jahr, initialisiert auf das aktuelle Jahr.
 * @property {string} min - Das Mindestjahr als String.
 * @property {EventEmitter<number>} jahrSelected - Event-Emitter, der das ausgewählte Jahr sendet.
 *
 * @method onChange - Verarbeitet das Änderungsereignis, wenn ein neues Jahr ausgewählt wird.
 * @param {string} newValue - Das neu ausgewählte Jahr.
 *
 * @method ngOnInit - Lebenszyklus-Hook, der die Komponente initialisiert.
 *
 * @method generateYearArray - Generiert ein Array von Jahres-Strings von einem gegebenen Mindestjahr bis zu einem maximalen Jahr.
 * @param {number} min - Das Mindestjahr als String.
 * @param {number} max - Das maximale Jahr als Zahl.
 * @returns {string[]} Ein Array von Jahres-Strings vom Mindestjahr bis zum maximalen Jahr.
 */
export class SelectjahrComponent {
  @Input() selected: string;
  jahre: { jahr: string }[] = []; // Array von Objekten mit der Eigenschaft 'jahr'

  maxstart: number = new Date().getFullYear(); // z. B. 2024
  min: number = 2005;  // Startjahr als String
  
  @Output() jahrSelected: EventEmitter<number> = new EventEmitter<number>();
  // selectedCar; 
  constructor() { }
 
//speichert das ausgewählte Jahr
  onChange(newValue) {
    console.log(newValue);
    this.selected = newValue;
    this.jahrSelected.emit(+newValue); //sendet das ausgewählte Jahr an die Elternkomponente
   
}
  ngOnInit() {
	
    this.jahre = this.generateYearArray(this.min, this.maxstart);
    console.log(this.jahre);
 
    // });
   }
  /**
   * Erzeugt ein Array von Jahres-Strings von einem gegebenen Mindestjahr bis zu einem Maximaljahr.
   *
   * @param min - Das Mindestjahr als Zahl.
   * @param max - Das Maximaljahr als Zahl.
   * @returns Ein sortiertes Array von Jahres-Strings vom Mindestjahr bis zum Maximaljahr.
   */
 
  generateYearArray(min: number, max: number): { jahr: string }[] {
    // Erzeuge ein Array von Objekten mit der Eigenschaft 'jahr'
    const yearArray = Array.from({ length: max - min + 1 }, (_, i) => ({ jahr: (min + i).toString() }));

    // Sortiere in absteigender Reihenfolge
    return yearArray.sort((a, b) => parseInt(b.jahr, 10) - parseInt(a.jahr, 10));
  }

  

}


