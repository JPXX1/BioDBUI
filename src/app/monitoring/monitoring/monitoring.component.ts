import { Component,OnInit,Renderer2,ViewChild,AfterViewInit,AfterViewChecked } from '@angular/core';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MstUebersicht } from 'src/app/interfaces/mst-uebersicht';
import { StammdatenService } from 'src/app/services/stammdaten.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/services/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit,AfterViewInit,AfterViewChecked{
 anzeigeTaxadaten:boolean=false;
  isHelpActive: boolean = false;
  FilterwkUebersicht: WkUebersicht[] = [];
  FilterwkUebersichtausMst: WkUebersicht[] = [];
  public mstTaxaMP:MstMakrophyten[]=[];//TaxaMP
  public mstTaxaMZB:MstMakrophyten[]=[];//TaxaMZB
  mstTaxaPh: MstMakrophyten[] = [];//TaxaPhytoplankton
  public mstUebersicht:MstUebersicht[]=[];//MstBewertungKreuztabelle
  public MakrophytenAnzeige:boolean=false;
  public MZBAnzeige:boolean=false;
  PhythoplanktonAnzeige:boolean=false;
  public MakrophytenMstAnzeige:boolean=false;
  public UebersichtAnzeigen:boolean=true;
  public UebersichtWKausMstAnzeigen=false;
  public displayColumnNames:string[]=[]; 
  public displayedColumns:string[]=[]; 
  public FilterAnzeige:boolean=false;
  private komp_id:number=1;
  public props: any[]=[];
  public repreasent:number=2;
 public FilterWKname:string;

 helpText: string = '';
 maxstart=new Date().getFullYear();
  value = '';valueJahr = '';
  Artvalue = '';
  min:number=this.maxstart-5;
  max:number=this.maxstart; 
  maxold:number=this.maxstart;
  minold:number=this.maxstart-10;
  constructor(private helpService: HelpService,private commentService: CommentService, private snackBar: MatSnackBar,private router: Router,private authService: AuthService,private _renderer2: Renderer2,private Farbebewertg: FarbeBewertungService,private anzeigeBewertungService: AnzeigeBewertungService, private anzeigeBewertungMPService:AnzeigeBewertungMPService,
    private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private stammdatenService:StammdatenService) { 
	}
  ngAfterViewInit() {
	
    //	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
      this.helpService.registerMouseoverEvents();}
      ngAfterViewChecked() {
        this.helpService.registerMouseoverEvents();
      }


  toggleHelp() {
    this.isHelpActive = !this.isHelpActive;
  }
  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
        } else{
		await this.anzeigeBewertungService.ngOnInit();
    this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
    this.FilterwkUebersicht=[];
    
    // console.log(this.FilterwkUebersichtausMst);
    this.FilterwkUebersicht=this.anzeigeBewertungService.wkUebersicht;
    // /console.log(this.FilterwkUebersicht);
    this.getButtonAktivUebersicht();
    this.FilterWKnameSetzenWK("wk");
    this.onValueChangeFilter( '','');
    // Hier () verwenden, um die Methode auszuführen
    
    
	}}
  clearSearchFilter(){
    this.value='';
    if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenTaxaClick();
      
     }
     else if (this.MZBAnzeige===true && this.MakrophytenAnzeige===false && this.UebersichtAnzeigen===false) {
      this.handleMZBTaxaClick();} 
     else if (this.UebersichtAnzeigen===true)



    
    {
      if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
      
      this.onValueChangeFilter('','');
      //this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
    }else if (this.UebersichtWKausMstAnzeigen===true){
      if (this.anzeigeBewertungService.getBwWKUebersichtAusMst.length=== 0){this.handleUebersichtWKausMst();}

    }
    }




    clearSearchFilterArt(){
      this.Artvalue='';this.anzeigenMstUebersichtService.Artvalue=''
      
      //Taxadaten
if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenTaxaClick();
      
     }
     else {
      this.handleMZBTaxaClick();
     }
  }


   
      
  
  
  
  
  

  FilterWKnameSetzenWK(wkmst:string){

    if (wkmst==="wk")
   { this.FilterWKname="Filter Wasserkörper"}
    else if (wkmst==="mst")
    {this.FilterWKname="Filter Messstellen"}
    else if (wkmst==="wk1"){this.FilterWKname="Filter Wasserkörper "}
  }
  async mstalleauswaehlen(value:number,filter:string,artfilter:string){
    this.repreasent=value;
   await this.onValueChangeFilter(filter,artfilter);
    
     }

  //ausGUI Änderung des Datums aus GUI; Alternativ Abruf dieser Funktion bei Auswahl Taxadaten aus GUI
   updateSetting(min:number,max:number,value: string,Artvalue: string,ausGUI:boolean) {
  //  console.log(this.min,' max',this.max);
  //  console.log(this.minold,' oldmax',this.maxold);
    if (this.PhythoplanktonAnzeige===true || this.MZBAnzeige===true ){
    if (min+5<max&&max===this.maxold)
     if (ausGUI===false) 
      {min=max-5}else
    {max=max-5;}
    else 
    if (min===this.minold&&max-5>min)
      if (ausGUI===false) 
        {min=min+5;}
  else {min=max-5}
    this.min = min;
    this.max=max;
    if (ausGUI===true){
      
      this.filtertaxadaten(this.komp_id);
      // 
      }}else {this.onValueChangeFilter(value,Artvalue); }
    this.minold=min;
    this.maxold=max;
  }

