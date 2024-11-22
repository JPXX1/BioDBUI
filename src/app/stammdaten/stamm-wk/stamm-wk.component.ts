import { Component,Input,Output,EventEmitter } from '@angular/core';
import { Sort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
import { ArraybuendelWK } from 'src/app/interfaces/arraybuendel-wk';
import {EditStammdatenWkComponent} from 'src/app/stammdaten/edit-stammdaten-wk/edit-stammdaten-wk.component';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import {ArchivStammdatenWkComponent} from '../archiv-stammdaten-wk/archiv-stammdaten-wk.component';
@Component({
  selector: 'app-stamm-wk',
  templateUrl: './stamm-wk.component.html',
  styleUrls: ['./stamm-wk.component.css']
})
export class StammWkComponent {
  
  @Input()  wasserkoerperStam: WasserkoerperStam[] = []; 
  @Input() gewaesserart:string;
  @Output() newDataWK =new EventEmitter<WasserkoerperStam>();
  @Output() sortDataWK=new EventEmitter<Sort>(); 
  
  constructor( public dialog: MatDialog,private stammdatenService:StammdatenService) {
    
  }  
  displayedColumns: string[] = ['id', 'wk_name', 'kuenstlich','hmwb','bericht_eu','eu_cd_wb','land','wrrl_typ_str','pp_typ_str','dia_typ_str','mp_typ_str','gewaessername','updated_at','actions'];
  dataSource = this.wasserkoerperStam;
  arraybuendelWK:ArraybuendelWK;
  archivWK:WasserkoerperStam[] = [];
  sortData(sort:Sort){

    this.sortDataWK.emit(sort);

  }

  async edit(person: WasserkoerperStam) {

    //await this.stammdatenService.holeSelectDataWK();

    await this.stammdatenService.callDiatyp();
    await this.stammdatenService.callGewaesser();
    await this.stammdatenService.callMptyp();
    await this.stammdatenService.callWrrltyp();
    await this.stammdatenService.callPptyp();
    await this.stammdatenService.wandleGewaesser(false);
    await this.stammdatenService.wandleTypDia(false,person.see);
    await this.stammdatenService.wandleTypMP(false,person.see);
    await this.stammdatenService.wandleTypPP(false,person.see);
    await this.stammdatenService.wandleTypWRRL(person.see);

  //console.log(this.stammdatenService.wk)
  //let wk=this.stammdatenService.wk;
  let diatyp:TypWrrl[]=this.stammdatenService.diatyp;
  let gewaesser:TypWrrl[]=this.stammdatenService.gewaesser;
  let mptyp:TypWrrl[]=this.stammdatenService.mptyp;
  let wrrltyp:TypWrrl[]=this.stammdatenService.wrrltyp;
  let pptyp:TypWrrl[]=this.stammdatenService.pptyp;

 
this.arraybuendelWK=({wkstam:person,diatyp:diatyp,mptyp:mptyp,pptyp:pptyp,wrrltyp:wrrltyp,gewaesser:gewaesser});

const scrollY = window.scrollY || window.pageYOffset;

let mouseY;
const viewportHeight = window.innerHeight;
const topPosition = scrollY + viewportHeight *mouseY;

    // person.wknamen=(this.stammdatenService.wk);
    const dialogRef = this.dialog.open(EditStammdatenWkComponent, {
      width: '70%',
      height:'80%',
      data: this.arraybuendelWK,
      position: {
        top: `${topPosition}px`
      }
    });
 
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


       this.newDataWK.emit(result);

       
    }});
  }

  async showArchiv(person:WasserkoerperStam){
    



      await this.stammdatenService.holeArchivWK(person.id);
      this.archivWK= this.stammdatenService.archivWK;
      //  console.log(this.archivWK);
       const scrollY = window.scrollY || window.pageYOffset;

       let mouseY;
       const viewportHeight = window.innerHeight;
       const topPosition = scrollY + viewportHeight *mouseY;

       const dialogRefWK = this.dialog.open(ArchivStammdatenWkComponent, {
         width: '80%',
         data: this.archivWK,
          position: {
            top: `${topPosition}px`
          }
       });
     
     
  }
}
