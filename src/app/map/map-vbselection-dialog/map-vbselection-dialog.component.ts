import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {VerbreitungartenService} from 'src/app/shared/services/verbreitungarten.service';
@Component({
  selector: 'app-map-vbselection-dialog',
  templateUrl: './map-vbselection-dialog.component.html',
  styleUrls: ['./map-vbselection-dialog.component.css']
})
/**
 * Die `MapVBSelectionDialogComponent` Klasse stellt eine Dialogkomponente zur Auswahl von VB-Komponenten dar.
 * Sie bietet Funktionen zum Verarbeiten von Auswahländerungen der Komponenten, Anwenden der aktuellen Auswahl,
 * Aktualisieren der Einstellungen und Schließen des Dialogs.
 * 
 * @class
 * @property {number} maxstart - Das aktuelle Jahr.
 * @property {number} min - Das Mindestjahr, initialisiert auf 2016.
 * @property {number} max - Das Höchstjahr, initialisiert auf das aktuelle Jahr.
 * @property {number} id_komponente - Die ID der ausgewählten Komponente.
 * @property {string[]} selectedTaxonIds - Das Array der ausgewählten Taxon-IDs.
 * @property {any[]} dbKomponenten - Das Array der Datenbankkomponenten.
 * @property {string[]} filteredTaxons - Das Array der gefilterten Taxons basierend auf der ausgewählten Komponente.
 * 
 * @constructor
 * @param {MatDialogRef<MapVBSelectionDialogComponent>} dialogRef - Referenz auf den Dialog.
 * @param {VerbreitungartenService} verbreitungartenService - Service zur Handhabung von Verbreitungarten-Operationen.
 * @param {any} data - An den Dialog übergebene Daten.
 * 
 * @method onKomponenteSelectionChange
 * @description Verarbeitet die Auswahländerung einer Komponente und aktualisiert die gefilterten Taxons basierend auf der ausgewählten Komponente.
 * @param {number} id_komponente - Die ID der ausgewählten Komponente.
 * @returns {void}
 * 
 * @method applySelection
 * @description Wendet die aktuelle Auswahl an und schließt den Dialog mit den ausgewählten Daten.
 * @returns {void}
 * 
 * @method updateSetting
 * @description Aktualisiert die Einstellungen für die Komponente.
 * @param {number} min - Der zu setzende Mindestwert.
 * @param {number} max - Der zu setzende Höchstwert.
 * @returns {void}
 * 
 * @method closeDialog
 * @description Schließt den Dialog ohne Rückgabe von Daten.
 * @returns {void}
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class MapVBSelectionDialogComponent {


  maxstart=new Date().getFullYear();
  min:number=2016;
  max:number=this.maxstart; 
  id_komponente:number=0;
    
  selectedTaxonIds: string [] = [];//: { id_komponente: number, taxon: string }[] = [];
    dbKomponenten = [];
    filteredTaxons: string[] = [];
  
    constructor(
      public dialogRef: MatDialogRef<MapVBSelectionDialogComponent>,private verbreitungartenService:VerbreitungartenService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.id_komponente=data.idkomp;
      this.dbKomponenten = data.dbKomponenten;
      this.onKomponenteSelectionChange(data.idkomp);
      // this.filteredTaxons = data.filteredTaxons;
    }
  
    /**
     * Behandelt die Auswahländerung einer Komponente.
     * Aktualisiert die gefilterten Taxons basierend auf der ausgewählten Komponente.
     *
     * @param {number} id_komponente - Die ID der ausgewählten Komponente.
     * @returns {void}
     */
    onKomponenteSelectionChange(id_komponente:number) {
      // Aktualisiere die gefilterten Taxons basierend auf der Auswahl
      this.id_komponente=id_komponente;
      this.verbreitungartenService.callArten(this.min,this.max,id_komponente);
      this.filteredTaxons = this.verbreitungartenService.dbArtenListe; 
    //console.log(this.filteredTaxons);
    }
  
    /**
     * Wendet die aktuelle Auswahl an und schließt den Dialog mit den ausgewählten Daten.
     * 
     * Die Methode protokolliert die ausgewählten Taxon-IDs in der Konsole und schließt dann den Dialog,
     * wobei ein Objekt mit den folgenden Eigenschaften übergeben wird:
     * - `idkomp`: Die ID der Komponente.
     * - `taxon`: Die ausgewählten Taxon-IDs.
     * - `selectedTaxonMst`: Die Artenliste vom VerbreitungartenService.
     * - `min`: Der Mindestwert.
     * - `max`: Der Höchstwert.
     */
    applySelection() {
      console.log(this.selectedTaxonIds);
      this.dialogRef.close({
        idkomp: this.id_komponente,
        taxon:this.selectedTaxonIds,
        selectedTaxonMst: this.verbreitungartenService.dbArten,
        min:this.min,
        max:this.max
      });
    }
    /**
     * Aktualisiert die Einstellungen für die Komponente.
     * 
     * @param min - Der Mindestwert, der gesetzt werden soll.
     * @param max - Der Höchstwert, der gesetzt werden soll.
     * 
     * Diese Methode aktualisiert die `min` und `max` Eigenschaften der Komponente,
     * ruft die `callArten` Methode des `verbreitungartenService` mit den
     * angegebenen `min` und `max` Werten und der `id_komponente` der Komponente auf,
     * und aktualisiert die `filteredTaxons` Eigenschaft mit der `dbArtenListe` vom
     * `verbreitungartenService`.
     */
    updateSetting(min:number,max:number) {
      this.min = min;
      this.max=max;
      this.verbreitungartenService.callArten(min,max,this.id_komponente);
      this.filteredTaxons = this.verbreitungartenService.dbArtenListe;
     
    }
    /**
     * Schließt den Dialog, ohne Daten zurückzugeben.
     * 
     * Diese Methode verwendet die `dialogRef.close()` Funktion, um den Dialog zu schließen.
     * Es werden keine Daten an den Aufrufer zurückgegeben.
     */
    closeDialog(): void {
      this.dialogRef.close(
        

      ); // Schließt das Dialog ohne Daten zurückzugeben
    }
  }
  
