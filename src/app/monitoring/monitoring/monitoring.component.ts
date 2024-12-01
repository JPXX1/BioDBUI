import { Component,OnInit,Renderer2,ViewChild,AfterViewInit,AfterViewChecked } from '@angular/core';
import { WkUebersicht } from 'src/app/shared/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/shared/services/anzeige-bewertung.service';
import { MstMakrophyten } from 'src/app/shared/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/shared/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/shared/services/anzeigen-mst-uebersicht.service';
import { FarbeBewertungService } from 'src/app/shared/services/farbe-bewertung.service';
import { MstUebersicht } from 'src/app/shared/interfaces/mst-uebersicht';
import { StammdatenService } from 'src/app/shared/services/stammdaten.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/shared/services/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HelpService } from 'src/app/shared/services/help.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
/**
 * Die `MonitoringComponent` Klasse ist verantwortlich für die Verwaltung der Überwachungsansicht in der Anwendung.
 * Sie implementiert die `OnInit`, `AfterViewInit` und `AfterViewChecked` Lebenszyklus-Hooks, um Initialisierung
 * und Ansichtsaktualisierungen zu handhaben. Die Komponente bietet verschiedene Funktionen wie Datenfilterung,
 * Benutzerinteraktionen und Anzeige von Informationen basierend auf verschiedenen Kriterien.
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {AfterViewChecked}
 * 
 * @property {boolean} anzeigeTaxadaten - Gibt an, ob taxonomische Daten angezeigt werden.
 * @property {boolean} isHelpActive - Gibt an, ob die Hilfefunktion aktiv ist.
 * @property {boolean} DiatomeenAnzeige - Gibt an, ob Diatomeendaten angezeigt werden.
 * @property {WkUebersicht[]} FilterwkUebersicht - Array der gefilterten Wasserübersichtsdaten.
 * @property {WkUebersicht[]} FilterwkUebersichtausMst - Array der gefilterten Wasserübersichtsdaten von Messstationen.
 * @property {MstMakrophyten[]} mstTaxaDia - Array der Diatomeen-Taxadaten.
 * @property {MstMakrophyten[]} mstTaxaMP - Array der Makrophyten-Taxadaten.
 * @property {MstMakrophyten[]} mstTaxaMZB - Array der Makrozoobenthos-Taxadaten.
 * @property {MstMakrophyten[]} mstTaxaPh - Array der Phytoplankton-Taxadaten.
 * @property {MstUebersicht[]} mstUebersicht - Array der Messstationsübersichtsdaten.
 * @property {boolean} MakrophytenAnzeige - Gibt an, ob Makrophyten-Daten angezeigt werden.
 * @property {boolean} MZBAnzeige - Gibt an, ob Makrozoobenthos-Daten angezeigt werden.
 * @property {boolean} PhythoplanktonAnzeige - Gibt an, ob Phytoplankton-Daten angezeigt werden.
 * @property {boolean} MakrophytenMstAnzeige - Gibt an, ob Makrophyten-Messstationsdaten angezeigt werden.
 * @property {boolean} UebersichtAnzeigen - Gibt an, ob die Übersicht angezeigt wird.
 * @property {boolean} UebersichtWKausMstAnzeigen - Gibt an, ob die Übersicht von Messstationen angezeigt wird.
 * @property {string[]} displayColumnNames - Array der Anzeigespaltennamen.
 * @property {string[]} displayedColumns - Array der angezeigten Spalten.
 * @property {boolean} FilterAnzeige - Gibt an, ob der Filter angezeigt wird.
 * @property {number} komp_id - Komponenten-ID, die für die Filterung verwendet wird.
 * @property {any[]} props - Array der Eigenschaften für die Komponente.
 * @property {number} repreasent - Repräsentiert den aktuellen Zustand der Komponente.
 * @property {string} FilterWKname - Name des Wasserfilterkörpers.
 * @property {string} helpText - Text für die Hilfefunktion.
 * @property {Date} maxstart - Maximales Startdatum.
 * @property {string} value - Aktueller Wert für die Filterung.
 * @property {string} valueJahr - Aktueller Jahreswert für die Filterung.
 * @property {string} Artvalue - Aktueller Artwert für die Filterung.
 * @property {number} min - Minimalwert für die Filterung.
 * @property {number} max - Maximalwert für die Filterung.
 * 
 * @constructor
 * @param {HelpService} helpService - Service zur Handhabung hilfebezogener Funktionen.
 * @param {CommentService} commentService - Service zur Handhabung von Kommentaren.
 * @param {MatSnackBar} snackBar - Material Snackbar Service zur Anzeige von Nachrichten.
 * @param {Router} router - Angular Router Service zur Navigation.
 * @param {AuthService} authService - Service zur Handhabung der Authentifizierung.
 * @param {Renderer2} _renderer2 - Angular Renderer2 Service zur DOM-Manipulation.
 * @param {FarbeBewertungService} Farbebewertg - Service zur Handhabung von Farbbewertungen.
 * @param {AnzeigeBewertungService} anzeigeBewertungService - Service zur Handhabung von Anzeigebewertungen.
 * @param {AnzeigeBewertungMPService} anzeigeBewertungMPService - Service zur Handhabung von Makrophyten-Anzeigebewertungen.
 * @param {AnzeigenMstUebersichtService} anzeigenMstUebersichtService - Service zur Handhabung der Messstationsübersichtsanzeige.
 * @param {StammdatenService} stammdatenService - Service zur Handhabung von Stammdaten.
 * 
 * @method ngAfterViewInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
 * @method ngAfterViewChecked - Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente überprüft wurde.
 * @method InfoBox - Zeigt eine Informationsbox mit einer gegebenen Nachricht an.
 * @param {string} message - Die Nachricht, die in der Informationsbox angezeigt werden soll.
 * @method toggleHelp - Schaltet die Hilfefunktion ein und aus.
 * @method ngOnInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem die Komponente initialisiert wurde.
 * @method clearSearchFilter - Löscht den Suchfilter und aktualisiert die angezeigten Daten entsprechend.
 * @method clearSearchFilterArt - Löscht den Artensuchfilter und aktualisiert die angezeigten Daten entsprechend.
 * @method FilterWKnameSetzenWK - Setzt den Namen des Wasserfilterkörpers basierend auf dem gegebenen Parameter.
 * @param {string} wkmst - Der Parameter zur Bestimmung des Filternamens.
 * @method mstalleauswaehlen - Wählt alle Messstationen basierend auf dem gegebenen Wert und Filtern aus.
 * @param {number} value - Der Wert zur Darstellung des aktuellen Zustands.
 * @param {string} filter - Der anzuwendende Filter.
 * @param {string} artfilter - Der anzuwendende Artfilter.
 * @method updateSetting - Aktualisiert die Einstellungen basierend auf den gegebenen Parametern.
 * @param {number} min - Der Minimalwert für die Einstellung.
 * @param {number} max - Der Maximalwert für die Einstellung.
 * @param {string} value - Der Wert für die Einstellung.
 * @param {string} Artvalue - Der Artwert für die Einstellung.
 * @param {boolean} ausGUI - Gibt an, ob die Aktualisierung aus der GUI stammt.
 * @method reduceArray - Reduziert die Größe des gegebenen Arrays auf maximal 2500 Elemente.
 * @param {MstMakrophyten[]} mstTaxaAllg - Das zu reduzierende Array.
 * @returns {MstMakrophyten[]} - Das reduzierte Array.
 * @method filtertaxadaten - Filtert taxonomische Daten basierend auf der gegebenen Komponentennummer.
 * @param {number} komp - Die Komponentennummer zur Bestimmung der zu filternden Daten.
 * @method onValueChangeFilter - Verarbeitet Änderungen der Filterwerte und aktualisiert die angezeigten Daten entsprechend.
 * @param {string} value - Der neue Wert für den Filter.
 * @param {string} Artvalue - Der neue Artwert für den Filter.
 * @method handleUebersichtWK - Verarbeitet die Anzeige der Wasserübersicht.
 * @method handleUebersichtWKausMst - Verarbeitet die Anzeige der Wasserübersicht von Messstationen.
 * @method handlePhytoplanktonTaxaClick - Verarbeitet die Anzeige von Phytoplankton-Taxadaten.
 * @method handleMakrophytenTaxaClick - Verarbeitet die Anzeige von Makrophyten-Taxadaten.
 * @method handleDiatomeenTaxaClick - Verarbeitet die Anzeige von Diatomeen-Taxadaten.
 * @method handleMZBTaxaClick - Verarbeitet die Anzeige von Makrozoobenthos-Taxadaten.
 * @method handleMakrophytenMPClick - Verarbeitet die Anzeige von Makrophyten-Messstationsdaten.
 * @param {number} komp_id - Die Komponenten-ID zur Bestimmung der anzuzeigenden Daten.
 * @method buttonstamm - Verarbeitet die Initialisierung von Stammdaten.
 * @method getButtonAktivColorPhytol - Setzt die aktive Farbe für den Phytoplankton-Button.
 * @method getButtonAktivColorMZ - Setzt die aktive Farbe für den Makrozoobenthos-Button.
 * @method getButtonAktivColorDia - Setzt die aktive Farbe für den Diatomeen-Button.
 * @method getButtonAktivColorMP - Setzt die aktive Farbe für den Makrophyten-Button.
 * @method getButtonAktivUebersicht - Setzt die aktive Farbe für den Übersichts-Button.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class MonitoringComponent implements  OnInit,AfterViewInit,AfterViewChecked{
 anzeigeTaxadaten:boolean=false;
  isHelpActive: boolean = false;
  DiatomeenAnzeige:boolean=false;
  FilterwkUebersicht: WkUebersicht[] = [];
  FilterwkUebersichtausMst: WkUebersicht[] = [];
  mstTaxaDia:MstMakrophyten[]=[];//TaxaDia
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
  // maxold:number=this.maxstart;
  // minold:number=this.maxstart-10;
  constructor(private helpService: HelpService,private commentService: CommentService, private snackBar: MatSnackBar,private router: Router,private authService: AuthService,private _renderer2: Renderer2,private Farbebewertg: FarbeBewertungService,private anzeigeBewertungService: AnzeigeBewertungService, private anzeigeBewertungMPService:AnzeigeBewertungMPService,
    private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private stammdatenService:StammdatenService) { 
	}
  /**
   * Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
   * Diese Methode wird verwendet, um Mouseover-Ereignisse für Elemente mit der Klasse 'helpable'
   * mithilfe des helpService zu registrieren.
   *
   * @memberof MonitoringComponent
   */
  ngAfterViewInit() {
	
    //	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
      this.helpService.registerMouseoverEvents();}
      ngAfterViewChecked() {
        this.helpService.registerMouseoverEvents();
      }

      /**
       * Zeigt eine Informationsnachricht in einer Snackbar an.
       *
       * @param message - Die Nachricht, die in der Snackbar angezeigt werden soll.
       */
      InfoBox(message: string) {
        const duration: number = 3000;
          this.snackBar.open(message, 'Schließen', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
  /**
   * Schaltet die Sichtbarkeit des Hilfebereichs um.
   * Diese Methode wechselt die `isHelpActive`-Eigenschaft zwischen `true` und `false`.
   */
  toggleHelp() {
    this.isHelpActive = !this.isHelpActive;
  }
  /**
   * Initialisiert die Komponente.
   * 
   * Diese Methode wird aufgerufen, wenn die Komponente initialisiert wird. Sie überprüft, ob der Benutzer eingeloggt ist,
   * und navigiert zur Login-Seite, falls nicht. Wenn der Benutzer eingeloggt ist, wird der 
   * `anzeigeBewertungService` initialisiert, es wird auf `helpService`-Observables abonniert, um hilfebezogene 
   * Eigenschaften zu aktualisieren, und die Filterübersicht wird eingerichtet.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist.
   */
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

    
	}}
  /**
   * Löscht den Suchfilter und löst die entsprechenden Aktionen basierend auf dem aktuellen Zustand verschiedener Anzeigeflags aus.
   * 
   * - Setzt den `value` auf einen leeren String zurück.
   * - Wenn `MZBAnzeige` false und `MakrophytenAnzeige` true ist, wird `handleMakrophytenTaxaClick` ausgelöst.
   * - Wenn `MZBAnzeige` true, `MakrophytenAnzeige` false und `UebersichtAnzeigen` false ist, wird `handleMZBTaxaClick` ausgelöst.
   * - Wenn `PhythoplanktonAnzeige` true, `MakrophytenAnzeige` false und `UebersichtAnzeigen` false ist, wird `handlePhytoplanktonTaxaClick` ausgelöst.
   * - Wenn `UebersichtAnzeigen` true ist:
   *   - Wenn `anzeigeBewertungService.wkUebersicht` leer ist, wird `ngOnInit` aufgerufen.
   *   - Ruft `onValueChangeFilter` mit leeren Strings auf.
   * - Wenn `UebersichtWKausMstAnzeigen` true ist und `anzeigeBewertungService.getBwWKUebersichtAusMst` leer ist, wird `handleUebersichtWKausMst` ausgelöst.
   * - Andernfalls wird `onValueChangeFilter` mit leeren Strings aufgerufen.
   */
  clearSearchFilter(){
    this.value='';

    if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenTaxaClick();
      
     }
     else if (this.MZBAnzeige===true && this.MakrophytenAnzeige===false && this.UebersichtAnzeigen===false) {
      this.handleMZBTaxaClick();} 
     else if (this.PhythoplanktonAnzeige===true && this.MakrophytenAnzeige===false && this.UebersichtAnzeigen===false) {
      this.handlePhytoplanktonTaxaClick();} 
     else if(this.UebersichtAnzeigen===true)



    
    {
      if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
      
      this.onValueChangeFilter('','');
      //this.FilterwkUebersicht = this.anzeigeBewertungService.wkUebersicht;
    }else if (this.UebersichtWKausMstAnzeigen===true){
      if (this.anzeigeBewertungService.getBwWKUebersichtAusMst.length=== 0){this.handleUebersichtWKausMst();}

    }
    else{this.onValueChangeFilter('','');}
    }




    /**
     * Löscht den Suchfilter für Art und setzt den Artvalue zurück.
     * Abhängig vom Zustand von MZBAnzeige, MakrophytenAnzeige und PhythoplanktonAnzeige
     * wird die entsprechende Handler-Funktion aufgerufen, um die Taxadaten zu aktualisieren.
     * 
     * - Wenn `MZBAnzeige` false und `MakrophytenAnzeige` true ist, wird `handleMakrophytenTaxaClick` aufgerufen.
     * - Wenn `MZBAnzeige` true und `MakrophytenAnzeige` false ist, wird `handleMZBTaxaClick` aufgerufen.
     * - Wenn `MZBAnzeige` false, `MakrophytenAnzeige` false und `PhythoplanktonAnzeige` true ist, wird `handlePhytoplanktonTaxaClick` aufgerufen.
     */
    clearSearchFilterArt(){
      this.Artvalue='';this.anzeigenMstUebersichtService.Artvalue=''
      
      //Taxadaten
if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===true)
 
  {
    
      
       this.handleMakrophytenTaxaClick();
      
     }
     else if ( this.MZBAnzeige===true && this.MakrophytenAnzeige===false) {
      this.handleMZBTaxaClick();
     }
     else if ( this.MZBAnzeige===false && this.MakrophytenAnzeige===false && this.PhythoplanktonAnzeige===true) {
      this.handlePhytoplanktonTaxaClick;
     }
  }


   
      
  
  
  
  
  

  /**
   * Setzt den Filternamen basierend auf dem angegebenen Parameter.
   *
   * @param wkmst - Ein String, der den zu setzenden Filternamen bestimmt.
   *                - "wk" setzt den Filternamen auf "Filter Wasserkörper".
   *                - "mst" setzt den Filternamen auf "Filter Messstellen".
   *                - "wk1" setzt den Filternamen auf "Filter Wasserkörper ".
   */
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
  /**
   * Aktualisiert die Einstellungen basierend auf den angegebenen Parametern.
   *
   * @param min - Der Minimalwert für die Einstellung.
   * @param max - Der Maximalwert für die Einstellung.
   * @param value - Der neue Wert, der gesetzt werden soll.
   * @param Artvalue - Der Typ oder die Kategorie des Wertes.
   * @param ausGUI - Ein Boolean, der angibt, ob die Aktualisierung aus der GUI ausgelöst wurde.
   */
   updateSetting(min:number,max:number,value: string,Artvalue: string,ausGUI:boolean) {
  
    if (ausGUI===true){
      this.onValueChangeFilter(value,Artvalue); 
      // this.filtertaxadaten(this.komp_id);
      // 
      }else {this.onValueChangeFilter(value,Artvalue); }
    // this.minold=min;
    // this.maxold=max;
  }
    /**
     * Reduziert die Größe des angegebenen Arrays von MstMakrophyten-Objekten auf maximal 2500 Elemente.
     * Wenn die Array-Länge 2500 überschreitet, wird eine Nachricht in der InfoBox angezeigt, die auf die Reduzierung hinweist.
     * 
     * @param mstTaxaAllg - Das zu reduzierende Array von MstMakrophyten-Objekten.
     * @returns Ein neues Array, das bis zu 2500 Elemente aus dem ursprünglichen Array enthält.
     */
   reduceArray(mstTaxaAllg:MstMakrophyten[]): MstMakrophyten[] {
    let mstTaxaAllg_neu:MstMakrophyten[];

    if (mstTaxaAllg.length > 2500) {
      this.InfoBox('Die Anzahl der Datensätze wurde auf 2500 reduziert. Verwenden Sie die Filterfunktionen.');
      mstTaxaAllg_neu= mstTaxaAllg.slice(0, 2500);
    }else {mstTaxaAllg_neu= mstTaxaAllg;}
  return mstTaxaAllg_neu;}
