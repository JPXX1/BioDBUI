import {Component, Input,Output, EventEmitter,ViewChild} from '@angular/core';
import { Sort} from '@angular/material/sort';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
import {EditStammdatenMstComponent} from '../edit-stammdaten-mst/edit-stammdaten-mst.component';
import {ArchivStammdatenComponent} from '../archiv-stammdaten/archiv-stammdaten.component';
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
  
  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','melde_mst_str','repraesent','updated_at','actions'];
  dataSource = this.messstellenStam;
 

  constructor( public dialog: MatDialog,private stammdatenService:StammdatenService) {
   
  }  

  sortData(sort:Sort){

    this.sortData1.emit(sort);

  }

     
 
   
 
 

  async edit(person: MessstellenStam) {

    await this.stammdatenService.holeSelectDataWK();

  //console.log(this.stammdatenService.wk)
  let wk=this.stammdatenService.wk;

 
this.arraybuendel=({mststam:person,wkstam:wk,melde:this.stammdatenService.meldemst});



    // person.wknamen=(this.stammdatenService.wk);
    const dialogRef = this.dialog.open(EditStammdatenMstComponent, {
      width: '800px',
      data: this.arraybuendel
    });
 
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.newData.emit(result);

       
    }});
  }
  

async showArchiv(person: MessstellenStam){



 await this.stammdatenService.holeArchiv(person.id_mst);
 this.archivMst= this.stammdatenService.archivMst;
  console.log(this.archivMst);

  const dialogRef = this.dialog.open(ArchivStammdatenComponent, {
    width: '1200px',
    data: this.archivMst
  });

}

 }
