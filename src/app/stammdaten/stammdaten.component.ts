import { Component ,OnInit,ViewChild,AfterViewInit,AfterViewChecked} from '@angular/core';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {StammMessstellenComponent} from './stamm-messstellen/stamm-messstellen.component';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {StammWkComponent} from './stamm-wk/stamm-wk.component';
import { MatSort,Sort} from '@angular/material/sort';
import { WasserkoerperStam } from 'src/app/interfaces/wasserkoerper-stam';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/services/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-stammdaten',
  templateUrl: './stammdaten.component.html',
  styleUrls: ['./stammdaten.component.css']
})
export class StammdatenComponent implements OnInit,AfterViewInit,AfterViewChecked{
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatSort) sortWK: MatSort
  @ViewChild(StammMessstellenComponent) stammMessstellenComponent1: StammMessstellenComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private helpService: HelpService,
    // private commentService: CommentService, 
    private snackBar: MatSnackBar,
    private stammdatenService:StammdatenService,
    // private stammMessstellenComponent:StammMessstellenComponent,
    // private stammWkComponent:StammWkComponent
  ){this.sortedData = this.messstellenStam1.slice();this.sortedDataWK = this.wkStam1.slice();}
  TypWrrlAnzeige:boolean=false;
  ProbenehmerAnzeige:boolean=false;
  isHelpActive: boolean = false;
  seefliess:boolean;
   public messstellenStam1:MessstellenStam[]=[];
   public wkStam1:WasserkoerperStam[]=[];
  public MessstellenAnzeige:boolean=false;
  public WKAnzeige:boolean=false;
  public GewaesserAnzeige:boolean=false;
  sortedData:MessstellenStam[]=[];sortedDataWK:WasserkoerperStam[]=[];
  public gewaesserart:string;
  public PPTypAnzeige:boolean=false;
  public DiaTypAnzeige:boolean=false;
  public MpTypAnzeige:boolean=false;
  helpText: string = '';

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
ngAfterViewChecked() {
  this.helpService.registerMouseoverEvents();
}
ngAfterViewInit() {
	
	//	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
		this.helpService.registerMouseoverEvents();}

async new(){

    this.stammdatenService.neueMst(this.seefliess).subscribe({
      next: async (newMessstelle) => {
        this.messstellenStam1 = this.stammdatenService.messstellenarray;
        await this.stammMessstellenComponent1.edit(newMessstelle);
      },
      error: (error) => {
        console.error('Error creating new Messstelle:', error);
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
        }else{
          this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
        } 
      
  }


 async  seeMst(){
  this.seefliess=true;
  this.MpTypAnzeige=false;
  await  this.stammdatenService.start(true,false);
  this.PPTypAnzeige=false;
  this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=true;
    this.WKAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    console.log (this.stammdatenService.messstellenarray)
    this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.ProbenehmerAnzeige=false;

  }
async gewaesser1(){
  this.MpTypAnzeige=false;
  this.DiaTypAnzeige=false;
  this.PPTypAnzeige=false;
  this.MessstellenAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
this.GewaesserAnzeige=true;
this.ProbenehmerAnzeige=false;
}
  async wrrlTyp(){
    this.MpTypAnzeige=false;
    this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
    this.PPTypAnzeige=false;
this.TypWrrlAnzeige=true;
this.ProbenehmerAnzeige=false;
  }
  async Probenehmer(){
    this.ProbenehmerAnzeige=true;
    this.MpTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
    this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=false;
  }
  async mpTyp(){ 
    this.ProbenehmerAnzeige=false;
    this.MpTypAnzeige=true;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=false;
  }
  async diaTyp(){
    this.MpTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=true;
    this.ProbenehmerAnzeige=false;
  }
  async ppTyp(){
    this.MpTypAnzeige=false;
    this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=true;
    this.ProbenehmerAnzeige=false;
  }
  async fgwWk()
 
  {this.DiaTypAnzeige=false;
    this.MpTypAnzeige=false;
    this.PPTypAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    await  this.stammdatenService.startwk(false,false);
  this.MessstellenAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
 // console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
this.gewaesserart="Fließgewässer";
this.ProbenehmerAnzeige=false;}
  
  async seeWk()
  {await  this.stammdatenService.startwk(true,false);
    this.DiaTypAnzeige=false;
    this.MpTypAnzeige=false;
    this.seefliess=true;
  this.MessstellenAnzeige=false;
  this.PPTypAnzeige=false;
  this.GewaesserAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
 // console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
  this.gewaesserart="See";
  this.ProbenehmerAnzeige=false;}



  async fgwMst(){
   await this.stammdatenService.start(false,false);
   this.DiaTypAnzeige=false;
   this.MpTypAnzeige=false;
   this.seefliess=false;
   //console.log (this.stammdatenService.messstellenarray)
   this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.MessstellenAnzeige=true;
    this.PPTypAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    this.WKAnzeige=false;
    this.ProbenehmerAnzeige=false;
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
                  messstellenStam2[i].idgewaesser=result.idgewaesser;
                  messstellenStam2[i].gewaessername=result.gewaessername;
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

  this.messstellenStam1 = [];
  for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
    let messstellenStamTemp: MessstellenStam = messstellenStam2[i];

    // Ensure that the properties are not null or undefined before calling 'includes'
    const namemst = messstellenStamTemp.namemst || ''; // Fallback to empty string if null or undefined
    const gewaessername = messstellenStamTemp.gewaessername || ''; // Fallback to empty string if null or undefined
    const ortslage = messstellenStamTemp.ortslage || ''; // Fallback to empty string if null or undefined

    if (
      namemst.includes(filterValue) ||
      gewaessername.includes(filterValue) ||
      ortslage.includes(filterValue)
    ) {
      this.messstellenStam1.push(messstellenStamTemp);
    }
  }
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