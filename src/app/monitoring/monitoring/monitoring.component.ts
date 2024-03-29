import { Component,OnInit,Renderer2 } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MstUebersicht } from 'src/app/interfaces/mst-uebersicht';
import { StammdatenService } from 'src/app/services/stammdaten.service';



@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{
 
  // public wkUebersicht: WkUebersicht[] = [];//Wasserkoerper
  FilterwkUebersicht: WkUebersicht[] = [];
  public mstMakrophyten:MstMakrophyten[]=[];//TaxaMP
  public mstMZB:MstMakrophyten[]=[];//TaxaMZB
  public mstUebersicht:MstUebersicht[]=[];//MstBewertungKreuztabelle
  public MakrophytenAnzeige:boolean=false;
  public MZBAnzeige:boolean=false;
  public MakrophytenMstAnzeige:boolean=false;
  public UebersichtAnzeigen:boolean=true;
  public displayColumnNames:string[]=[]; 
  public displayedColumns:string[]=[]; 
  public props: any[]=[];
  value = '';valueJahr = '';
  Artvalue = '';
  min:number=2010;
  max:number=2026; 
  constructor(private _renderer2: Renderer2,private Farbebewertg: FarbeBewertungService,private anzeigeBewertungService: AnzeigeBewertungService, private anzeigeBewertungMPService:AnzeigeBewertungMPService,
    private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private stammdatenService:StammdatenService) { 
	}


  async ngOnInit() {
		await this. anzeigeBewertungService.ngOnInit();
    this.FilterwkUebersicht=[];
    this.FilterwkUebersicht=this.anzeigeBewertungService.wkUebersicht;
    this.getButtonAktivUebersicht();
	}
  clearSearchFilter(){
    this.value='';
    this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
    if (this.MakrophytenMstAnzeige===true){
     this.handleMakrophytenMPClick();
    }}
    clearSearchFilterArt(){
      this.Artvalue='';
      this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
      if (this.MakrophytenMstAnzeige===true){
       this.handleMakrophytenMPClick();
      }
      if (this.MZBAnzeige===true){
        
      }
  }
  updateSetting(min:number,max:number,value: string,Artvalue: string) {
    this.min = min;
    this.max=max;
this.onValueChangeFilter(value,Artvalue); 
  }


  
  async onValueChangeFilter(value: string,Artvalue: string) {
    this.value=value;this.Artvalue=Artvalue;
    this.anzeigeBewertungService.filtertxt=value;
    //await this.anzeigeBewertungService.filterdaten;
    
    this.FilterwkUebersicht=[];

    if (!value){
      // this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
      await Promise.all(
        this.anzeigeBewertungService.wkUebersicht.map(async (f) => {
        
            if ((f.Jahr>=this.min && f.Jahr<=this.max)){
           
            this.FilterwkUebersicht.push(f);}
            
        })  )   
    
    }else {
     
      await Promise.all(
        this.anzeigeBewertungService.wkUebersicht.map(async (f) => {
        
            if (f.WKname.includes(value) && (f.Jahr>=this.min && f.Jahr<=this.max)){
           
            this.FilterwkUebersicht.push(f);}
            //else if(f.Jahr===parseInt(value)){this.FilterwkUebersicht.push(f)}
        })  )   
    }
    console.log(this.MakrophytenMstAnzeige);
    if (this.MakrophytenMstAnzeige===true){
      await this.handleMakrophytenMPClick();
      
    }else if (this.MakrophytenAnzeige===true){
      await this.handleMakrophytenClick();
    }
  }
  handleUebersicht(){
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=true;
    this.getButtonAktivUebersicht();
   
  }
  ausblendenUebersicht(){
    this.MakrophytenAnzeige=true;
    this.MakrophytenMstAnzeige=true;
    this.UebersichtAnzeigen=false;
   // this.getButtonAktivUebersicht();
   
  }
  async handleMakrophytenClick(){ //Taxadaten MP
 
  this.MakrophytenAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  await this.anzeigeBewertungMPService.callBwMstMP(1);
  this.anzeigeBewertungMPService.datenUmwandeln(this.value,this.min,this.max);
  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMP();
}
async handleMZBClick(){ //Taxadaten MZB
 
  this.MZBAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  await this.anzeigeBewertungMPService.callBwMstMP(3);
  this.anzeigeBewertungMPService.datenUmwandeln(this.value,this.min,this.max);
  this.mstMZB=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMP();
}
  async handleMakrophytenMPClick(){
   
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=true;
    await this.anzeigenMstUebersichtService.call(this.value,this.min,this.max);
    this.props=[];
    this.props.push(this.anzeigenMstUebersichtService.mstUebersicht) ;
    this.props.push(this.anzeigenMstUebersichtService.displayColumnNames);
    this.props.push(this.anzeigenMstUebersichtService.displayedColumns);
    console.log(this.props);
    this.getButtonAktivColorMP();
  }
  async  buttonstamm(){

 await this.stammdatenService.start(true);
 console.log (this.stammdatenService.mst);

 console.log (this.stammdatenService.messstellenarray);
  }
  getButtonAktivColorMP() {
    const el = document.getElementById('mpButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('uebersichtButton');
    this._renderer2.removeStyle(ee,'background-color');  
   // this._renderer2.setStyle(ee, 'background-color', 'withe'); 
  }
  getButtonAktivUebersicht() {
    const el = document.getElementById('mpButton');
    this._renderer2.removeStyle(el,'background-color');  
    const ee = document.getElementById('uebersichtButton');
    this._renderer2.setStyle(ee, 'background-color', 'rgb(20,220,220)'); 
  }
}
