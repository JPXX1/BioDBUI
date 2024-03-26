import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
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
  dropdownList:WasserkoerperSelect[]=[];
  //selectedItems:WasserkoerperSelect[]=[];
  dropdownSettings:IDropdownSettings = {};
 
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
      fliess: ['', Validators.required],
      natürlich: ['', Validators.required],
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

    // this.formInstance = new FormGroup({
      // "id_mst":  new FormControl('', Validators.required),
      // "namemst": new FormControl('', Validators.required),
      // "idgewaesser": new FormControl('', Validators.required),
      // "gewaessername": new FormControl('', Validators.required),
      // "ortslage": new FormControl('', Validators.required),
      // "see": new FormControl('', Validators.required),
      // "fliess": new FormControl('', Validators.required),
      // "natürlich": new FormControl('', Validators.required),
      // "wrrl_typ": new FormControl('', Validators.required),
      // "mp_typ": new FormControl('', Validators.required),
      // "id_wk": new FormControl('', Validators.required),
      // "wk_name": new FormControl('', Validators.required),
      // "eu_cd_sm": new FormControl('', Validators.required),
      // "dia_typ": new FormControl('', Validators.required),
      // "pp_typ": new FormControl('', Validators.required),
      // "hw_etrs": new FormControl('', Validators.required),
      // "rw_etrs": new FormControl('', Validators.required)
      
    // });

    
    // {} as Uebersicht;
    let mw1: WasserkoerperSelect={} as WasserkoerperSelect;
    mw1.id=data.mststam.id_wk;
    mw1.wk_name=data.mststam.wk_name;
    //this.selectedItems.push(mw1);
    this.wk_name1=mw1.wk_name;

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
}

                // ngOnInit(): void {
              
                // }
              
                // save(): void {
                //  // this.dialogRef.close(Object.assign(new MessstellenStam(), this.formInstance.value));
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