import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {ArraybuendelMstaendern} from 'src/app/interfaces/arraybuendel-mstaendern';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
// import {StammdatenService} from 'src/app/services/stammdaten.service';

import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-messstelle-aendern',
  templateUrl: './messstelle-aendern.component.html',
  styleUrls: ['./messstelle-aendern.component.css']
})
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
      //  idgewaesser: ['', Validators.required],
      //  gewaessername: ['', Validators.required],
      //  ortslage: ['', Validators.required],
      //  see: ['', Validators.required],
      //  repraesent: ['', Validators.required],
      //  melde_mst: ['', Validators.required],
      //  melde_mst_str: ['', Validators.required],
      //  wrrl_typ: ['', Validators.required],
      //  id_wk: ['', Validators.required],
      //  wk_name: ['', Validators.required],
      //  eu_cd_sm: ['', Validators.required],
      //  dia_typ: ['', Validators.required],
      //  pp_typ: ['', Validators.required],
      //  mp_typ: ['', Validators.required],
      //  hw_etrs: ['', Validators.required],
      //  rw_etrs: ['', Validators.required],
      //  updated_at: ['', Validators.required],
      
       
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


    // this.wk_name1= data.mststam.wk_name;
    // this.wk=data.wkstam;
    // for (let i = 0, l = this.wk.length; i < l; i += 1) {
		// 	let mw: WasserkoerperSelect={} as WasserkoerperSelect;

    //   mw.id=this.wk[i].id;
    //   mw.wk_name=this.wk[i].wk_name;
			
    //   this.dropdownList.push(mw);
			
    // }
     
  
 }

onItemSelectMeldemst(item: any) {
  console.log(item);
  
  this.formInstance.get('id_mst').setValue(item.id_mst);
    console.log(this.formInstance.get('namemst').value)
  this.formInstance.get('namemst').setValue(item.namemst);  

}


save(): void {
 
//  console.log(this.formInstance.value)
 this.dialogRef.close( this.formInstance.value);
}
}

                    
interface WasserkoerperSelect {

  id:number;
  wk_name: string;}