import { Component ,OnInit,ViewChild} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {StammMessstellenComponent} from './stamm-messstellen/stamm-messstellen.component';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MatSort,Sort} from '@angular/material/sort';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
//import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';

@Component({
  selector: 'app-stammdaten',
  templateUrl: './stammdaten.component.html',
  styleUrls: ['./stammdaten.component.css']
})
export class StammdatenComponent implements OnInit{
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private stammdatenService:StammdatenService,private stammMessstellenComponent:StammMessstellenComponent
  ){this.sortedData = this.messstellenStam1.slice();}
   public messstellenStam1:MessstellenStam[]=[];//TaxaMP
  public MessstellenAnzeige:boolean=false;
  sortedData:MessstellenStam[]=[];


  sortData(sort: Sort) {
    const data = this.messstellenStam1.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.messstellenStam1=[];
    this.messstellenStam1 = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id_mst':
          return compare(a.id_mst, b.id_mst, isAsc);
        case 'namemst':
          return compare(a.namemst, b.namemst, isAsc);
        case 'ortslage':
          return compare(a.ortslage, b.ortslage, isAsc);
        case 'wk_name':
          return compare(a.wk_name, b.wk_name, isAsc);
        case 'gewaessername':
          return compare(a.gewaessername, b.gewaessername, isAsc);
        default:
          return 0;
      }
    });



}
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



handleData(result:MessstellenStam){


  // let messstellenStam2: MessstellenStam[] = this.messstellenStam1; 
     
    

      let messstellenStam2: MessstellenStam[] = this.messstellenStam1; 
        for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
          if (messstellenStam2[i].id_mst===result.id_mst)
        {
         let temp: MessstellenStam=messstellenStam2[i];
        let a=messstellenStam2.indexOf(temp);
        console.log(this.messstellenStam1.length);
        messstellenStam2.splice(a, 1);//löscht vorhandenen DS
        console.log(this.messstellenStam1.length);
        
       console.log(result);//this.personsService.edit(result);
       console.log(messstellenStam2.length);
       this.messstellenStam1= [];//
      // this.messstellenStam1=messstellenStam2;
       this.messstellenStam1.push(result);
      //  break;
      }else{ this.messstellenStam1.push(messstellenStam2[i]);}}
}

applyFilterMessstellen(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;

  let messstellenStam2: MessstellenStam[] = this.stammdatenService.messstellenarray;


  this.messstellenStam1= [];
  for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
    if (messstellenStam2[i].namemst.toLocaleLowerCase().includes(filterValue.trim().toLowerCase()) || 
      messstellenStam2[i].gewaessername.toLocaleLowerCase().includes(filterValue.trim().toLowerCase()) || 
    messstellenStam2[i].ortslage.toLocaleLowerCase().includes(filterValue.trim().toLowerCase()) ||
    messstellenStam2[i].wk_name.toLocaleLowerCase().includes(filterValue.trim().toLowerCase())
    ){
      this.messstellenStam1.push(messstellenStam2[i]);

    }}
  



  
}}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}