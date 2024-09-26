import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {VerbreitungartenService} from 'src/app/services/verbreitungarten.service';
@Component({
  selector: 'app-map-vbselection-dialog',
  templateUrl: './map-vbselection-dialog.component.html',
  styleUrls: ['./map-vbselection-dialog.component.css']
})
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
  
    onKomponenteSelectionChange(id_komponente:number) {
      // Aktualisiere die gefilterten Taxons basierend auf der Auswahl
      this.id_komponente=id_komponente;
      this.verbreitungartenService.callArten(this.min,this.max,id_komponente);
      this.filteredTaxons = this.verbreitungartenService.dbArtenListe; 
    //console.log(this.filteredTaxons);
    }
  
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
    updateSetting(min:number,max:number) {
      this.min = min;
      this.max=max;
      this.verbreitungartenService.callArten(min,max,this.id_komponente);
      this.filteredTaxons = this.verbreitungartenService.dbArtenListe;
     
    }
    closeDialog(): void {
      this.dialogRef.close(
        

      ); // Schließt das Dialog ohne Daten zurückzugeben
    }
  }
  