filtertaxadaten(komp:number){
switch(komp){
  case 1:
    this.mstTaxaMP= this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max);
    
        break;
      case 2:
        //this.Taxa_Dia=formen_;
        break;
      case 3:
        this.mstTaxaMZB= this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max);
 
        break;
      case 5:
        this.mstTaxaPh= this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max);
 
        break;
 
 
}}
  
  async onValueChangeFilter(value: string, Artvalue: string) {
    this.anzeigeBewertungService.value=value;
    this.anzeigenMstUebersichtService.value=value;
    this.anzeigenMstUebersichtService.Artvalue=Artvalue;
    this.value = value; this.Artvalue = Artvalue;
    this.anzeigeBewertungService.filtertxt = value;
    //await this.anzeigeBewertungService.filterdaten;
    this.FilterwkUebersichtausMst = [];
    this.FilterwkUebersicht = [];
if (!value && this.FilterWKname==="Filter Wasserkörper "){
  await Promise.all(
    this.anzeigeBewertungService.wkUebersichtaMst.map(async (f) => {

      if ((f.Jahr >= this.min && f.Jahr <= this.max)) {

        this.FilterwkUebersichtausMst.push(f);
      }

    }))
}else if (this.FilterWKname==="Filter Wasserkörper ") {

  await Promise.all(
    this.anzeigeBewertungService.wkUebersichtaMst.map(async (f) => {

      if (f.WKname.includes(value) && (f.Jahr >= this.min && f.Jahr <= this.max)) {

        this.FilterwkUebersichtausMst.push(f);
      }
      //else if(f.Jahr===parseInt(value)){this.FilterwkUebersicht.push(f)}
    }))
}

else if (!value && this.FilterWKname==="Filter Wasserkörper") {
      // this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
      await Promise.all(
        this.anzeigeBewertungService.wkUebersicht.map(async (f) => {

          if ((f.Jahr >= this.min && f.Jahr <= this.max)) {

            this.FilterwkUebersicht.push(f);
          }

        }))
        
      if (this.MakrophytenMstAnzeige === true) {
        await this.handleMakrophytenMPClick(this.komp_id);

      } else if (this.MakrophytenAnzeige === true) {
        await this.handleMakrophytenTaxaClick();
      }
    } else if (this.FilterWKname==="Filter Wasserkörper") {

      await Promise.all(
        this.anzeigeBewertungService.wkUebersicht.map(async (f) => {

          if (f.WKname.includes(value) && (f.Jahr >= this.min && f.Jahr <= this.max)) {

            this.FilterwkUebersicht.push(f);
          }
          //else if(f.Jahr===parseInt(value)){this.FilterwkUebersicht.push(f)}
        }))
      if (this.MakrophytenMstAnzeige === true) {
        await this.handleMakrophytenMPClick(this.komp_id);

      } else if (this.MakrophytenAnzeige === true) {
        await this.handleMakrophytenTaxaClick();
      }
    }else if (this.FilterWKname==="Filter Messstellen") {

     
        
      if (this.MakrophytenMstAnzeige === true) {
        await this.handleMakrophytenMPClick(this.komp_id);

      } else if (this.anzeigeTaxadaten === true) {
        await this.filtertaxadaten(this.komp_id);
      
      }
    }

    //console.log(this.MakrophytenMstAnzeige);

  }
  handleUebersichtWK(){
    this.FilterWKnameSetzenWK("wk")
    this.anzeigeTaxadaten=false;
    // if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
    this.MZBAnzeige=false;
    this.PhythoplanktonAnzeige=false;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=true;
    this.UebersichtWKausMstAnzeigen=false;
    this.FilterAnzeige=false;
    this.getButtonAktivUebersicht();
   
  }
  async handleUebersichtWKausMst(){
    this.anzeigeTaxadaten=false;
    await  this.anzeigeBewertungService.startBWUebersichtAusMst();
    this.FilterwkUebersicht=[];
    this.FilterwkUebersichtausMst=[];
   this.FilterwkUebersichtausMst=this.anzeigeBewertungService.wkUebersichtaMst;
    console.log(this.FilterwkUebersichtausMst);
    
    
    this.getButtonAktivUebersicht();
    this.FilterWKnameSetzenWK("wk1");
    this.onValueChangeFilter( '','');
    // if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
    this.MZBAnzeige=false;
    this.PhythoplanktonAnzeige=false;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=false;
    this.UebersichtWKausMstAnzeigen=true;
    this.FilterAnzeige=false;
    this.getButtonAktivUebersicht();
  }


  async handlePhytoplanktonClick(){ //Taxadaten PP
    this.komp_id=5;
    this.anzeigeTaxadaten=true;
    this.MakrophytenAnzeige=false;
    // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
    this.FilterAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  this.anzeigeBewertungMPService.value=this.value ;this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
  this.UebersichtAnzeigen=false;
    this.FilterWKnameSetzenWK("mst");
    this.UebersichtWKausMstAnzeigen=false;
  this.MZBAnzeige=false;
  this.PhythoplanktonAnzeige=true;
  if(this.anzeigeBewertungMPService.Taxa_Phyto.length===0){
  await this.anzeigeBewertungMPService.callBwMstTaxa(5);
}
 // await this.anzeigeBewertungMPService.FilterRichtigesArray(5,this.value,this.Artvalue,this.min,this.max);
  // console.log(this.anzeigeBewertungMPService.mstMakrophyten);
  this.filtertaxadaten(5);//this.mstTaxaMP=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorPhytol();
  


  }
  async handleMakrophytenTaxaClick(){ //Taxadaten MP
    this.anzeigeTaxadaten=true;
    this.komp_id=1;
    // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
    this.FilterAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  this.anzeigeBewertungMPService.value=this.value ;this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
  this.UebersichtAnzeigen=false;
    this.FilterWKnameSetzenWK("mst");
    this.UebersichtWKausMstAnzeigen=false;
  this.MZBAnzeige=false;
  this.PhythoplanktonAnzeige=false;
  console.log(this.anzeigeBewertungMPService.Taxa_MP);
  if (this.anzeigeBewertungMPService.Taxa_MP.length===0){
  await this.anzeigeBewertungMPService.callBwMstTaxa(1);}
  // await this.anzeigeBewertungMPService.FilterRichtigesArray(1,this.value,this.Artvalue,this.min,this.max);
 
  this.filtertaxadaten(1);//this.mstTaxaMP=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMP();
  this.MakrophytenAnzeige=true;

 }
