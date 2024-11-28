import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/shared/interfaces/messstellen-stam';
import {ArraybuendelMstaendern} from 'src/app/shared/interfaces/arraybuendel-mstaendern';
import { MeldeMst } from 'src/app/shared/interfaces/melde-mst';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-messstelle-aendern',
  templateUrl: './messstelle-aendern.component.html',
  styleUrls: ['./messstelle-aendern.component.css']
})
/**
 * Komponente zum Ändern eines Messpunkts (Messstelle).
 * 
 * Diese Komponente bietet ein Formular zum Ändern der Details eines Messpunkts.
 * Sie verwendet die reaktiven Formulare von Angular und den Material-Dialog für die Benutzeroberfläche.
 * 
 * @class
 * @name MessstelleAendernComponent
 * 
 * @property {string} Mst_name - Der Name des Messpunkts.
 * @property {any} wk - Platzhalter für Wasserkörperdaten.
 * @property {FormGroup} formInstance - Die Instanz des reaktiven Formulars für die Komponente.
 * @property {string} MeldeMst - Platzhalter für den meldenden Messpunkt.
 * @property {WasserkoerperSelect[]} dropdownList - Liste der Wasserkörper für das Dropdown-Menü.
 * @property {MeldeMst[]} dropdownMeldeMst - Liste der meldenden Messpunkte für das Dropdown-Menü.
 * @property {IDropdownSettings} dropdownSettings - Einstellungen für das Wasserkörper-Dropdown-Menü.
 * @property {IDropdownSettings} dropdownMeldeSettings - Einstellungen für das meldende Messpunkt-Dropdown-Menü.
 * 
 * @constructor
 * @param {MatDialogRef<MessstelleAendernComponent>} dialogRef - Referenz auf den geöffneten Dialog.
 * @param {ArraybuendelMstaendern} data - An den Dialog übergebene Daten.
 * @param {FormBuilder} fb - FormBuilder-Instanz zum Erstellen des Formulars.
 * 
 * @method onItemSelectMeldemst - Behandelt die Auswahl eines Elements im meldenden Messpunkt-Dropdown-Menü.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method save - Speichert die Formulardaten und schließt den Dialog.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class MessstelleAendernComponent {

  Mst_name:string;
  
  wk:any;
  formInstance: FormGroup;
  
  MeldeMst:string;
  dropdownList:WasserkoerperSelect[]=[];
  dropdownMeldeMst:MeldeMst[]=[]
  //selectedItems:WasserkoerperSelect[]=[];
  dropdownSettings:IDropdownSettings = {};
  dropdownMeldeSettings:IDropdownSettings = {};
 
  // wk:any=[];
//  constructor(private formBuilder: FormBuilder) {}^
  constructor(public dialogRef: MatDialogRef<MessstelleAendernComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArraybuendelMstaendern,private fb: FormBuilder) {

      

      this.formInstance = this.fb.group({
        id_mst: ['', Validators.required],
        namemst: ['', Validators.required],

      
       
      });

   


    

    this.Mst_name="Messstelle '" + this.data.namemst+ "' ändern.";
this.dropdownMeldeSettings={
  singleSelection: true,
  idField: 'id_mst',
  textField: 'namemst',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 20,
  allowSearchFilter: true,


}
for (let a=0,ls=this.data.mststam.length; a < ls; a += 1){
let temp:MessstellenStam={} as MessstellenStam;

temp.id_mst=this.data.mststam[a].id_mst;
temp.namemst=this.data.mststam[a].namemst;

  this.dropdownMeldeMst.push(temp);
}

     
  
 }

/**
 * Behandelt die Auswahl eines Elements aus der Liste und aktualisiert die Formularinstanz mit den Details des ausgewählten Elements.
 * 
 * @param item - Das ausgewählte Element, das die Eigenschaften `id_mst` und `namemst` enthält.
 * 
 * Aktualisiert die Formularfelder:
 * - `id_mst` mit dem `id_mst`-Wert des ausgewählten Elements.
 * - `namemst` mit dem `namemst`-Wert des ausgewählten Elements.
 * 
 * Protokolliert das ausgewählte Element und den aktuellen Wert des `namemst`-Formularfelds in der Konsole.
 */
onItemSelectMeldemst(item: any) {
  console.log(item);
  
  this.formInstance.get('id_mst').setValue(item.id_mst);
    console.log(this.formInstance.get('namemst').value)
  this.formInstance.get('namemst').setValue(item.namemst);  

}


/**
 * Speichert die aktuellen Formulardaten und schließt den Dialog.
 *
 * Diese Methode ruft den aktuellen Wert der Formularinstanz ab und schließt den Dialog,
 * wobei die Formulardaten als Parameter übergeben werden.
 *
 * @returns {void}
 */
save(): void {
 
//  console.log(this.formInstance.value)
 this.dialogRef.close( this.formInstance.value);
}
}

                    
/**
 * Schnittstelle, die eine Auswahl eines Wasserkörpers (Wasserbody) darstellt.
 */

interface WasserkoerperSelect {

  id:number;
  wk_name: string;}