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
 
  isHelpActive: boolean = false;
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
  public FilterAnzeige:boolean=false;
  private komp_id:number=1;
  public props: any[]=[];
  public repreasent:number=2;
 public FilterWKname:string;

 helpText: string = '';
 maxstart=new Date().getFullYear();
  value = '';valueJahr = '';
  Artvalue = '';
  min:number=2016;
  max:number=this.maxstart; 
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
    this.FilterwkUebersicht=this.anzeigeBewertungService.wkUebersicht;
    this.getButtonAktivUebersicht();
    this.FilterWKnameSetzenWK("wk");
    this.onValueChangeFilter( '','');
    // Hier () verwenden, um die Methode auszuführen
    
    
	}}
  clearSearchFilter(){
    this.value='';
    if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenClick();
      
     }
     else if (this.MZBAnzeige===true && this.MakrophytenAnzeige===false && this.UebersichtAnzeigen===false) {
      this.handleMZBClick();} 
     else if (this.UebersichtAnzeigen===true)



    
    {
      if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
      
      this.onValueChangeFilter('','');
      //this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
    }
    }




    clearSearchFilterArt(){
      this.Artvalue='';this.anzeigenMstUebersichtService.Artvalue=''
      
      //Taxadaten
if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenClick();
      
     }
     else {
      this.handleMZBClick();
     }
  }


   
      
  
  
  
  
  

  FilterWKnameSetzenWK(wkmst:string){

    if (wkmst==="wk")
   { this.FilterWKname="Filter Wasserkörper"}
    else if (wkmst==="mst")
    {this.FilterWKname="Filter Messstellen"}
  }
  async mstalleauswaehlen(value:number,filter:string,artfilter:string){
    this.repreasent=value;
   await this.onValueChangeFilter(filter,artfilter);
    
     }

  
  updateSetting(min:number,max:number,value: string,Artvalue: string) {
    this.min = min;
    this.max=max;
this.onValueChangeFilter(value,Artvalue); 
  }


  
  async onValueChangeFilter(value: string, Artvalue: string) {
    this.anzeigeBewertungService.value=value;
    this.anzeigenMstUebersichtService.value=value;
    this.anzeigenMstUebersichtService.Artvalue=Artvalue;
    this.value = value; this.Artvalue = Artvalue;
    this.anzeigeBewertungService.filtertxt = value;
    //await this.anzeigeBewertungService.filterdaten;

    this.FilterwkUebersicht = [];

    if (!value && this.FilterWKname==="Filter Wasserkörper") {
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
        await this.handleMakrophytenClick();
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
        await this.handleMakrophytenClick();
      }
    }else if (this.FilterWKname==="Filter Messstellen") {

     
        
      if (this.MakrophytenMstAnzeige === true) {
        await this.handleMakrophytenMPClick(this.komp_id);

      } else if (this.MakrophytenAnzeige === true) {
        await this.handleMakrophytenClick();
      } else if (this.MZBAnzeige===true) {

        this.handleMZBClick()
      }
    }

    //console.log(this.MakrophytenMstAnzeige);

  }
  handleUebersichtWK(){
    this.FilterWKnameSetzenWK("wk")
    // if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
    this.MZBAnzeige=false;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=true;
    this.FilterAnzeige=false;
    this.getButtonAktivUebersicht();
   
  }
  ausblendenUebersicht(){
    this.MakrophytenAnzeige=true;
    this.MakrophytenMstAnzeige=true;
    this.UebersichtAnzeigen=false;
   // this.getButtonAktivUebersicht();
   this.FilterAnzeige=true;
  }
  async handleMakrophytenClick(){ //Taxadaten MP

    this.FilterAnzeige=true;
  this.MakrophytenMstAnzeige=false;
  this.anzeigeBewertungMPService.value=this.value ;this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
  this.UebersichtAnzeigen=false;
    this.FilterWKnameSetzenWK("mst");
  
  this.MZBAnzeige=false;
  
  await this.anzeigeBewertungMPService.callBwMstMP(1);
  await this.anzeigeBewertungMPService.datenUmwandeln(this.value,this.Artvalue,this.min,this.max);
  console.log(this.anzeigeBewertungMPService.mstMakrophyten);
  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMP();
  this.MakrophytenAnzeige=true;

 }
async handleMZBClick(){ //Taxadaten MZB
  this.MakrophytenAnzeige=false;
  this.FilterAnzeige=true;
  this.anzeigeBewertungMPService.value=this.value ;this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
  this.FilterWKnameSetzenWK("mst");
  this.MZBAnzeige=true;
  this.UebersichtAnzeigen=false;
  this.anzeigenMstUebersichtService.value=this.value ;this.anzeigenMstUebersichtService.Artvalue=this.Artvalue;
  this.MakrophytenMstAnzeige=false;
  await this.anzeigeBewertungMPService.callBwMstMP(3);
  this.anzeigeBewertungMPService.datenUmwandeln(this.value,this.Artvalue,this.min,this.max);
  this.mstMZB=this.anzeigeBewertungMPService.mstMakrophyten;
  this.getButtonAktivColorMZ();
}
  async handleMakrophytenMPClick(komp_id:number){
    this.FilterWKnameSetzenWK("mst");
    this.komp_id=komp_id;
    this.anzeigenMstUebersichtService.value=this.value ;this.anzeigenMstUebersichtService.Artvalue=this.Artvalue;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=true;
    this.UebersichtAnzeigen=false;
    await this.anzeigenMstUebersichtService.call(this.value,this.Artvalue,this.min,this.max,komp_id);
   // await this.anzeigenMstUebersichtService.callBwUebersichtExp(komp_id);
    this.props=[];
    this.props.push(this.anzeigenMstUebersichtService.mstUebersicht) ;
    this.props.push(this.anzeigenMstUebersichtService.displayColumnNames);
    this.props.push(this.anzeigenMstUebersichtService.displayedColumns);
    console.log(this.props);
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