async handleMZBTaxaClick(){ //Taxadaten MZB
  this.komp_id=3;
  this.anzeigeTaxadaten=true;
  this.MakrophytenAnzeige=false;
  this.FilterAnzeige=true;
  this.anzeigeBewertungMPService.value=this.value ;this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
  this.FilterWKnameSetzenWK("mst");
  // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
  this.MZBAnzeige=true;
  this.UebersichtAnzeigen=false;
  this.UebersichtWKausMstAnzeigen=false;
  this.anzeigenMstUebersichtService.value=this.value ;this.anzeigenMstUebersichtService.Artvalue=this.Artvalue;
  this.MakrophytenMstAnzeige=false;
  if (this.anzeigeBewertungMPService.Taxa_MZB.length===0){
  await this.anzeigeBewertungMPService.callBwMstTaxa(3);}
  // this.anzeigeBewertungMPService.FilterRichtigesArray(3,this.value,this.Artvalue,this.min,this.max);
 
  this.filtertaxadaten(3);// this.mstTaxaMZB=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMZ();
}
//mst-Bewertungen (komponente)
  async handleMakrophytenMPClick(komp_id:number){
    this.anzeigeTaxadaten=false;
    this.FilterWKnameSetzenWK("mst");
    // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
    this.komp_id=komp_id;
    this.anzeigenMstUebersichtService.value=this.value ;this.anzeigenMstUebersichtService.Artvalue=this.Artvalue;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=true;
    this.UebersichtAnzeigen=false;
    this.UebersichtWKausMstAnzeigen=false;
    await this.anzeigenMstUebersichtService.call(this.value,this.Artvalue,this.min,this.max,komp_id);
   // await this.anzeigenMstUebersichtService.callBwUebersichtExp(komp_id);
    this.props=[];
    this.props.push(this.anzeigenMstUebersichtService.mstUebersicht) ;
    this.props.push(this.anzeigenMstUebersichtService.displayColumnNames);
    this.props.push(this.anzeigenMstUebersichtService.displayedColumns);
    // console.log(this.props);
    if (komp_id===1){
    this.getButtonAktivColorMP();}else if (komp_id===3){
      this.getButtonAktivColorMZ();}else if (komp_id===5){
        this.getButtonAktivColorPhytol();}
  }


  async  buttonstamm(){

 await this.stammdatenService.start(true,false);
 console.log (this.stammdatenService.mst);

 console.log (this.stammdatenService.messstellenarray);
  }
  getButtonAktivColorPhytol() {
    
    const el = document.getElementById('ppButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)'); 
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('mpButton');
    this._renderer2.removeStyle(el1, 'background-color'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');  
   // this._renderer2.setStyle(ee, 'background-color', 'withe');
  }
  getButtonAktivColorMZ() {
    const el = document.getElementById('mpButton');
    this._renderer2.removeStyle(el, 'background-color'); 
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color');  
    const elz = document.getElementById('mzButton');
    this._renderer2.setStyle(elz, 'background-color', 'rgb(20,220,220)');  
   // this._renderer2.setStyle(ee, 'background-color', 'withe'); 
  }
  getButtonAktivColorMP() {
    const el = document.getElementById('mpButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');
   // this._renderer2.setStyle(ee, 'background-color', 'withe'); 
  }
  getButtonAktivUebersicht() {
    const el = document.getElementById('mpButton');
    this._renderer2.removeStyle(el,'background-color');  
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.setStyle(ee, 'background-color', 'rgb(20,220,220)'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color'); 
  }
}
