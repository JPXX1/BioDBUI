import { Component ,OnInit,ViewChild} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {StammMessstellenComponent} from './stamm-messstellen/stamm-messstellen.component';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {StammWkComponent} from './stamm-wk/stamm-wk.component';
import { MatSort,Sort} from '@angular/material/sort';
import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stammdaten',
  templateUrl: './stammdaten.component.html',
  styleUrls: ['./stammdaten.component.css']
})
export class StammdatenComponent implements OnInit{
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatSort) sortWK: MatSort
  constructor(private router: Router,private authService: AuthService,
    private stammdatenService:StammdatenService,private stammMessstellenComponent:StammMessstellenComponent,private stammWkComponent:StammWkComponent
  ){this.sortedData = this.messstellenStam1.slice();this.sortedDataWK = this.wkStam1.slice();}
  TypWrrlAnzeige:boolean=false;
   public messstellenStam1:MessstellenStam[]=[];
   public wkStam1:WasserkoerperStam[]=[];
  public MessstellenAnzeige:boolean=false;
  public WKAnzeige:boolean=false;
  public GewaesserAnzeige:boolean=false;
  sortedData:MessstellenStam[]=[];sortedDataWK:WasserkoerperStam[]=[];
  public gewaesserart:string;
//sort Mst
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
          return compare(a.id_mst, b.id_mst , isAsc) ;
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
sortDataWk(sortWK: Sort) {
  const data = this.wkStam1.slice();
  if (!sortWK.active || sortWK.direction === '') {
    this.sortedDataWK = data;
    return;
  }
  this.sortedDataWK=[];
  this.sortedDataWK = data.sort((a, b) => {
    const isAsc = sortWK.direction === 'asc';
    switch (sortWK.active) {
      case 'id':
        
        return compare(a.id, b.id, isAsc);
      case 'wk_name':
        return compare(a.wk_name, b.wk_name, isAsc);
      case 'kuenstlich':
        return compare(a.kuenstlich, b.kuenstlich, isAsc);
        case 'hmwb':
        return compare(a.hmwb, b.hmwb, isAsc);
      case 'gewaessername':
        return compare(a.gewaessername, b.gewaessername, isAsc);
        case 'wrrl_typ_str':
        return compare(a.wrrl_typ_str, b.wrrl_typ_str, isAsc);
        case 'updated_at':
          return compare(a.updated_at, b.updated_at, isAsc);
        default:
       return 0;
    }
  });
console.log( this.sortedDataWK);
this.wkStam1=this.sortedDataWK;

}
  async ngOnInit(){

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
        } 
      
  }


 async  seeMst(){
  await  this.stammdatenService.start(true);
    this.MessstellenAnzeige=true;
    this.WKAnzeige=false;
    this.TypWrrlAnzeige=false;
    console.log (this.stammdatenService.messstellenarray)
    this.messstellenStam1=this.stammdatenService.messstellenarray;
   

  }
async gewaesser1(){
  this.MessstellenAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
this.GewaesserAnzeige=true;
}
  async wrrlTyp(){
    this.MessstellenAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=true;
  }
  async fgwWk()
 
  {
    this.TypWrrlAnzeige=false;
    await  this.stammdatenService.startwk(false);
  this.MessstellenAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
  console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
this.gewaesserart="Fließgewässer";}
  
  async seeWk()
  {await  this.stammdatenService.startwk(true);
  this.MessstellenAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
  console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
  this.gewaesserart="See";}



  async fgwMst(){
   await this.stammdatenService.start(false);
   console.log (this.stammdatenService.messstellenarray)
   this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.MessstellenAnzeige=true;
    this.WKAnzeige=false;
  }

  handleDataWK(result:WasserkoerperStam){
    let wkStam2:WasserkoerperStam[]=this.wkStam1;
    for (let i = 0, l = wkStam2.length; i < l; i += 1) {
      if (wkStam2[i].id===result.id)
    {
      //archiviere alte Mst-Daten 
      this.stammdatenService.archiviereWKStamm(wkStam2[i]); 

      const updated_at= this.formatDate(Date.now());

      wkStam2[i].bericht_eu=result.bericht_eu;
      wkStam2[i].dia_typ=result.dia_typ;
      wkStam2[i].mp_typ=result.mp_typ;
      wkStam2[i].pp_typ=result.pp_typ;
      wkStam2[i].wrrl_typ=result.wrrl_typ;
      wkStam2[i].id_gewaesser=result.id_gewaesser;
      wkStam2[i].hmwb=result.hmwb;
      wkStam2[i].kuenstlich=result.kuenstlich;
      wkStam2[i].updated_at=updated_at;
      wkStam2[i].land=result.land;
      wkStam2[i].eu_cd_wb=result.eu_cd_wb;
      wkStam2[i].wk_name=result.wk_name;
      wkStam2[i].dia_typ_str=result.dia_typ_str;
      wkStam2[i].mp_typ_str=result.mp_typ_str;
      wkStam2[i].wrrl_typ_str=result.wrrl_typ_str;
      wkStam2[i].pp_typ_str=result.pp_typ_str;

       //speichere neue Mst-Daten
       this.stammdatenService.speichereWK(result); 
  }
    }}
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
}
applyFilterWK(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;

  let kwStam2: WasserkoerperStam[] = this.stammdatenService.wkarray;


  this.wkStam1= [];
  for (let i = 0, l = kwStam2.length; i < l; i += 1) {
    let wkStamTemp:WasserkoerperStam=kwStam2[i];
    if (wkStamTemp.gewaessername==null) {wkStamTemp.gewaessername=' '}
    if (wkStamTemp.wk_name.includes(filterValue) 
    || 
    wkStamTemp.gewaessername.includes(filterValue) 
     || wkStamTemp.eu_cd_wb.includes(filterValue) 
    // || messstellenStam2[i].wk_name.includes(filterValue)
    ){
      this.wkStam1.push(kwStam2[i]);

    }}
  }
}

function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}