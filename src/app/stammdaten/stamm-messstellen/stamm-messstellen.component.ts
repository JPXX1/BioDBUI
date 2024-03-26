import {Component, Input} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {EditStammdatenMstComponent} from '../edit-stammdaten-mst/edit-stammdaten-mst.component';
import { MatDialog } from '@angular/material/dialog';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';

// ];
@Component({
  selector: 'app-stamm-messstellen',
  templateUrl: './stamm-messstellen.component.html',
  styleUrls: ['./stamm-messstellen.component.css']
})

export class StammMessstellenComponent {
  @Input()  messstellenStam: MessstellenStam[] = []; 
arraybuendel:ArraybuendelSel;
  
  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','actions'];
  dataSource = this.messstellenStam;
 

  constructor( public dialog: MatDialog,private stammdatenService:StammdatenService) {
   
  }  

     
      
     
  delete(person: MessstellenStam)
 {}
   
 


  async edit(person: MessstellenStam) {

    await this.stammdatenService.holeSelectDataWK();

  console.log(this.stammdatenService.wk)
  let wk=this.stammdatenService.wk


this.arraybuendel=({mststam:person,wkstam:wk});



    // person.wknamen=(this.stammdatenService.wk);
    const dialogRef = this.dialog.open(EditStammdatenMstComponent, {
      width: '500px',
      data: this.arraybuendel
    });
    // const dialogRef = this.dialog.open(EditStammdatenMstComponent, {
    //   width: '400px',
    //   data: this.arraybuendel
    // });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       // this.personsService.edit(result);
      }
    });
  }
  
  
 

 
 }
