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
          case 'repraesent':
          return compare(a.repraesent, b.repraesent, isAsc);
          case 'updated_at':
            return compare(a.updated_at, b.updated_at, isAsc);
          default:
          
         

        
          return 0;
      }
    });



}
  async ngOnInit(){

   
   


    //await  this.stammdatenService.start(true);
   // this.MessstellenAnzeige=true;
    //this.messstellenStam.push=this.stammdatenService.messstellenarray;



    // await Promise.all(
    //   this.stammdatenService.messstellenarray.map(async (f) => {
      
    //       //if ((f.Jahr>=this.min && f.Jahr<=this.max)){
    //      //console.log(f.id_mst);
    //        // this.messstellenStam1.push(f);
    //       //  this.stammMessstellenComponent.dataSource.push(f);
    //       //}
          
    //   })  ) 
      
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


      let messstellenStam2: MessstellenStam[] = this.messstellenStam1; 
        for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
          if (messstellenStam2[i].id_mst===result.id_mst)
        {
            //archiviere alte Mst-Daten    
          this.stammdatenService.archiviereMstStamm(messstellenStam2[i]);  
         const updated_at= this.formatDate(Date.now());
                  messstellenStam2[i].id_wk=result.id_wk;
                  messstellenStam2[i].wk_name=result.wk_name;
                  messstellenStam2[i].melde_mst=result.melde_mst;
                  messstellenStam2[i].melde_mst_str=result.melde_mst_str;
                  messstellenStam2[i].namemst=result.namemst;
                  messstellenStam2[i].ortslage=result.ortslage;
                  messstellenStam2[i].hw_etrs=result.hw_etrs;
                  messstellenStam2[i].repraesent=result.repraesent;
                  messstellenStam2[i].rw_etrs=result.rw_etrs;
                  messstellenStam2[i].updated_at=updated_at;

                
                  //speichere neue Mst-Daten
                  this.stammdatenService.speichereMst(result); 
                 

      }
      
    }
}


formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      stunden=d.getHours(),
      min=d.getMinutes();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  let datum =   day + "."+month + "."+year+ " "+stunden+":"+min
      return datum;
  //return [year, month, day].join('-');
}

applyFilterMessstellen(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;

  let messstellenStam2: MessstellenStam[] = this.stammdatenService.messstellenarray;


  this.messstellenStam1= [];
  for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
    let messstellenStamTemp:MessstellenStam=messstellenStam2[i];
    if (messstellenStamTemp.ortslage==null) {messstellenStamTemp.ortslage=' '}
    if (messstellenStamTemp.namemst.includes(filterValue) 
    || 
    messstellenStamTemp.gewaessername.includes(filterValue) 
     || messstellenStamTemp.ortslage.includes(filterValue) 
    // || messstellenStam2[i].wk_name.includes(filterValue)
    ){
      this.messstellenStam1.push(messstellenStam2[i]);

    }}

  
}}
function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}