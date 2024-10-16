import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { StammdatenService } from '../services/stammdaten.service'; 
//import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import {MstMitExpertenurteil} from 'src/app/interfaces/mst-mit-expertenurteil';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService } from 'src/app/services/anzeige-bewertung.service';

import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HelpService } from '../services/help.service';
import { AuthService } from '../auth/auth.service';
import {MsteditService} from 'src/app/services/mstedit.service';

@Component({
  selector: 'app-expertenurteil-mst',
  templateUrl: './expertenurteil-mst.component.html',
  styleUrls: ['./expertenurteil-mst.component.css']
})
export class ExpertenurteilMstComponent implements OnInit, AfterViewInit {
  buttonClicked: boolean = false; // Um zu verfolgen, ob der Button geklickt wurde
see_fliess:boolean=false;
    items = [];
    public dbMPUebersichtMst: MstMitExpertenurteil[] = [];
    BewertungwkUebersicht: MstMitExpertenurteil[] = [];
    BewertungwkUebersichtleer:boolean=false;
    WKUebersichtAnzeigen=false;
    BewertungenMstAnzeige=false;
    //mstExpert: MstMitExpertenurteil[] = []; // TaxaMP
    ArtenAnzeige = false;
    messstellen = [];
    wasserkorper = [];
    filteredMessstellen = [];
    filteredWasserkorper = [];
    repraesentativeSelected=false;
    allMessstellenSelected = false;
    allWasserkorperSelected = false;
    allKomponentenSelected = false;
    form: FormGroup;
    messstellenFilterControl = new FormControl('');
    wasserkorperFilterControl = new FormControl('');
    isMessstellenOpen = false;
    isWasserkorperOpen = false;
    messstellenTypeControl = new FormControl('fluss'); // Default to Fließgewässer
    waterBodyTypeControl = new FormControl('fluss'); // Default to Fließgewässer
    componentTypeControl = new FormControl([]); // For mat-button-toggle-group
    minstart:number=2005;
    maxstart:number= new Date().getFullYear();
    isHelpActive: boolean = false;
    helpText: string = '';
    itemsAbfrage = [
      { id: 'messstellenbewertung', komponente: 'Messstellenbewertung' },
      { id: 'wasserkorperbewertung', komponente: 'Wasserkörperbewertung' }
    ];
    constructor( private msteditService:MsteditService,private authService: AuthService,
      private sanitizer: DomSanitizer,private commentService: CommentService, 
      private snackBar: MatSnackBar,private helpService: HelpService,private router: Router,
      private farbeBewertungService:FarbeBewertungService,private anzeigeBewertungService:AnzeigeBewertungService,
      private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private fb: FormBuilder, 
      private anzeigeBewertungMPService:AnzeigeBewertungMPService,private stammdatenService: StammdatenService) {
      this.form = this.fb.group({
        min: new FormControl(2010),
        max: new FormControl( new Date().getFullYear()),
        selectedComponents: [[]],
        selectedWasserkorper: [[]],
        dropdownSelection: [null],
        selectedItems: [[]],
        messstellenType: this.messstellenTypeControl,
        waterBodyType: this.waterBodyTypeControl,
        componentType: this.componentTypeControl // Initialize the form control for button toggle group
      });
  
      this.messstellenFilterControl.valueChanges.subscribe(value => this.filterMessstellen(value));
      this.wasserkorperFilterControl.valueChanges.subscribe(value => this.filterWasserkorper(value));
      this.messstellenTypeControl.valueChanges.subscribe(() => this.filterMessstellenType());
      this.waterBodyTypeControl.valueChanges.subscribe(() => this.filterWaterBodies());
      this.componentTypeControl.valueChanges.subscribe(() => this.onToggleChange()); // Subscribe to value changes
    }

