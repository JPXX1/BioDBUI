import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {WasserkoerperStam} from 'src/app/interfaces/wasserkoerper-stam';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
@Component({
  selector: 'app-edit-stammdaten-mst',
  templateUrl: './edit-stammdaten-mst.component.html',
  styleUrls: ['./edit-stammdaten-mst.component.css']
})
export class EditStammdatenMstComponent {
  wk:any;
  formInstance: FormGroup;
  wk_name:string;
 
  // wk:any=[];
//  constructor(private formBuilder: FormBuilder) {}^
  constructor(public dialogRef: MatDialogRef<EditStammdatenMstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArraybuendelSel) {





    this.formInstance = new FormGroup({
      "id_mst":  new FormControl('', Validators.required),
      "namemst": new FormControl('', Validators.required),
      "idgewaesser": new FormControl('', Validators.required),
      "gewaessername": new FormControl('', Validators.required),
      "ortslage": new FormControl('', Validators.required),
      "see": new FormControl('', Validators.required),
      "fliess": new FormControl('', Validators.required),
      "natürlich": new FormControl('', Validators.required),
      "wrrl_typ": new FormControl('', Validators.required),
      "mp_typ": new FormControl('', Validators.required),
      "id_wk": new FormControl('', Validators.required),
      "wk_name": new FormControl('', Validators.required),
      "eu_cd_sm": new FormControl('', Validators.required),
      "dia_typ": new FormControl('', Validators.required),
      "pp_typ": new FormControl('', Validators.required),
      "hw_etrs": new FormControl('', Validators.required),
      "rw_etrs": new FormControl('', Validators.required)
      
    });
    
    this.wk_name= data.mststam.wk_name;
     


    this.formInstance.setValue(data.mststam);
     
    this.wk=data.wkstam
       console.log (this.wk);       
                // ngOnInit(): void {
              
                // }
              
                // save(): void {
                //  // this.dialogRef.close(Object.assign(new MessstellenStam(), this.formInstance.value));
                // }
              } 
            
            
//               ngOnInit(): void {
               
//                 this.wk = this.stammdatenService.holeSelectDataWK();
//                 // (async () => {
//                 //   this.wk = await this.stammdatenService.holeSelectDataWK;
                  
//                 // })();
               
//                 console.log( this.wk);
              
                
//             }        
            
 }