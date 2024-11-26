import { Component,Input } from '@angular/core';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';

@Component({
  selector: 'app-einzeldatephytoplankton',
  templateUrl: './einzeldatephytoplankton.component.html',
  styleUrls: ['./einzeldatephytoplankton.component.css']
})
/**
 * Komponente zur Anzeige und Verwaltung von Phytoplankton-Daten.
 * 
 * @class
 * @name EinzeldatephytoplanktonComponent
 * 
 * @constructor
 * @param {FarbeBewertungService} Farbebewertg - Service zur Farbbewertung.
 * 
 * @property {messdata[]} Einzeldat - Eingabedaten-Array für die Komponente.
 * @property {string[]} displayedColumns - Anzuzeigende Spalten in der Tabelle.
 * @property {messdata[]} dataSource - Datenquelle für die Tabelle.
 * 
 * @method getColor
 * @param {any} OZK - Parameter für die Farbbewertung.
 * @returns {string} - Farbwert basierend auf der Bewertung.
 * 
 * @method getColorFehler
 * @param {string} Wert - Parameter für die Fehlerfarbbewertung.
 * @returns {string} - Farbwert basierend auf der Fehlerbewertung.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */


export class EinzeldatephytoplanktonComponent {
  constructor(private Farbebewertg: FarbeBewertungService) { }	
  @Input()  Einzeldat:messdata[]=[];	
  displayedColumns: string[] = ['mst', 'datum', 'taxon', 'parameter', 'wert', 'einheit'];
 
  /**
   * Ruft die Farbe ab, die dem angegebenen OZK-Wert zugeordnet ist.
   *
   * @param OZK - Der OZK-Wert, für den die Farbe abgerufen werden muss.
   * @returns Die Farbe, die dem angegebenen OZK-Wert entspricht.
   */
  getColor(OZK){
    return this.Farbebewertg.getColorRL(OZK);
     
  }

 
  /**
   * Retrieves the color associated with a specific error value.
   *
   * @param Wert - The error value as a string.
   * @returns The color corresponding to the error value.
   */
  getColorFehler(Wert:String){

    return this.Farbebewertg.getColorArtfehltinDB(Wert);
  }
  dataSource=this.Einzeldat; 
}

/**
 * Schnittstelle, die Messdaten darstellt.
 * 
 * @property {number} _Nr - Die Nummer der Messung.
 * @property {string} _Messstelle - Der Messort.
 * @property {string} [_Datum] - Das Datum der Messung (optional).
 * @property {string} [_Parameter] - Der Parameter der Messung (optional).
 * @property {string} _Taxon - Das Taxon der Messung.
 * @property {string} _Form - Die Form der Messung.
 * @property {string} _Messwert - Der gemessene Wert.
 * @property {string} _Einheit - Die Einheit des gemessenen Wertes.
 * @property {string} _cf - Der cf-Wert der Messung.
 */
interface messdata{
  _Nr:number;
  _Messstelle: string;
 
  _Datum?:string;
  
  _Parameter?: string;
  _Taxon: string;
 _Form: string;
  _Messwert: string;
  _Einheit: string;
  _cf: string;

 
 
}