    async onDropdownWkMstChange(event: any) {
      console.log('Auswahl geändert:', event.value);
      
      // Hier kannst du zusätzliche Logik hinzufügen, die ausgeführt wird, wenn die Auswahl geändert wird.
      if (event.value === 'messstellen') {
        await this.loadMessstellenData();
        console.log('Messstellen wurden ausgewählt');
      } else if (event.value === 'wasserkorper') {
        console.log('Wasserkörper wurden ausgewählt');
        await this.loadWasserkorperData()
      }
    }
      // löst das mousover für die Hilfe aus
      ngAfterViewInit() {
    
        const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
        this.helpService.registerMouseoverEvents();}
  
       
    async ngOnInit() {
      //this.dbMPUebersichtMst = await this.msteditService.fetchDataFromDb(3);
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        
          } else{
      
      this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
        this.helpService.helpText$.subscribe(text => this.helpText = text);
        this.loadWasserkorperData();
        this.loadMessstellenData();
        this.loadKomponentenData();
        // this.stammdatenService.start(true,true);
        await this.anzeigeBewertungService.ngOnInit();
      //console.log(this.uebersichtImport);
          }
    
    }
    onSelectionChange(event) {
      const selectedItems = event.value;
      // const a=this.form.get('selectedItems')?.
      if (selectedItems.length > 0 ) {
        this.form.get('componentType').setValue(['artabundanz']);
      }
    }
    async loadWasserkorperData() {
      await this.stammdatenService.startwk(false, true);
      this.wasserkorper = this.stammdatenService.wkarray;
      this.sortWasserkorper();
      this.filterWaterBodies();
    }
  
    async loadKomponentenData() {
      await this.stammdatenService.callKomponenten();
      
      this.items = this.stammdatenService.komponenten.filter(m => m.id!=6);
    }
  
    async loadMessstellenData() {
      await this.stammdatenService.start(false, true);
      this.messstellen = this.stammdatenService.messstellenarray;
      this.sortMessstellen();
      this.filterMessstellenType();
    }
  
    sortWasserkorper() {
      this.wasserkorper.sort((a, b) => a.wk_name.localeCompare(b.wk_name));
    }
  
    sortMessstellen() {
      this.messstellen.sort((a, b) => a.namemst.localeCompare(b.namemst));
    }
  
    onMessstellenOpen() {
      this.isMessstellenOpen = true;
    }
  
    onMessstellenClose() {
      this.isMessstellenOpen = false;
    }
  
    onWasserkorperOpen() {
      this.isWasserkorperOpen = true;
    }
  
    onWasserkorperClose() {
      this.isWasserkorperOpen = false;
    }
  
    filterMessstellen(filterValue: string) {
      const selectedMessstellenIds = this.form.get('selectedComponents')?.value || [];
      const selectedMessstellen = this.filteredMessstellen.filter(m => selectedMessstellenIds.includes(m.id_mst));
  
      const filteredMessstellen = this.messstellen.filter(m =>
        m.namemst.includes(filterValue)
      );
  
      if (!filterValue) {
        //this.filteredMessstellen = [... this.messstellen];
      } else {
        this.filteredMessstellen = Array.from(new Set([...selectedMessstellen, ...filteredMessstellen]));
      }
    }
   
    filterWasserkorper(filterValue: string) {
      const selectedWasserkorperIds = this.form.get('selectedWasserkorper')?.value || [];
      const selectedWasserkorper = this.filteredWasserkorper.filter(w => selectedWasserkorperIds.includes(w.id));
  
      const filteredWasserkorper = this.wasserkorper.filter(w =>
        w.wk_name.includes(filterValue)
      );
  
      if (!filterValue) {
        this.filteredWasserkorper = [...this.filteredWasserkorper];
      } else {
        this.filteredWasserkorper = Array.from(new Set([...selectedWasserkorper, ...filteredWasserkorper]));
      }
    }
  
    filterWaterBodies() {
      const waterBodyType = this.waterBodyTypeControl.value;
      if (waterBodyType === 'fluss') {
        this.filteredWasserkorper = this.wasserkorper.filter(w => !w.see);
      } else {
        this.filteredWasserkorper = this.wasserkorper.filter(w => w.see);
      }
      this.filterWasserkorper(this.wasserkorperFilterControl.value);
    }
  
    filterMessstellenType() {
      this.selectionCheckbox();
      const messstellenType = this.messstellenTypeControl.value;
      if (messstellenType === 'fluss') {
        this.filteredMessstellen = this.messstellen.filter(m => !m.see);
      } else {
        this.filteredMessstellen = this.messstellen.filter(m => m.see);
      }
      this.filterMessstellen(this.messstellenFilterControl.value);
    }
  
    toggleAllMessstellen(isChecked: boolean): void {
      this.allMessstellenSelected = isChecked;
      this.form.get('selectedComponents').setValue(
        isChecked ? this.filteredMessstellen.map(m => m.id_mst) : []
      );
    }
    toggleAllRepraesented(isChecked: boolean): void {
     let see:boolean=true;
      this.selectionCheckbox();
      const messstellenType = this.messstellenTypeControl.value;
     
      if (messstellenType === 'fluss') {
     see=false}
      this.repraesentativeSelected = isChecked;
    
      // Definiere die ausgewählten Komponenten basierend auf dem Wert von isChecked
      let selectedComponents;
      
      if (isChecked) {
        // Wenn isChecked true ist, filtere nur Objekte mit repraesent = true
        selectedComponents = this.messstellen.filter(m => m.repraesent === true && m.see===see);
        this.filteredMessstellen = selectedComponents;
        // Wenn isChecked true ist, führe toggleAllMessstellen(true) aus
        //this.toggleAllMessstellen(isChecked);
      } else {
        // Wenn isChecked false ist, führe die Funktion filterMessstellenType aus und verwende this.messstellen
        this.filterMessstellenType();  // Ausführen der Funktion
        selectedComponents =  this.filteredMessstellen;
       // this.toggleAllMessstellen(isChecked);
      }
    
      // Setze den Wert des Formularfelds "selectedComponents" mit den gefilterten Daten
      this.form.get('selectedComponents').setValue(selectedComponents);
    
      // Aktualisiere die gefilterten Messstellen
      this.filteredMessstellen = selectedComponents;
    
      // Ausgabe zur Überprüfung
      console.log(selectedComponents);
    }
    
    
    
    
    
    toggleAllKomponenten(isChecked: boolean): void {
      if (isChecked) {
        this.form.get('selectedItems').setValue(this.items.map(item => item.id));
        this.form.get('componentType').setValue(['messstellenbewertung']); // Initialisieren mit "messstellenbewertung"
      } else {
        this.form.get('selectedItems').setValue([]);
        this.form.get('componentType').setValue([]);
      }
      this.allKomponentenSelected = isChecked;
    
    }
    toggleAllWasserkorper(isChecked: boolean): void {
      this.allWasserkorperSelected = isChecked;
      this.form.get('selectedWasserkorper').setValue(
        isChecked ? this.filteredWasserkorper.map(w => w.id) : []
      );
    }
    
    
  
    
    // Hilfsmethode zum Konvertieren von RGB zu HEX
    rgbToHex(rgb: string): string {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase();
    }
   
  
  //
  async onButtonClick(): Promise<void> {
    try {
      this.buttonClicked = true; // Zustand setzen, dass der Button geklickt wurde
  
      const yearFrom = this.form.get('min')?.value;
      const yearTo = this.form.get('max')?.value;
      const dropdownSelection = this.form.get('dropdownSelection')?.value;
      const selectedItems = this.form.get('selectedItems')?.value;
      const componentType = this.form.get('componentType')?.value;
      
      let selectedWasserkorper = this.form.get('selectedWasserkorper')?.value;
      let selectedComponents = this.form.get('selectedComponents')?.value;
      
      // Setze initiale Zustände
      this.resetDisplayFlags();
      this.clearDataStorage();
  
      // Wenn Wasserkörper ausgewählt ist und es keine ausgewählten Komponenten gibt
      if ((!selectedComponents || selectedWasserkorper?.length > 0) && dropdownSelection === 'wasserkorper') {
        // Wenn nur Wasserkörper im Auswahlmenü ausgewählt sind, werden hier die zugeordneten Messstellen abgefragt
        selectedComponents = await this.lueckenfuellenWKMst(selectedWasserkorper);
      }
  
      // 
      if (componentType.includes('messstellenbewertung')) {
        //selectedComponents = this.form.get('selectedComponents')?.value;
        await this.MstBewertungabfragen(selectedComponents, selectedItems, yearTo, yearTo);
        this.selectionCheckbox();
      }
  
      if (this.componentTypeControl.value.includes('wasserkorperbewertung')) {
        if ((!selectedWasserkorper || selectedWasserkorper.length === 0) && dropdownSelection === 'messstellen') {
          selectedComponents = this.form.get('selectedComponents')?.value;
          selectedWasserkorper = await this.lueckenfuellen(selectedComponents);
          this.selectionCheckbox();
        }
        this.BewertungwkUebersicht=[];
        // Hol die Wasserkörperbewertung ab
        this.BewertungwkUebersicht=await this.msteditService.fetchDataFromDbWK(selectedItems,  
          selectedWasserkorper, 
          yearFrom, 
          yearTo
        );
        this.BewertungwkUebersichtleer=true;
        this.WKUebersichtAnzeigen=true;
        console.log('this.BewertungwkUebersicht:', this.BewertungwkUebersicht);
        // await this.WKbewertungfiltern(selectedWasserkorper, yearTo, yearTo);
      }
     
      await this.loadMessstellenData();
      // Prozess abschließen
      this.buttonClicked = false;
  
    } catch (error) {
      // Fehlerbehandlung
      console.error('Es ist ein Fehler aufgetreten:', error);
      this.buttonClicked = false; // Sicherstellen, dass der Zustand auch bei Fehlern zurückgesetzt wird
    }
  }
  

  
  

 
  
