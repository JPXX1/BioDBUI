import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MeldeMst } from 'src/app/interfaces/melde-mst';
import {StammdatenService} from 'src/app/services/stammdaten.service';

import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
import { ArraybuendelWK } from 'src/app/interfaces/arraybuendel-wk';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-stammdaten-wk',
  templateUrl: './edit-stammdaten-wk.component.html',
  styleUrls: ['./edit-stammdaten-wk.component.css']
})
/**
 * Komponente zum Bearbeiten von Wasserkörperdaten (Stammdaten WK).
 * 
 * @class
 * @name EditStammdatenWkComponent
 * 
 * @description
 * Diese Komponente stellt ein Formular zum Bearbeiten von Wasserkörperdaten bereit. Es initialisiert das Formular mit den bereitgestellten Daten und richtet Dropdown-Einstellungen für verschiedene Typen von Wasserkörpern ein. Es behandelt auch die Auswahl von Elementen für verschiedene Dropdowns und aktualisiert entsprechend die Formularwerte.
 * 
 * @property {any} wk - Die Wasserkörperdaten.
 * @property {FormGroup} formInstanceWK - Die Formulargruppe für die Wasserkörperdaten.
 * @property {string} wk_name1 - Der Name des zu bearbeitenden Wasserkörpers.
 * @property {TypWrrl[]} dropdownTypPP - Dropdown-Optionen für den PP-Typ.
 * @property {TypWrrl[]} dropdownTypMP - Dropdown-Optionen für den MP-Typ.
 * @property {TypWrrl[]} dropdownTypDia - Dropdown-Optionen für den Dia-Typ.
 * @property {TypWrrl[]} dropdownTypWRRL - Dropdown-Optionen für den WRRL-Typ.
 * @property {TypWrrl[]} dropdownTypGewaesser - Dropdown-Optionen für den Gewässer-Typ.
 * @property {IDropdownSettings} dropdownSettingsGew - Dropdown-Einstellungen für Gewässer.
 * @property {IDropdownSettings} dropdownSettingsDia - Dropdown-Einstellungen für Dia.
 * @property {IDropdownSettings} dropdownSettingsPP - Dropdown-Einstellungen für PP.
 * @property {IDropdownSettings} dropdownSettingsMP - Dropdown-Einstellungen für MP.
 * @property {IDropdownSettings} dropdownSettingsWRRL - Dropdown-Einstellungen für WRRL.
 * 
 * @constructor
 * @param {MatDialogRef<EditStammdatenWkComponent>} dialogRef - Referenz auf den geöffneten Dialog.
 * @param {ArraybuendelWK} data - Datenbündel mit Wasserkörperdaten und Dropdown-Optionen.
 * @param {FormBuilder} fb - Formular-Builder zum Erstellen der Formulargruppe.
 * 
 * @method onItemSelectGew - Behandelt die Auswahl eines Elements im Gewässer-Dropdown.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method onItemSelectDia - Behandelt die Auswahl eines Elements im Dia-Dropdown.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method onItemSelectMP - Behandelt die Auswahl eines Elements im MP-Dropdown.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method onItemSelectPP - Behandelt die Auswahl eines Elements im PP-Dropdown.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method onItemSelectWrrl - Behandelt die Auswahl eines Elements im WRRL-Dropdown.
 * @param {any} item - Das ausgewählte Element.
 * 
 * @method save - Speichert die Formulardaten und schließt den Dialog.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class EditStammdatenWkComponent {
  wk:any;
  formInstanceWK: FormGroup;
  wk_name1:string;
  
  dropdownTypPP:TypWrrl[]=[];
  dropdownTypMP:TypWrrl[]=[];
  dropdownTypDia:TypWrrl[]=[];
  dropdownTypWRRL:TypWrrl[]=[];
  dropdownTypGewaesser:TypWrrl[]=[];

  //selectedItems:WasserkoerperSelect[]=[];
  dropdownSettingsGew:IDropdownSettings = {};
  dropdownSettingsDia:IDropdownSettings = {};
  dropdownSettingsPP:IDropdownSettings = {};
  dropdownSettingsMP:IDropdownSettings = {};
  dropdownSettingsWRRL:IDropdownSettings = {};

  constructor(public dialogRef: MatDialogRef<EditStammdatenWkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArraybuendelWK,private fb: FormBuilder) {

       this.formInstanceWK = this.fb.group({
       id: ['', Validators.required],
       wk_name: ['', Validators.required],
       see: ['', Validators.required],
       kuenstlich: ['', Validators.required],
       hmwb: ['', Validators.required],
       bericht_eu: ['', Validators.required],
       kuerzel: ['', Validators.required],
       id_gewaesser: ['', Validators.required],
       eu_cd_wb: ['', Validators.required],
       land: ['', Validators.required],
       wrrl_typ: ['', Validators.required],
       dia_typ: ['', Validators.required],
      pp_typ: ['', Validators.required],
      mp_typ: ['', Validators.required],
      pp_typ_str: ['', Validators.required],
      dia_typ_str: ['', Validators.required],
      mp_typ_str: ['', Validators.required],
      wrrl_typ_str: ['', Validators.required],
      gewaessername: ['', Validators.required],
      updated_at: ['', Validators.required],
       
      });

    this.formInstanceWK.setValue(data.wkstam);
    this.dropdownSettingsGew = {
      singleSelection: true,
      idField: 'id',
      textField: 'typ',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true,
     
    };
this.wk_name1="Wasserkörper '" +data.wkstam.wk_name+ "' (Nr. "+data.wkstam.id+ ") bearbeiten.";
    this.dropdownSettingsDia =  this.dropdownSettingsGew;
    this.dropdownSettingsPP=this.dropdownSettingsDia;
    this.dropdownSettingsMP=this.dropdownSettingsDia;
    this.dropdownSettingsWRRL=this.dropdownSettingsDia;
	
      this.dropdownTypGewaesser=data.gewaesser;
			this.dropdownTypDia=data.diatyp;
      this.dropdownTypMP=data.mptyp;
      this.dropdownTypPP=data.pptyp;
      this.dropdownTypWRRL=data.wrrltyp;
    
     
  
 }
 onItemSelectGew(item: any){
  console.log(item);
  this.formInstanceWK.get('id_gewaesser').setValue(item.id);
  this.formInstanceWK.get('gewaessername').setValue(item.typ);
 }
 onItemSelectDia(item: any){
  console.log(item);
  this.formInstanceWK.get('dia_typ').setValue(item.id);
  this.formInstanceWK.get('dia_typ_str').setValue(item.typ);
 }
 onItemSelectMP(item: any){
  console.log(item);
  this.formInstanceWK.get('mp_typ').setValue(item.id);
  this.formInstanceWK.get('mp_typ_str').setValue(item.typ);
 }
 onItemSelectPP(item: any){
  console.log(item);
  this.formInstanceWK.get('pp_typ').setValue(item.id);
  this.formInstanceWK.get('pp_typ_str').setValue(item.typ);
 }
 onItemSelectWrrl(item: any){
  console.log(item);
  this.formInstanceWK.get('wrrl_typ').setValue(item.id);
  this.formInstanceWK.get('wrrl_typ_str').setValue(item.typ);
 }

 save(): void {
 
  //  console.log(this.formInstance.value)
   this.dialogRef.close( this.formInstanceWK.value);
  }
  }

