import { Component ,OnInit} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {StammMessstellenComponent} from './stamm-messstellen/stamm-messstellen.component';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
//import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';

@Component({
  selector: 'app-stammdaten',
  templateUrl: './stammdaten.component.html',
  styleUrls: ['./stammdaten.component.css']
})
export class StammdatenComponent implements OnInit{

  
  constructor(
    private stammdatenService:StammdatenService,private stammMessstellenComponent:StammMessstellenComponent
  ){}
   public messstellenStam1:MessstellenStam[]=[];//TaxaMP
  public MessstellenAnzeige:boolean=false;
  
  async ngOnInit(){

   
    

    await  this.stammdatenService.start(true);
    this.MessstellenAnzeige=true;
    //this.messstellenStam.push=this.stammdatenService.messstellenarray;



    await Promise.all(
      this.stammdatenService.messstellenarray.map(async (f) => {
      
          //if ((f.Jahr>=this.min && f.Jahr<=this.max)){
         console.log(f.id_mst);
            this.messstellenStam1.push(f);
            this.stammMessstellenComponent.dataSource.push(f);
          //}
          
      })  ) 
  }


 async  seeMst(){
  await  this.stammdatenService.start(true);
    this.MessstellenAnzeige=true;
    console.log (this.stammdatenService.messstellenarray)
    this.messstellenStam1=this.stammdatenService.messstellenarray;
   

  }

  async fgwMst(){
   await this.stammdatenService.start(false);
   console.log (this.stammdatenService.messstellenarray)
   this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.MessstellenAnzeige=true;
  }
}