selectionCheckbox(){
  if (this.buttonClicked !== true){
   this.filterWasserkorper('');
    this.filterMessstellen('');
  this.messstellenFilterControl.setValue('');
  this.wasserkorperFilterControl.setValue('');
 this.allMessstellenSelected=false;
  this.allWasserkorperSelected=false;
  this.repraesentativeSelected=false;}
 }

  resetDisplayFlags() {
    this.WKUebersichtAnzeigen = false;
    this.BewertungenMstAnzeige = false;
    //this.ArtenAnzeige = false;
  }
  
  clearDataStorage() {
   this.filteredMessstellen=[];
    this.dbMPUebersichtMst = [];
    this.BewertungwkUebersicht = [];
  }
  
  //von Messstellen->Wasserkörper
    async lueckenfuellen(selectedItems:any[]) {
      let selectedWasserkorper1 = [];
  
      if (selectedItems.length > 0 && this.BewertungwkUebersicht.length === 0) {
          const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
            selectedItems.some(criteria => criteria === item.id_mst)
          );
  
          // Extrahieren der 'id_wk' direkt mit 'map'
          selectedWasserkorper1 = messstellenStam.map(item => item.id_wk);
      }
      const uniqueArray = [...new Set(selectedWasserkorper1)];
      return uniqueArray;
  }
  //von Messstellen->Wasserkörper
  async lueckenfuellenWKMst(selectedWasserkorper1:any[]) {
    let selectedItems = [];
  
  
        const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
          selectedWasserkorper1.some(criteria => criteria === item.id_wk)
        );
  
        // Extrahieren der 'id_wk' direkt mit 'map'
        selectedItems = messstellenStam.map(item => item.id_mst);
    
  
    const uniqueArray = [...new Set(selectedItems)];
    return uniqueArray;
  }

  
  
  
  async MstBewertungabfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
    this.anzeigenMstUebersichtService.value='' ;this.anzeigenMstUebersichtService.Artvalue='';
        
    this.BewertungenMstAnzeige=true;
    // importiert MstBewertungen aller ausgewählter komponenten
    
    this.dbMPUebersichtMst=await this.msteditService.fetchDataFromDb(selectedItems,selectedComponents, yearTo);
   console.log('this.dbMPUebersichtMst:', this.dbMPUebersichtMst);
  // console.log('selectedComponents:', selectedComponents);

  
    //  const selectedComponents = this.form.get('selectedComponents')?.value;
    // filtert den Array auf ausgewählte Messstellen
   
    
  //   const filteredArray = this.dbMPUebersichtMst.filter(item => {
  //     const match = selectedComponents.some(selected => Number(selected) === Number(item.idMst));
  //     if (!match) {
  //         // console.log(`No match for item id_mst: ${item.idMst}`);
  //     }
  //     return match;
  // });
  
  // console.log('Filtered Array:', filteredArray);
  
  // Setze das gefilterte Array zurück
  // this.anzeigenMstUebersichtService.dbMPUebersichtMst = filteredArray;
  
  
    // await this.anzeigenMstUebersichtService.filterMst('','',Number(yearFrom),Number(yearTo));
     //this.dbMPUebersichtMst=await this.anzeigenMstUebersichtService.dbMPUebersichtMst;
     //console.log('this.anzeigenMstUebersichtService.dbMPUebersichtMst:', this.anzeigenMstUebersichtService.dbMPUebersichtMst);
     console.log('this.dbMPUebersichtMst:', this.dbMPUebersichtMst);
    
     
  }
 
  
    onToggleChange() {
     
      if (this.componentTypeControl.value.includes("artabundanz")===true){
        console.log('Toggle changed', this.componentTypeControl.value);
        this.form.get('componentType').setValue(['messstellenbewertung']);
      }
      // Implement additional logic here
    }
  }
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }