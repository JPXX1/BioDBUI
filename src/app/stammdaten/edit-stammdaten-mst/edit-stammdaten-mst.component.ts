import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {WasserkoerperStam} from 'src/app/interfaces/wasserkoerper-stam';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-stammdaten-mst',
  templateUrl: './edit-stammdaten-mst.component.html',
  styleUrls: ['./edit-stammdaten-mst.component.css']
})
export class EditStammdatenMstComponent {
  wk:any;
  formInstance: FormGroup;
  wk_name1:string;
  MeldeMst:string;
  dropdownList:WasserkoerperSelect[]=[];
  dropdownMeldeMst:MeldeMst[]=[]
  //selectedItems:WasserkoerperSelect[]=[];
  dropdownSettings:IDropdownSettings = {};
  dropdownMeldeSettings:IDropdownSettings = {};
 
  // wk:any=[];
//  constructor(private formBuilder: FormBuilder) {}^
  constructor(public dialogRef: MatDialogRef<EditStammdatenMstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArraybuendelSel,private fb: FormBuilder) {

      

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
       
      });

   
    let mw1: WasserkoerperSelect={} as WasserkoerperSelect;
    mw1.id=data.mststam.id_wk;
    
    mw1.wk_name=data.mststam.wk_name;
    //this.selectedItems.push(mw1);
    this.wk_name1=mw1.wk_name;
    this.MeldeMst=data.mststam.melde_mst_str;

    
    this.formInstance.setValue(data.mststam);
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'wk_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true,
     
    };

    
this.dropdownMeldeSettings={
  singleSelection: true,
  idField: 'id_mst',
  textField: 'namemst',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 20,
  allowSearchFilter: true,


}
for (let a=0,ls=this.data.melde.length; a < ls; a += 1){
let temp:MeldeMst={} as MeldeMst;

temp.id_mst=this.data.melde[a].id_mst;
temp.namemst=this.data.melde[a].namemst;
temp.repraesent=true;
  this.dropdownMeldeMst.push(temp);
}


    // this.wk_name1= data.mststam.wk_name;
    this.wk=data.wkstam;
    for (let i = 0, l = this.wk.length; i < l; i += 1) {
			let mw: WasserkoerperSelect={} as WasserkoerperSelect;

      mw.id=this.wk[i].id;
      mw.wk_name=this.wk[i].wk_name;
			
      this.dropdownList.push(mw);
			
    }
    // this.formInstance.setValue(data.mststam.wk_name);
     
    
      //  console.log (this.wk);  
       
      //  this.formInstance.get('wk_name').setValue(this.wk_name1);  
  
 }
 onItemSelect(item: any) {
  console.log(item);
}
onSelectAll(items: any) {
  console.log(items);
}

save(): void {
 
//  console.log(this.formInstance.value)
 this.dialogRef.close( this.formInstance.value);
}
}

                // ngOnInit(): void {
              
                // }
              
               
  
              
            
            
//               ngOnInit(): void {
               
//                 this.wk = this.stammdatenService.holeSelectDataWK();
//                 // (async () => {
//                 //   this.wk = await this.stammdatenService.holeSelectDataWK;
                  
//                 // })();
               
//                 console.log( this.wk);
              
                
//                    
interface WasserkoerperSelect {

  id:number;
  wk_name: string;}