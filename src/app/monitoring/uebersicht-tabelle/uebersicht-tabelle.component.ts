import { Component, Input,ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-uebersicht-tabelle',
  templateUrl: './uebersicht-tabelle.component.html',
  styleUrls: ['./uebersicht-tabelle.component.css'],
  encapsulation: ViewEncapsulation.None
})
/**
 * Komponente, die eine Tabellenübersicht im Überwachungsbereich darstellt.
 * 
 * @class
 * @classdesc Diese Komponente zeigt eine Tabelle mit verschiedenen Spalten zur WK-Übersicht an.
 * Sie verwendet MatTableDataSource von Angular Material für die Datenverarbeitung und Sortierung.
 * 
 * @property {MatSort} sort - Referenz auf die MatSort-Direktive zur Sortierung der Tabelle.
 * @property {WkUebersicht[]} wkUebersicht - Eingabeeigenschaft, die ein Array von WK-Übersichtsdaten enthält.
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {MatTableDataSource<WkUebersicht>} dataSource - Datenquelle für die Tabelle.
 * 
 * @constructor
 * @param {AnzeigeBewertungService} anzeigeBewertungService - Service zur Handhabung von Anzeige-Bewertungen.
 * @param {FarbeBewertungService} Farbebewertg - Service zur Handhabung von Farb-Bewertungen.
 * 
 * @method getColor
 * @description Gibt die Farbe zurück, die einem gegebenen OZK-Wert zugeordnet ist.
 * @param {any} OZK - Der OZK-Wert, für den die Farbe ermittelt werden soll.
 * @returns {string} Die Farbe, die dem gegebenen OZK-Wert zugeordnet ist.
 * 
 * @method ngOnInit
 * @description Lifecycle-Hook, der aufgerufen wird, nachdem die daten-gebundenen Eigenschaften initialisiert wurden. Setzt die Sortiereigenschaft der Datenquelle.
 * 
 * @method ngOnChanges
 * @description Lifecycle-Hook, der aufgerufen wird, wenn sich eine daten-gebundene Eigenschaft einer Direktive ändert. Aktualisiert die Datenquelle, wenn sich wkUebersicht ändert.
 * @param {SimpleChanges} changes - Objekt, das die Änderungen der daten-gebundenen Eigenschaften enthält.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class UebersichtTabelleComponent {

constructor(private anzeigeBewertungService:AnzeigeBewertungService,private Farbebewertg: FarbeBewertungService) {  this.dataSource = new MatTableDataSource(this.wkUebersicht); }
  
@ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()  wkUebersicht: WkUebersicht[] = [];	
  
  displayedColumns: string[] = ['WKname', 'Jahr','OKZ_TK_MP','OKZ_TK_Dia',  'OKZ_QK_P','OKZ_QK_MZB', 'OKZ_QK_F',  'OKZ'];
  
  dataSource: MatTableDataSource<WkUebersicht>;
	

  getColor(OZK):string {

    return this.Farbebewertg.getColor(OZK);
   
  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

   /**
     * Reagiert, wenn Angular daten-gebundene Eingabeeigenschaften (neu) setzt.
     * Die Methode erhält ein SimpleChanges-Objekt mit aktuellen und vorherigen Eigenschaftswerten.
     * 
     * @param changes - Ein Objekt mit aktuellen und vorherigen Eigenschaftswerten.
     * 
     * Wenn sich die Eigenschaft 'wkUebersicht' geändert hat, wird überprüft, ob 'wkUebersicht' und 'anzeigeBewertungService.value' beide leer sind.
     * Wenn dies der Fall ist, wird 'anzeigeBewertungService.wkUebersicht' 'wkUebersicht' zugewiesen.
     * Schließlich wird die Datenquelle mit dem neuen 'wkUebersicht'-Wert aktualisiert.
     */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['wkUebersicht']) {

      if (this.wkUebersicht.length=== 0 && this.anzeigeBewertungService.value.length===0){
        this.wkUebersicht=this.anzeigeBewertungService.wkUebersicht;}
      this.dataSource.data = this.wkUebersicht;
    }
  }
}