/**
 * Filtert taxonomische Daten basierend auf der angegebenen Komponentennummer.
 * 
 * @param {number} komp - Die Komponentennummer, die verwendet wird, um zu bestimmen, welche taxonomischen Daten gefiltert werden sollen.
 * 
 * @remarks
 * Die Methode verwendet die Funktionen `anzeigeBewertungMPService.FilterRichtigesArray`, um die Daten zu filtern.
 * und `reduceArray`, um die Anzahl der Elemente im Array zu reduzieren.
 * 
 * @example
 * ```typescript
 * this.filtertaxadaten(1);
 * ```
 * 
 * @returns {void}
 */
filtertaxadaten(komp:number){
switch(komp){
  case 1:
    this.mstTaxaMP= this.reduceArray(this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max));
    
        break;
      case 2:
        this.mstTaxaDia= this.reduceArray(this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max));
   
        break;
      case 3:
        this.mstTaxaMZB= this.reduceArray(this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max));
 
        break;
      case 5:
        this.mstTaxaPh= this.reduceArray(this.anzeigeBewertungMPService.FilterRichtigesArray(this.komp_id,this.value,this.Artvalue,this.min,this.max));
 
        break;
 
 
}}
  
  /**
   * Verarbeitet die Änderung der Filterwerte und aktualisiert die relevanten Dienste und Eigenschaften.
   * Filtert die Daten basierend auf dem angegebenen Wert und Artvalue und aktualisiert die Benutzeroberfläche entsprechend.
   * 
   * @param value - Der neue Filterwert.
   * @param Artvalue - Der neue Artvalue-Filter.
   * 
   * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn die Filterung und die Aktualisierungen der Benutzeroberfläche abgeschlossen sind.
   */
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

          if (f.WKname.toLowerCase().includes(value.toLowerCase()) && (f.Jahr >= this.min && f.Jahr <= this.max)) {

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
/**
   * Behandelt die Übersicht für WK (Wasserkörper).
   * 
   * Diese Methode setzt den Filter für den WK-Namen, blendet die Anzeige der Taxadaten aus
   * und aktualisiert verschiedene Anzeigeflags, um die WK-Übersicht anzuzeigen.
   * Sie aktiviert auch die Übersichtsschaltfläche.
   * 
   * @Bemerkungen
   * - Die Methode setzt `anzeigeTaxadaten` auf `false`.
   * - Sie setzt mehrere Anzeigeflags (`MZBAnzeige`, `PhythoplanktonAnzeige`, `DiatomeenAnzeige`, `MakrophytenAnzeige`, `MakrophytenMstAnzeige`) auf `false`.
   * - Sie setzt `UebersichtAnzeigen` auf `true` und `UebersichtWKausMstAnzeigen` auf `false`.
   * - Sie setzt `FilterAnzeige` auf `false`.
   * - Schließlich ruft sie `getButtonAktivUebersicht` auf, um die Übersichtsschaltfläche zu aktivieren.
   */
  handleUebersichtWK(){
    this.FilterWKnameSetzenWK("wk")
    this.anzeigeTaxadaten=false;
    // if (this.anzeigeBewertungService.wkUebersicht.length=== 0){this.ngOnInit();}
    this.MZBAnzeige=false;
    this.PhythoplanktonAnzeige=false;
    this.DiatomeenAnzeige=false;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=true;
    this.UebersichtWKausMstAnzeigen=false;
    this.FilterAnzeige=false;
    this.getButtonAktivUebersicht();
   
  }
 /**
   * Handhabt die Übersicht von WK aus Mst.
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Setzt `anzeigeTaxadaten` auf false.
   * - Startet die Übersicht von BW aus Mst mit `anzeigeBewertungService`.
   * - Setzt und aktualisiert `FilterwkUebersicht` und `FilterwkUebersichtausMst` mit Daten von `anzeigeBewertungService`.
   * - Protokolliert das aktualisierte `FilterwkUebersichtausMst` in der Konsole.
   * - Aktualisiert den Aktivierungszustand der Schaltfläche für die Übersicht.
   * - Setzt den WK-Namenfilter auf "wk1".
   * - Löst den Wertänderungsfilter mit leeren Zeichenfolgen aus.
   * - Setzt verschiedene Anzeigeflaggen (`DiatomeenAnzeige`, `MZBAnzeige`, `PhythoplanktonAnzeige`, `MakrophytenAnzeige`, `MakrophytenMstAnzeige`) auf false.
   * - Setzt `UebersichtAnzeigen` auf false und `UebersichtWKausMstAnzeigen` auf true.
   * - Setzt `FilterAnzeige` auf false.
   * - Aktualisiert den Aktivierungszustand der Schaltfläche für die Übersicht erneut.
   * 
   * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Methode abgeschlossen ist.
   */
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
    this.DiatomeenAnzeige=false;
    this.MZBAnzeige=false;
    this.PhythoplanktonAnzeige=false;
    this.MakrophytenAnzeige=false;
    this.MakrophytenMstAnzeige=false;
    this.UebersichtAnzeigen=false;
    this.UebersichtWKausMstAnzeigen=true;
    this.FilterAnzeige=false;
    this.getButtonAktivUebersicht();
  }


  /**
   * Behandelt das Klick-Ereignis für Phytoplankton-Taxa.
   * 
   * Diese Methode setzt verschiedene Komponenten-Eigenschaften, um die Phytoplankton-Taxa-Daten anzuzeigen.
   * Sie aktualisiert die Sichtbarkeit verschiedener Abschnitte und ruft notwendige Dienste auf, um Daten abzurufen und zu filtern.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Datenabruf- und Filteroperationen abgeschlossen sind.
   */
  async handlePhytoplanktonTaxaClick(){ //Taxadaten PP
    this.komp_id=5;
    this.anzeigeTaxadaten=true;
    this.MakrophytenAnzeige=false;
    this.DiatomeenAnzeige=false;
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
  /**
   * Behandelt das Klick-Ereignis für Makrophyten-Taxa.
   * 
   * Diese Methode führt mehrere Aktionen aus, um die Benutzeroberfläche zu aktualisieren und Daten zu Makrophyten-Taxa abzurufen:
   * - Setzt verschiedene Anzeigeflaggen, um die Sichtbarkeit von UI-Komponenten zu steuern.
   * - Aktualisiert den `anzeigeBewertungMPService` mit aktuellen Werten.
   * - Ruft eine Servicemethode auf, um Makrophyten-Taxa-Daten abzurufen, falls diese noch nicht verfügbar sind.
   * - Filtert die Taxa-Daten und aktualisiert die Schaltflächenfarbe.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn alle asynchronen Operationen abgeschlossen sind.
   */
  async handleMakrophytenTaxaClick(){ //Taxadaten MP
    this.anzeigeTaxadaten=true;
    this.komp_id=1;
    // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
    this.FilterAnzeige=true;
    this.DiatomeenAnzeige=false;
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
/**
 * Behandelt das Klick-Ereignis für Diatomeen-Taxa.
 * 
 * Diese Methode führt die folgenden Aktionen aus:
 * - Setzt die Anzeige-Flagge für Taxadaten auf true.
 * - Setzt die Komponenten-ID auf 2.
 * - Aktualisiert verschiedene Anzeige-Flaggen für unterschiedliche Komponenten.
 * - Setzt den Wert und Artvalue für den anzeigeBewertungMPService.
 * - Ruft die Methode FilterAnzeige mit "mst" als Parameter auf.
 * - Überprüft, ob das Taxa_Dia-Array leer ist und ruft in diesem Fall die Methode callBwMstTaxa mit 2 als Parameter auf.
 * - Ruft die Methode filtertaxadaten mit 2 als Parameter auf.
 * - Ruft die Methode getButtonAktivColorDia auf.
 * - Setzt die DiatomeenAnzeige-Flagge auf true.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die asynchronen Operationen abgeschlossen sind.
 */

 async handleDiatomeenTaxaClick(){ //Taxadaten Diatomeen
  this.anzeigeTaxadaten=true;
  this.komp_id=2;
  // this.updateSetting(this.min, this.max, this.value, this.Artvalue,false);
  this.FilterAnzeige=true;
this.MakrophytenMstAnzeige=false;
this.anzeigeBewertungMPService.value=this.value ;
this.anzeigeBewertungMPService.Artvalue=this.Artvalue;
this.UebersichtAnzeigen=false;
  this.FilterWKnameSetzenWK("mst");
  this.UebersichtWKausMstAnzeigen=false;
this.MZBAnzeige=false;
this.PhythoplanktonAnzeige=false;
this.MakrophytenAnzeige=false;
//console.log(this.anzeigeBewertungMPService.Taxa_MP);
if (this.anzeigeBewertungMPService.Taxa_Dia.length===0){
await this.anzeigeBewertungMPService.callBwMstTaxa(2);}
// await this.anzeigeBewertungMPService.FilterRichtigesArray(1,this.value,this.Artvalue,this.min,this.max);

this.filtertaxadaten(2);//this.mstTaxaMP=this.anzeigeBewertungMPService.mstMakrophyten;
this.getButtonAktivColorDia();
this.DiatomeenAnzeige=true;

}
/**
 * Behandelt das Klick-Ereignis für MZB-Taxadaten.
 * 
 * Diese Methode führt mehrere Aktionen aus, um den Zustand der Komponente und die Benutzeroberfläche zu aktualisieren:
 * - Setzt die Komponenten-ID auf 3.
 * - Aktualisiert verschiedene Anzeigeflaggen, um unterschiedliche Abschnitte anzuzeigen/auszublenden.
 * - Setzt Filterwerte und ruft eine Methode auf, um den Filternamen zu setzen.
 * - Aktualisiert den `anzeigeBewertungMPService` mit dem aktuellen Wert und Artvalue.
 * - Zeigt den MZB-Abschnitt an und blendet die Übersichtsabschnitte aus.
 * - Ruft eine Servicemethode auf, um MZB-Taxadaten abzurufen, falls diese noch nicht geladen sind.
 * - Filtert die Taxadaten und aktualisiert die Schaltflächenfarbe.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die asynchronen Operationen abgeschlossen sind.
 */
async handleMZBTaxaClick(){ //Taxadaten MZB
  this.komp_id=3;
  this.DiatomeenAnzeige=false;
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
    this.anzeigenMstUebersichtService.value=this.value ;
    this.anzeigenMstUebersichtService.Artvalue=this.Artvalue;
    this.MakrophytenAnzeige=false;
    this.DiatomeenAnzeige=false;
    this.MakrophytenMstAnzeige=true;
    this.PhythoplanktonAnzeige=false;
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


  /**
   * Startet die `start` Methode des `stammdatenService` mit den angegebenen Parametern
   * und protokolliert anschließend die `mst` und `messstellenarray` Eigenschaften des `stammdatenService` in der Konsole.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die `start` Methode abgeschlossen ist.
   */
  async  buttonstamm(){

 await this.stammdatenService.start(true,false);
 console.log (this.stammdatenService.mst);

 console.log (this.stammdatenService.messstellenarray);
  }
  /**
   * Setzt die Hintergrundfarbe des 'ppButton'-Elements auf 'rgb(20,220,220)' und entfernt die Hintergrundfarbe
   * von den Elementen 'berichtsEUButton', 'mpButton', 'mzButton' und 'diatomsButton'.
   *
   * @private
   * @method
   */
  getButtonAktivColorPhytol() {
    
    const el = document.getElementById('ppButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)'); 
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('mpButton');
    this._renderer2.removeStyle(el1, 'background-color'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');  
    const el2 = document.getElementById('diatomsButton');
    this._renderer2.removeStyle(el2, 'background-color');
  }
    /**
     * Aktualisiert die Hintergrundfarbe bestimmter Schaltflächen im DOM.
     * 
     * Diese Methode entfernt den Hintergrundfarbstil von den Elementen mit den IDs 
     * 'mpButton', 'berichtsEUButton', 'ppButton' und 'diatomsButton'. Anschließend 
     * setzt sie die Hintergrundfarbe des Elements mit der ID 'mzButton' auf 'rgb(20,220,220)'.
     * 
     * @returns {void}
     */
  getButtonAktivColorMZ() {
    const el = document.getElementById('mpButton');
    this._renderer2.removeStyle(el, 'background-color'); 
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color');  
    const elz = document.getElementById('mzButton');
    this._renderer2.setStyle(elz, 'background-color', 'rgb(20,220,220)');  
    const el2 = document.getElementById('diatomsButton');
    this._renderer2.removeStyle(el2, 'background-color');
  }
    /**
     * Aktualisiert die Hintergrundfarbe bestimmter Schaltflächen im DOM.
     * 
     * Diese Methode entfernt den Hintergrundfarbstil von den Elementen mit den IDs 
     * 'mpButton', 'berichtsEUButton', 'ppButton' und 'diatomsButton'. Anschließend 
     * setzt sie die Hintergrundfarbe des Elements mit der ID 'mzButton' auf 'rgb(20,220,220)'.
     * 
     * @returns {void}
     */
  getButtonAktivColorDia() {
    const el = document.getElementById('diatomsButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const ep = document.getElementById('mpButton');
    this._renderer2.removeStyle(ep, 'background-color'); 
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');
   // this._renderer2.setStyle(ee, 'background-color', 'withe'); 
  }
  /**
   * Setzt die Hintergrundfarbe des 'mpButton'-Elements auf 'rgb(20,220,220)' und entfernt die Hintergrundfarbe
   * von den Elementen 'berichtsEUButton', 'ppButton', 'mzButton' und 'diatomsButton'.
   * 
   * @bemerkungen
   * Diese Methode verwendet den Renderer2-Dienst, um die Stile der DOM-Elemente zu manipulieren.
   * 
   * @returns void
   */
  getButtonAktivColorMP() {
    const el = document.getElementById('mpButton');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.removeStyle(ee,'background-color');  
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');
    const el2 = document.getElementById('diatomsButton');
    this._renderer2.removeStyle(el2, 'background-color');
   // this._renderer2.setStyle(ee, 'background-color', 'withe'); 
  }
  /**
   * Aktualisiert die Hintergrundfarbe bestimmter Schaltflächen im DOM.
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Entfernt den Hintergrundfarbstil vom Element mit der ID 'mpButton'.
   * - Setzt die Hintergrundfarbe des Elements mit der ID 'berichtsEUButton' auf 'rgb(20,220,220)'.
   * - Entfernt den Hintergrundfarbstil vom Element mit der ID 'mzButton'.
   * - Entfernt den Hintergrundfarbstil vom Element mit der ID 'ppButton'.
   * - Entfernt den Hintergrundfarbstil vom Element mit der ID 'diatomsButton'.
   * 
   * @returns {void}
   */
  getButtonAktivUebersicht() {
    const el = document.getElementById('mpButton');
    this._renderer2.removeStyle(el,'background-color');  
    const ee = document.getElementById('berichtsEUButton');
    this._renderer2.setStyle(ee, 'background-color', 'rgb(20,220,220)'); 
    const elz = document.getElementById('mzButton');
    this._renderer2.removeStyle(elz, 'background-color');
    const el1 = document.getElementById('ppButton');
    this._renderer2.removeStyle(el1,'background-color'); 
    const el2 = document.getElementById('diatomsButton');
    this._renderer2.removeStyle(el2, 'background-color');
  }
}
