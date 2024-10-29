import {Component, Input,Output, EventEmitter} from '@angular/core';
import { Sort} from '@angular/material/sort';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import {EditStammdatenMstComponent} from '../edit-stammdaten-mst/edit-stammdaten-mst.component';
import {ArchivStammdatenComponent} from '../archiv-stammdaten-mst/archiv-stammdaten.component';
import { MatDialog } from '@angular/material/dialog';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';

// ];
@Component({
  selector: 'app-stamm-messstellen',
  templateUrl: './stamm-messstellen.component.html',
  styleUrls: ['./stamm-messstellen.component.css']
})

export class StammMessstellenComponent {
  @Input()  gewaesser: string="Gewässer"; 
  @Input()  messstellenStam: MessstellenStam[] = []; 
  @Output() newData =new EventEmitter<MessstellenStam>();
  @Output() sortData1=new EventEmitter<Sort>(); 

 archivMst:MessstellenStam[] = [];

arraybuendel:ArraybuendelSel;
  
  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','repraesent','updated_at','actions'];
  dataSource = this.messstellenStam;
 

  constructor( public dialog: MatDialog,private stammdatenService:StammdatenService) {
   
  }  

  sortData(sort:Sort){

    this.sortData1.emit(sort);

  }

     
 
   
 
 

  async edit(person: MessstellenStam) {

    await this.stammdatenService.holeSelectDataWK();
    await this.stammdatenService.callGewaesser();
    await this.stammdatenService.wandleGewaesser(false);
  console.log(this.stammdatenService.gewaesser)
  let wk=this.stammdatenService.wk;
  let gewaesser:TypWrrl[]=this.stammdatenService.gewaesser;
 
this.arraybuendel=({mststam:person,wkstam:wk,melde:this.stammdatenService.meldemst,gewaesser:gewaesser});


const scrollY = window.scrollY || window.pageYOffset;

let mouseY= this.stammdatenService.calculateMouseY(scrollY);
const viewportHeight = window.innerHeight;
const topPosition = scrollY + viewportHeight *mouseY; // Position im oberen Drittel des sichtbaren Bereichs
    // person.wknamen=(this.stammdatenService.wk);
    const dialogRef = this.dialog.open(EditStammdatenMstComponent, {
      width: '800px',
      data: this.arraybuendel,
      position: {
        top: `${topPosition}px`
      }
    });
 
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.newData.emit(result);

       
    }});
  }
  

async showArchiv(person: MessstellenStam){



 await this.stammdatenService.holeArchiv(person.id_mst);
 this.archivMst= this.stammdatenService.archivMst;
  // console.log(this.archivMst);
  const scrollY = window.scrollY || window.pageYOffset;

  let mouseY= this.stammdatenService.calculateMouseY(scrollY);
  const viewportHeight = window.innerHeight;
  const topPosition = scrollY + viewportHeight *mouseY;
  const dialogRef = this.dialog.open(ArchivStammdatenComponent, {
    width: '1200px',
    data: this.archivMst,
    position: {
      top: `${topPosition}px`
    } 
  });

}

 }
