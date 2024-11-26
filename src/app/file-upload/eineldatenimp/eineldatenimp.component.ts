import { Component,Input } from '@angular/core';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';

@Component({
  selector: 'app-eineldatenimp',
  templateUrl: './eineldatenimp.component.html',
  styleUrls: ['./eineldatenimp.component.css']
})

/**
 * @class EineldatenimpComponent
 * @classdesc Diese Komponente dient zur Darstellung und Bewertung von Einzeldaten.
 * 
 * @property {messdata[]} Einzeldat - Array von Messdaten, die als Eingabe verwendet werden.
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden.
 * @property {any} dataSource - Datenquelle für die Tabelle, die die Messdaten enthält.
 * 
 * @method getColor - Gibt die Farbe basierend auf der Bewertung zurück.
 * @param {any} OZK - Bewertungsparameter.
 * @returns {string} - Bewertete Farbe.
 * 
 * @method getColorFehler - Gibt die Farbe basierend auf dem Fehlerwert zurück.
 * @param {string} Wert - Fehlerwert.
 * @returns {string} - Bewertete Farbe für den Fehler.
 * 
 * @constructor
 * @param {FarbeBewertungService} Farbebewertg - Service zur Bewertung der Farben.
 */
export class EineldatenimpComponent {


  constructor(private Farbebewertg: FarbeBewertungService) { }	
  @Input()  Einzeldat:messdata[]=[];	
  displayedColumns: string[] = ['mst', 'probe','tiefe', 'taxon', 'form', 'wert', 'einheit','rl'];
 
  /**
   * Ruft die Farbe basierend auf dem angegebenen OZK-Wert ab.
   *
   * @param OZK - Der Eingabewert, der zur Bestimmung der Farbe verwendet wird.
   * @returns Die Farbe, die dem angegebenen OZK-Wert entspricht.
   */
  getColor(OZK){
    return this.Farbebewertg.getColorRL(OZK);
     
  }

 
  /**
   * Ruft die Farbe basierend auf einem spezifischen Fehlerwert ab.
   *
   * @param Wert - Der Fehlerwert als String.
   * @returns Die Farbe, die dem Fehlerwert zugeordnet ist.
   */
  getColorFehler(Wert:String){

    return this.Farbebewertg.getColorArtfehltinDB(Wert);
  }
	dataSource=this.Einzeldat; 
}

/**
 * Schnittstelle, die Messdaten darstellt.
 * 
 * @interface messdata
 * @property {number} _Nr - Die Nummernkennung.
 * @property {string} _Messstelle - Der Messort.
 * @property {string} _Tiefe - Die Messtiefe.
 * @property {string} _Probe - Die Probenkennung.
 * @property {string} _Taxon - Der Taxonname.
 * @property {string} _Form - Die Form des Taxons.
 * @property {string} _Messwert - Der Messwert.
 * @property {string} _Einheit - Die Einheit des Messwerts.
 * @property {string} _cf - Der Vertrauensfaktor.
 * @property {string} MstOK - Der OK-Status der Messstelle.
 * @property {string} OK - Der OK-Status.
 * @property {number} _AnzahlTaxa - Die Anzahl der Taxa.
 * @property {string} _RoteListeD - Der Rote-Liste-Status in Deutschland.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
interface messdata{
  _Nr:number;
  _Messstelle: string;
  _Tiefe:String;
  _Probe: string;
  _Taxon: string;
  _Form: string;
  _Messwert: string;
  _Einheit: string;
  _cf: string;
  MstOK:string;
  OK:string;
  _AnzahlTaxa: number;
  _RoteListeD: string;
}