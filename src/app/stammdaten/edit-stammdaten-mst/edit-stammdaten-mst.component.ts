import { Component, Inject, Input,EventEmitter,Output } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-stammdaten-mst',
  templateUrl: './edit-stammdaten-mst.component.html',
  styleUrls: ['./edit-stammdaten-mst.component.css']
})
export class EditStammdatenMstComponent {
  @Input() data: ArraybuendelSel; // Empfängt die Daten
  @Output() closeDialog = new EventEmitter<any>(); // Event für das Schließen des Dialogs

  seefliess: boolean;
  wk:any;
  formInstance: FormGroup;
  wk_name1:string;
  MeldeMst:string;
  dropdownList:WasserkoerperSelect[]=[];
  dropdownMeldeMst:MeldeMst[]=[]
  //selectedItems:WasserkoerperSelect[]=[];
  dropdownSettings:IDropdownSettings = {};
  dropdownMeldeSettings:IDropdownSettings = {};
  errorMessage: string | null = null;
  dropdownTypGewaesser:TypWrrl[]=[];
  dropdownSettingsGew:IDropdownSettings = {};
  // Definiere den gültigen Bereich für Rechtswert (rw_etrs) und Hochwert (hw_etrs)
  readonly xmin = 367470; // Untere Grenze für Rechtswert
  readonly xmax = 417907; // Obere Grenze für Rechtswert
  readonly ymin = 5796741; // Untere Grenze für Hochwert
  readonly ymax = 5842261; // Obere Grenze für Hochwert
  
constructor(private fb: FormBuilder) {
  this.formInstance = this.fb.group({
    id_mst: ['', Validators.required],
    namemst: ['', Validators.required],
    idgewaesser: ['', Validators.required],
    gewaessername: ['', Validators.required],
    ortslage: ['', Validators.required],
    see: ['', Validators.required],
    repraesent: ['', Validators.required],
    melde_mst: ['', Validators.required],
    melde_mst_str: ['', Validators.required],
    wrrl_typ: ['', Validators.required],
    id_wk: ['', Validators.required],
    wk_name: ['', Validators.required],
    eu_cd_sm: ['', Validators.required],
    dia_typ: ['', Validators.required],
    pp_typ: ['', Validators.required],
    mp_typ: ['', Validators.required],
    hw_etrs: ['', Validators.required],
    rw_etrs: ['', Validators.required],
    updated_at: ['', Validators.required],
  });
}
ngOnInit(): void {
  this.initializeDropdowns();
}
initializeDropdowns(): void {
  // Daten für Wasserkoerper (dropdownList)
  this.seefliess = this.data.mststam.see;
  this.formInstance.setValue(this.data.mststam);

  this.dropdownList = this.data.wkstam.map((wk) => ({
    id: wk.id,
    wk_name: wk.wk_name
  }));

  // Daten für Typ Gewaesser (dropdownTypGewaesser)
  this.dropdownTypGewaesser = this.data.gewaesser;

  // Daten für Melde Messstellen (dropdownMeldeMst)
  this.dropdownMeldeMst = this.data.melde.map((melde) => ({
    id_mst: melde.id_mst,
    namemst: melde.namemst,
    repraesent: melde.repraesent
  }));

  // Initialisierung für Dropdown-Einstellungen
  this.dropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'wk_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 20,
    allowSearchFilter: true,
  };

  this.dropdownSettingsGew = {
    singleSelection: true,
    idField: 'id',
    textField: 'typ',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 20,
    allowSearchFilter: true,
  };

  this.dropdownMeldeSettings = {
    singleSelection: true,
    idField: 'id_mst',
    textField: 'namemst',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 20,
    allowSearchFilter: true,
  };

  // Initiale Werte setzen
  const initialWk = this.dropdownList.find(wk => wk.id === this.data.mststam.id_wk);
  this.wk_name1 = initialWk ? initialWk.wk_name : '';
  this.MeldeMst = this.data.mststam.melde_mst_str;
}
 onToggleFgwSeeChange(isSelected: boolean) {
  this.seefliess = isSelected; // Speichert den ausgewählten Wert
  this.formInstance.get('see').setValue(isSelected);
}

   // Methode zur Validierung von Rechtswert und Hochwert
   validateCoordinates(): boolean {
    const rw_etrs = this.formInstance.get('rw_etrs').value;
    const hw_etrs = this.formInstance.get('hw_etrs').value;

    if (rw_etrs < this.xmin || rw_etrs > this.xmax) {
      this.errorMessage = `Rechtswert liegt außerhalb des zulässigen Bereichs (${this.xmin}-${this.xmax})`;
      return false;
    }
    if (hw_etrs < this.ymin || hw_etrs > this.ymax) {
      this.errorMessage = `Hochwert liegt außerhalb des zulässigen Bereichs (${this.ymin}-${this.ymax})`;
      return false;
    }

    // Wenn die Werte gültig sind, setze die Fehlermeldung zurück
    this.errorMessage = null;
    return true;
  }
  onItemSelectGew(item: any){
    console.log(item);
    this.formInstance.get('idgewaesser').setValue(item.id);
    this.formInstance.get('gewaessername').setValue(item.typ);
   }
 onItemSelect(item: any) {
  console.log(item);
  
  this.formInstance.get('id_wk').setValue(item.id);
    
  this.formInstance.get('wk_name').setValue(item.wk_name);  

}
onItemSelectMeldemst(item: any) {
  console.log(item);
  
  this.formInstance.get('melde_mst').setValue(item.id_mst);
    console.log(this.formInstance.get('melde_mst').value)
  this.formInstance.get('melde_mst_str').setValue(item.namemst);  

}
cancel(): void {
  // Schließt den Dialog ohne Änderungen zu speichern
  this.closeDialog.emit(null);
}

save(): void {
   // Führe die Validierung der Koordinaten durch
   if (!this.validateCoordinates()) {
    // Verhindere das Speichern, wenn die Koordinaten ungültig sind
    return;
  }
//  console.log(this.formInstance.value)
this.closeDialog.emit(this.formInstance.value);

}
}

                    
interface WasserkoerperSelect {

  id:number;
  wk_name: string;}