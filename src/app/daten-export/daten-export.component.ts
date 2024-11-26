import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { StammdatenService } from '../services/stammdaten.service'; 

import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {FarbeBewertungService} from 'src/app/services/farbe-bewertung.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/services/comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { HelpService } from '../services/help.service';
import { AuthService } from '../auth/auth.service';

/**
 * @fileoverview Diese Datei enthält die Implementierung der DatenExportComponent-Klasse, die für die Handhabung der Datenexport-Funktionalitäten in einer Angular-Anwendung verantwortlich ist.
 * 
 * @module DatenExportComponent
 * @description Diese Komponente ermöglicht es Benutzern, verschiedene Arten von Umweltdaten zu filtern, auszuwählen und zu exportieren, einschließlich Gewässerbewertungen, Stationsevaluierungen und Artenhäufigkeiten. Sie bietet Funktionen zum Filtern von Daten nach verschiedenen Kriterien, zum Exportieren von Daten nach Excel und zur Handhabung von Benutzerinteraktionen mit der Benutzeroberfläche.
 * 
 * @requires AuthService
 * @requires DomSanitizer
 * @requires CommentService
 * @requires MatSnackBar
 * @requires HelpService
 * @requires Router
 * @requires FarbeBewertungService
 * @requires AnzeigeBewertungService
 * @requires AnzeigenMstUebersichtService
 * @requires FormBuilder
 * @requires AnzeigeBewertungMPService
 * @requires StammdatenService
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @autor Dr. Jens Päzolt, Umweltsoft 
 */
@Component({
  selector: 'app-daten-export',
  templateUrl: './daten-export.component.html',
  styleUrls: ['./daten-export.component.css']
})

export class DatenExportComponent implements OnInit,AfterViewInit  {
  items = [];
  public props: any[]=[];
  buttonClicked: boolean = false; // Um zu verfolgen, ob der Button geklickt wurde
  BewertungwkUebersicht: WkUebersicht[] = [];
  BewertungwkUebersichtleer:boolean=false;
  WKUebersichtAnzeigen=false;
  BewertungenMstAnzeige=false;
  isLoading = true;
  mstMakrophyten: MstMakrophyten[] = []; // TaxaMP
  ArtenAnzeige = false;
  repraesentativeSelected=false;
  messstellen = [];
  wasserkorper = [];
  filteredMessstellen = [];
  filteredWasserkorper = [];
  
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
    { id: 'artabundanz', komponente: 'Artabundanzen' },
    { id: 'messstellenbewertung', komponente: 'Messstellenbewertung' },
    { id: 'wasserkorperbewertung', komponente: 'Wasserkörperbewertung' }
  ];
  constructor( private authService: AuthService,private sanitizer: DomSanitizer,private commentService: CommentService, private snackBar: MatSnackBar,private helpService: HelpService,private router: Router,private farbeBewertungService:FarbeBewertungService,private anzeigeBewertungService:AnzeigeBewertungService,private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private fb: FormBuilder, private anzeigeBewertungMPService:AnzeigeBewertungMPService,private stammdatenService: StammdatenService) {
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

  /**
   * Handles the change event for the dropdown selection.
   * 
   * This method is triggered when the user changes the selection in the dropdown.
   * It logs the selected value and performs additional logic based on the selected value.
   * 
   * @param event - The event object containing the selected value.
   * 
   * If the selected value is 'messstellen', it loads the Messstellen data.
   * If the selected value is 'wasserkorper', it loads the Wasserkörper data.
   * 
   * @returns A promise that resolves when the data loading is complete.
   */
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
  /**
   * Schaltet die Auswahl aller repräsentativen Komponenten basierend auf dem angegebenen Kontrollkästchenstatus um.
   * 
   * @param {boolean} isChecked - Der Status des Kontrollkästchens, der angibt, ob alle repräsentativen Komponenten ausgewählt werden sollen oder nicht.
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Ruft die Methode `selectionCheckbox` auf.
   * - Überprüft den Wert von `messstellenTypeControl`, um den Typ der Messstellen zu bestimmen.
   * - Setzt die Eigenschaft `repraesentativeSelected` basierend auf dem Parameter `isChecked`.
   * - Filtert das Array `messstellen`, um Komponenten basierend auf dem Status `isChecked` und der Eigenschaft `repraesent` auszuwählen.
   * - Aktualisiert die Eigenschaft `filteredMessstellen` mit den ausgewählten Komponenten.
   * - Setzt den Wert des Formularfelds `selectedComponents` mit den gefilterten Daten.
   * - Protokolliert die ausgewählten Komponenten zur Überprüfung in der Konsole.
   */
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
	  // löst das mousover für die Hilfe aus
	  ngAfterViewInit() {
	
      const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
      this.helpService.registerMouseoverEvents();}


  /**
   * Initialisiert die Komponente.
   * 
   * Diese Methode wird einmal aufgerufen, nachdem die Komponente initialisiert wurde. Sie überprüft, ob der Benutzer eingeloggt ist,
   * und wenn nicht, navigiert sie zur Login-Seite. Wenn der Benutzer eingeloggt ist, abonniert sie die Observables des Hilfe-Dienstes,
   * um den Hilfestatus und -text zu aktualisieren, lädt verschiedene Daten, startet den Stammdaten-Dienst und wartet auf die Initialisierung
   * des anzeigeBewertung-Dienstes.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist.
   */
  async ngOnInit() {
   
    if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
			
        } else{
		
		this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
      this.loadWasserkorperData();
      this.loadMessstellenData();
      this.loadKomponentenData();
      this.stammdatenService.start(true,true);
      await this.anzeigeBewertungService.ngOnInit();
		//console.log(this.uebersichtImport);
        }
  
  }
  /**
   * Behandelt das Auswahländerungsereignis.
   * 
   * @param event - Das Ereignisobjekt, das die ausgewählten Elemente enthält.
   * 
   * Wenn sich die Auswahl ändert, überprüft diese Methode, ob ausgewählte Elemente vorhanden sind.
   * Wenn ja, setzt sie den Wert der 'componentType'-Formsteuerung auf ['artabundanz'].
   */
  onSelectionChange(event) {
    const selectedItems = event.value;
    // const a=this.form.get('selectedItems')?.
    if (selectedItems.length > 0 ) {
      this.form.get('componentType').setValue(['artabundanz']);
    }
  }
  /**
   * Lädt asynchron Wasserkörperdaten, indem die startwk-Methode des StammdatenService aufgerufen wird.
   * Sobald die Daten geladen sind, weist sie das Wasserkörper-Array der wasserkorper-Eigenschaft der Komponente zu,
   * sortiert die Wasserkörper und wendet Filter auf sie an.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Laden und Verarbeiten der Daten abgeschlossen ist.
   */
  async loadWasserkorperData() {
    await this.stammdatenService.startwk(false, true);
    this.wasserkorper = this.stammdatenService.wkarray;
    this.sortWasserkorper();
    this.filterWaterBodies();
  }

  /**
   * Lädt asynchron Komponentendaten, indem die `callKomponenten`-Methode
   * des `stammdatenService` aufgerufen wird. Nachdem die Daten geladen sind,
   * filtert sie die Elemente mit einer `id` von 6 heraus und weist die gefilterten
   * Elemente der `items`-Eigenschaft zu.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Laden und Filtern der Daten abgeschlossen ist.
   */
  async loadKomponentenData() {
    await this.stammdatenService.callKomponenten();
    
    this.items = this.stammdatenService.komponenten.filter(m => m.id!=6);
  }

  /**
   * Lädt die Messstellendaten, indem der Stammdaten-Service gestartet,
   * das Messstellen-Array zugewiesen, die Messstellen sortiert und
   * der Messstellen-Typ gefiltert wird.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten geladen sind.
   */
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
  /**
   * Filtert die Liste der Messstellen basierend auf dem angegebenen Filterwert.
   * 
   * Diese Methode aktualisiert die Eigenschaft `filteredMessstellen` mit einer Liste von Messstellen,
   * die dem Filterwert entsprechen. Wenn kein Filterwert angegeben wird, wird die Eigenschaft `filteredMessstellen`
   * zurückgesetzt, um alle Messstellen einzuschließen.
   * 
   * @param filterValue - Der Wert, nach dem die Messstellen gefiltert werden sollen. Wenn leer, werden alle Messstellen einbezogen.
   */
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

  /**
   * Filtert die Liste der 'wasserkorper' basierend auf dem angegebenen Filterwert.
   * 
   * Diese Methode aktualisiert die Eigenschaft `filteredWasserkorper` mit den gefilterten Ergebnissen.
   * Wenn der Filterwert leer ist, wird die aktuelle gefilterte Liste beibehalten.
   * Andernfalls kombiniert sie die ausgewählten 'wasserkorper' mit den gefilterten Ergebnissen
   * und entfernt Duplikate.
   * 
   * @param filterValue - Der Wert, der verwendet wird, um die 'wasserkorper'-Liste nach ihren Namen zu filtern.
   */
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

  /**
   * Filtert die Wasserkörper basierend auf dem ausgewählten Wasserkörpertyp.
   * Wenn der ausgewählte Typ 'fluss' ist, werden alle Wasserkörper, die Seen sind, herausgefiltert.
   * Andernfalls werden alle Wasserkörper herausgefiltert, die keine Seen sind.
   * Nach dem Filtern nach Typ wird ein zusätzlicher Filter basierend auf dem Wert der Wasserkörper-Filtersteuerung angewendet.
   */
  filterWaterBodies() {
    const waterBodyType = this.waterBodyTypeControl.value;
    if (waterBodyType === 'fluss') {
      this.filteredWasserkorper = this.wasserkorper.filter(w => !w.see);
    } else {
      this.filteredWasserkorper = this.wasserkorper.filter(w => w.see);
    }
    this.filterWasserkorper(this.wasserkorperFilterControl.value);
  }

  /**
   * Filtert die Liste der Messstellen basierend auf dem ausgewählten Messstellen-Typ.
   * Wenn der ausgewählte Typ 'fluss' ist, werden alle Messstellen, die als 'see' markiert sind, herausgefiltert.
   * Andernfalls werden alle Messstellen herausgefiltert, die nicht als 'see' markiert sind.
   * Nach dem Filtern nach Typ wird ein zusätzlicher Filter basierend auf dem Wert der Messstellen-Filtersteuerung angewendet.
   */
  filterMessstellenType() {
    this.selectionCheckbox();
    const messstellenType = this.messstellenTypeControl.value;
    this.filteredMessstellen =[];
    if (messstellenType === 'fluss') {
      this.filteredMessstellen = this.messstellen.filter(m => !m.see);
    } else {
      this.filteredMessstellen = this.messstellen.filter(m => m.see);
    }
    this.filterMessstellen(this.messstellenFilterControl.value);
  }

  /**
   * Schaltet die Auswahl aller "Messstellen" (Messpunkte) um.
   * 
   * @param isChecked - Ein boolescher Wert, der angibt, ob alle "Messstellen" ausgewählt (true) oder abgewählt (false) werden sollen.
   */
  toggleAllMessstellen(isChecked: boolean): void {
    this.allMessstellenSelected = isChecked;
    this.form.get('selectedComponents').setValue(
      isChecked ? this.filteredMessstellen.map(m => m.id_mst) : []
    );
  }
  /**
   * Schaltet die Auswahl aller Komponenten um.
   * 
   * Wenn `isChecked` wahr ist, werden alle Elemente ausgewählt und der Komponententyp mit "Artabundanz" initialisiert.
   * Wenn `isChecked` falsch ist, wird die Auswahl der Elemente und Komponententypen gelöscht.
   * 
   * @param {boolean} isChecked - Ein boolescher Wert, der angibt, ob alle Komponenten ausgewählt oder abgewählt werden sollen.
   * @returns {void}
   */
  toggleAllKomponenten(isChecked: boolean): void {
    if (isChecked) {
      this.form.get('selectedItems').setValue(this.items.map(item => item.id));
      this.form.get('componentType').setValue(['artabundanz']); // Initialisieren mit "Artabundanz"
    } else {
      this.form.get('selectedItems').setValue([]);
      this.form.get('componentType').setValue([]);
    }
    this.allKomponentenSelected = isChecked;
  
  }
  /**
   * Schaltet die Auswahl aller 'Wasserkorper'-Elemente um.
   * 
   * @param isChecked - Ein boolescher Wert, der angibt, ob alle 'Wasserkorper'-Elemente ausgewählt oder abgewählt werden sollen.
   * 
   * Wenn `isChecked` wahr ist, werden alle 'Wasserkorper'-Elemente ausgewählt und ihre IDs in der Formularsteuerung gesetzt.
   * Wenn `isChecked` falsch ist, werden alle 'Wasserkorper'-Elemente abgewählt und die Formularsteuerung wird geleert.
   */
  toggleAllWasserkorper(isChecked: boolean): void {
    this.allWasserkorperSelected = isChecked;
    this.form.get('selectedWasserkorper').setValue(
      isChecked ? this.filteredWasserkorper.map(w => w.id) : []
    );
  }
  
  

  
  // Hilfsmethode zum Konvertieren von RGB zu HEX
  /**
   * Konvertiert einen RGB-Farbstring in seine hexadezimale Darstellung.
   *
   * @param rgb - Der RGB-Farbstring im Format 'rgb(r, g, b)', wobei r, g und b Ganzzahlen sind.
   * @returns Der hexadezimale Farbstring im Format 'RRGGBB'.
   */
  rgbToHex(rgb: string): string {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase();
  }
 
  /**
   * Exportiert Daten in eine Excel-Datei mit mehreren Blättern.
   * 
   * Die Methode erstellt eine neue Arbeitsmappe und fügt mehrere Blätter basierend auf den verfügbaren Daten hinzu:
   * - Wasserkörperbewertung
   * - Messstellenbewertung
   * - Messwerte
   * - Stammdaten_Messstellen
   * 
   * Jedes Blatt wird mit Daten und Überschriften gefüllt, und die Spaltenbreiten werden an den Inhalt angepasst.
   * Bestimmte Spalten im Blatt 'Wasserkörperbewertung' werden basierend auf ihren Werten mit Hintergrundfarben formatiert.
   * 
   * Die endgültige Arbeitsmappe wird in einen Binärstring geschrieben und als Excel-Datei mit der FileSaver-Bibliothek gespeichert.
   * 
   * @param event - Das Ereignisobjekt der auslösenden Aktion, das verwendet wird, um das Standardverhalten der Formularübermittlung zu verhindern.
   */
  exportToExcel(event: Event): void {
    event.preventDefault();
  
const formattedDate = formatDate(new Date());
    // Create a new workbook
const wb: XLSX.WorkBook = XLSX.utils.book_new();
// Bewertung Wasserkörper=>Excel
if (this.BewertungwkUebersicht.length > 0) {
  const worksheetData = this.BewertungwkUebersicht.map(item => Object.values(item));
  const headers = Object.keys(this.BewertungwkUebersicht[0]);
  const exportData = [headers, ...worksheetData];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

  const colWidths = exportData[0].map((_, colIndex) => {
    return {
      wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
    };
  });
  ws['!cols'] = colWidths;

  const columnsToIterate = ['OKZ_QK_P', 'OKZ_TK_MP', 'OKZ_TK_Dia', 'OKZ_QK_MZB', 'OKZ_QK_F', 'OKZ'];
  const columnIndexes = columnsToIterate.map(header => headers.indexOf(header));

  for (let R = 1; R <= worksheetData.length; ++R) {
    for (let C of columnIndexes) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      let cell = ws[cellAddress];

      if (!cell) {
        // Initialize cell if it doesn't exist
        cell = { t: 's', v: '' };
        ws[cellAddress] = cell;
      }
      const value = cell.v;
      let bgColor = '';

      // Change the background color based on the value
      if (headers[C] === 'OKZ_QK_P' || headers[C] === 'OKZ_TK_MP' || headers[C] === 'OKZ_TK_Dia' || headers[C] === 'OKZ_QK_MZB' || headers[C] === 'OKZ_QK_F' || headers[C] === 'OKZ') {
        bgColor = this.farbeBewertungService.getColor(value);
      }

      if (bgColor) {
        const [r, g, b] = bgColor.match(/\d+/g).map(Number); // Extract RGB values
        const hexColor = ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase(); // Convert to hex
        cell.s = {
          fill: {
            fgColor: { rgb: hexColor }
          }
        };
      }
    }
  }
  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Wasserkörperbewertung');


}
//MstBewertung =>Excel

if (this.anzeigenMstUebersichtService.dbMPUebersichtMst != null){ 
  if (this.anzeigenMstUebersichtService.dbMPUebersichtMst.length>0){  
    // Map data to array of arrays for xlsx
    const worksheetData = this.anzeigenMstUebersichtService.dbMPUebersichtMst.map(item => [
      
      item.wkName,
      item.namemst,
      item.komponente,
      item.parameter,
      item.jahr,
      item.wert,
      item.expertenurteil

    ]);   // Add headers
    const headers = [
        'Wasserkörper',
        'Messstelle',
        'Komponente',
        'Parameter',
        'Untersuchungsjahr',
        'Wert',
        'Expertenurteil',
          
    ];
    
 
    // Combine headers and data
    const exportData = [headers, ...worksheetData];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths to fit content
    const colWidths = exportData[0].map((_, colIndex) => {
        return {
            wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
        };
    });
    ws['!cols'] = colWidths;

    // Create a new workbook
   

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Messstellenbewertung');

  
}}
//Abundanzen=> Excel
if (this.mstMakrophyten.length>0){
    // Map data to array of arrays for xlsx
    const worksheetData = this.mstMakrophyten.map(item => [
        item.gewaessername,
        item.mst,
        item.jahr,
        item.taxon,
        item.dvnr,
        item.wert,
        item.taxonzusatz,
        item.firma,
        item.roteListeD,
        item.cf,
        item.tiefe_m,
        item.einheit,
        item.komponente
        
    ]);

    // Add headers
    const headers = [
        'Gewässername',
        'Messstelle',
        'Untersuchungsjahr',
        'Taxon (DVNr)',
        'DVNR',
        'Wert',
        'Taxonzusatz',
        'Probenehmer',
        'Rote Liste D',
        'CF',
        'Tiefe (m)',
        'Einheit',
        'Komponente',
        
    ];

    // Combine headers and data
    const exportData = [headers, ...worksheetData];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
  // Set column widths to fit content
  const colWidths = exportData[0].map((_, colIndex) => {
    return {
        wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
    };
});
ws['!cols'] = colWidths;


    

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Messwerte');

    // Write workbook to binary string
  
  }

//Stammdaten Messstellen exportieren

if (this.mstMakrophyten.length>0 || this.anzeigenMstUebersichtService.dbMPUebersichtMst!=null ){

  const selectedComponents = this.form.get('selectedComponents')?.value;
  // const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
  //   selectedComponents.some(criteria => criteria === item.id_mst)
  // );
  const worksheetData = this.stammdatenService.messstellenarray.filter(item => 
    selectedComponents.some(criteria => criteria === item.id_mst)).map(item => [
    item.gewaessername,
    item.namemst,
    item.hw_etrs,
    item.rw_etrs,
    item.see ? 1 : 0 // Wenn item.see true ist, setze 1, sonst 0
    
]);

// Add headers
const headers = [
    'Gewässername',
    'Messstelle',
    'Hochwert (etrs)',
    'Rechtswert (etrs)',
    'See (1) oder Fließgewässer (0)',
    
];

// Combine headers and data
const exportData = [headers, ...worksheetData];

// Convert data to worksheet
const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
// Set column widths to fit content
const colWidths = exportData[0].map((_, colIndex) => {
return {
    wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
};
});
ws['!cols'] = colWidths;




// Append worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Stammdaten_Messstellen');

// Write workbook to binary string
}

if (this.mstMakrophyten.length>0 || this.anzeigenMstUebersichtService.dbMPUebersichtMst!=null  || this.BewertungwkUebersicht!=null )
  {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary string
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Use FileSaver to save the file
    saveAs(blob, 'DatenBioLims' + formattedDate +'.xlsx');}
}

//Abfrage Ergebnisse
/**
 * Behandelt das Klickereignis des Buttons, um Datenexportoperationen durchzuführen.
 * 
 * Diese Methode führt die folgenden Schritte aus:
 * 1. Setzt den Ladezustand auf true.
 * 2. Ruft Formularwerte für den Jahresbereich, die Dropdown-Auswahl, ausgewählte Elemente, den Komponententyp,
 *    ausgewählte Wasserkörper und ausgewählte Komponenten ab.
 * 3. Setzt Anzeigeflags zurück und löscht den Datenspeicher.
 * 4. Abhängig von der Dropdown-Auswahl und den ausgewählten Komponenten ruft sie zugehörige Messpunkte ab.
 * 5. Basierend auf dem Komponententyp führt sie verschiedene Datenabfrageoperationen durch:
 *    - Ruft Artabundanzdaten ab, wenn "artabundanz" ausgewählt ist.
 *    - Ruft Messstellenbewertungsdaten ab, wenn "messstellenbewertung" ausgewählt ist.
 *    - Ruft Wasserkörperbewertungsdaten ab, wenn "wasserkorperbewertung" ausgewählt ist.
 * 6. Behandelt alle Fehler, die während des Datenabfrageprozesses auftreten.
 * 7. Setzt den Ladezustand auf false zurück.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Datenabfrageoperationen abgeschlossen sind.
 */
async onButtonClick() {
  this.isLoading = true;
  try{
  const yearFrom = this.form.get('min').value;
  const yearTo = this.form.get('max').value;
  const dropdownSelection = this.form.get('dropdownSelection')?.value;
  const selectedItems = this.form.get('selectedItems')?.value;
  const componentType = this.form.get('componentType')?.value;
  
  let selectedWasserkorper = this.form.get('selectedWasserkorper')?.value;
 let  selectedComponents = this.form.get('selectedComponents')?.value;

  this.resetDisplayFlags();
  this.clearDataStorage();


 if ((!selectedComponents || selectedWasserkorper.length > 0) && dropdownSelection==='wasserkorper') {
    //wenn nur Wasserkörper im Auswahlmenü ausgewählt sind werden hier die zugeordneten Messstellen abgefragt
     selectedComponents = await this.lueckenfuellenWKMst(selectedWasserkorper);
    //  await this.ArtabundanzenAbfragen(selectedComponents,selectedItems, yearFrom, yearTo);
    //  await this.MstBewertungabfragen(selectedComponents,selectedItems, yearFrom, yearTo);
   }


  if (this.componentTypeControl.value.includes("artabundanz")) {
     
      await this.ArtabundanzenAbfragen(selectedComponents,selectedItems, yearFrom, yearTo);
  } 

  if (this.componentTypeControl.value.includes("messstellenbewertung")) {
    selectedComponents = this.form.get('selectedComponents')?.value;
      await this.MstBewertungabfragen(selectedComponents,selectedItems, yearFrom, yearTo);
  }

  if (this.componentTypeControl.value.includes("wasserkorperbewertung")) {
  
    if ((!selectedWasserkorper || selectedWasserkorper.length === 0) && dropdownSelection==='messstellen') {
      selectedComponents = this.form.get('selectedComponents')?.value;
        selectedWasserkorper = await this.lueckenfuellen(selectedComponents);
    }
     selectedComponents = this.form.get('selectedComponents')?.value;
  
    
      await this.WKbewertungabfragen(selectedWasserkorper, yearFrom, yearTo);
  }} catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    // Hier können Sie zusätzliche Fehlerbehandlungslogik hinzufügen
  } finally {
    this.isLoading = false;
  }
  this.isLoading = false;
}

/**
 * Setzt die Anzeigeflags für verschiedene Komponenten auf false zurück.
 * Diese Methode setzt die folgenden Flags auf false:
 * - WKUebersichtAnzeigen
 * - BewertungenMstAnzeige
 * - ArtenAnzeige
 */
resetDisplayFlags() {
  this.WKUebersichtAnzeigen = false;
  this.BewertungenMstAnzeige = false;
  this.ArtenAnzeige = false;
}
/**
 * Löscht den Datenspeicher, indem die folgenden Arrays auf leer gesetzt werden:
 * - mstMakrophyten
 * - props
 * - BewertungwkUebersicht
 */
clearDataStorage() {
  this.mstMakrophyten = [];
  this.props = [];
  this.BewertungwkUebersicht = [];
}

//von Messstellen->Wasserkörper
  /**
   * Füllt Lücken in den ausgewählten Elementen, indem eindeutige 'id_wk'-Werte aus dem 'messstellenarray' extrahiert werden.
   * 
   * @param {any[]} selectedItems - Ein Array ausgewählter Elemente.
   * @returns {Promise<any[]>} - Ein Promise, das ein Array eindeutiger 'id_wk'-Werte zurückgibt.
   * 
   * Die Funktion führt die folgenden Schritte aus:
   * 1. Initialisiert ein leeres Array `selectedWasserkorper1`.
   * 2. Überprüft, ob `selectedItems` Elemente enthält und `BewertungwkUebersicht` leer ist.
   * 3. Filtert `messstellenarray`, um Elemente zu finden, die den `selectedItems`-Kriterien entsprechen.
   * 4. Mappt die gefilterten Elemente, um ihre 'id_wk'-Werte zu extrahieren.
   * 5. Erstellt ein eindeutiges Array von 'id_wk'-Werten mithilfe eines Sets.
   * 6. Gibt das eindeutige Array zurück.
   */
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
/**
 * Füllt Lücken in den Messstellen basierend auf den ausgewählten Wasserkörpern.
 * 
 * @param selectedWasserkorper1 - Ein Array ausgewählter Wasserkörper-IDs.
 * @returns Ein Promise, das ein Array eindeutiger Messstellen-IDs zurückgibt.
 */
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
/**
 * Fragt Artendaten basierend auf den ausgewählten Komponenten, Elementen und dem Jahresbereich ab und verarbeitet sie.
 * 
 * @param selectedComponents - Die für die Abfrage ausgewählten Komponenten.
 * @param selectedItems - Die für die Abfrage ausgewählten Elemente.
 * @param yearFrom - Das Startjahr für die Abfrage als Zeichenkette.
 * @param yearTo - Das Endjahr für die Abfrage als Zeichenkette.
 * @returns Ein Promise, das aufgelöst wird, wenn die Daten abgefragt und verarbeitet wurden.
 */
async ArtabundanzenAbfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
  this.anzeigeBewertungMPService.mstMakrophyten=[];
  // 
 await this.stammdatenService.queryArten('messstellen', selectedComponents, Number(yearFrom), Number(yearTo), selectedItems).forEach(
    data => {
         
      // Assign data to the service property
      this.anzeigeBewertungMPService.dbBewertungMst = data;
    });
  
this.anzeigeBewertungMPService.arrayNeuFuellen(0);
    this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
    this.ArtenAnzeige=true;

}



/**
 * Ruft MstBewertungen für die ausgewählten Komponenten und Elemente im angegebenen Jahresbereich ab und verarbeitet sie.
 * 
 * @param selectedComponents - Ein Array von ausgewählten Komponenten-IDs.
 * @param selectedItems - Ein Array von ausgewählten Element-IDs.
 * @param yearFrom - Das Startjahr für den Datenbereich.
 * @param yearTo - Das Endjahr für den Datenbereich.
 * 
 * Diese Methode führt die folgenden Schritte aus:
 * 1. Setzt die Werte im `anzeigenMstUebersichtService` zurück.
 * 2. Setzt `BewertungenMstAnzeige` auf true.
 * 3. Ruft `callBwUebersichtExp` auf, um MstBewertungen für die ausgewählten Elemente zu importieren.
 * 4. Filtert die importierten Daten, um nur die ausgewählten Komponenten einzuschließen.
 * 5. Ruft `filterMst` auf, um die Daten weiter nach dem angegebenen Jahresbereich zu filtern.
 * 6. Sortiert und verarbeitet die gefilterten Daten.
 * 7. Aktualisiert das `props`-Array mit den verarbeiteten Daten.
 */
async MstBewertungabfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
  this.anzeigenMstUebersichtService.value='' ;this.anzeigenMstUebersichtService.Artvalue='';
      
  this.BewertungenMstAnzeige=true;
  // importiert MstBewertungen aller ausgewählter komponenten
  
    await this.anzeigenMstUebersichtService.callBwUebersichtExp(selectedItems);
  
console.log(this.anzeigenMstUebersichtService.dbMPUebersichtMst)
  // const selectedComponents = this.form.get('selectedComponents')?.value;
  // filtert den Array auf ausgewählte Messstellen
 
  
  const filteredArray = this.anzeigenMstUebersichtService.dbMPUebersichtMst.filter(item => {
    const match = selectedComponents.some(selected => Number(selected) === Number(item.idMst));
    if (!match) {
        console.log(`No match for item id_mst: ${item.idMst}`);
    }
    return match;
});

console.log('Filtered Array:', filteredArray);

// Setze das gefilterte Array zurück
this.anzeigenMstUebersichtService.dbMPUebersichtMst = filteredArray;


   await this.anzeigenMstUebersichtService.filterMst('','',Number(yearFrom),Number(yearTo));
  
     this.anzeigenMstUebersichtService.uniqueMstSortCall();
     this.anzeigenMstUebersichtService.uniqueJahrSortCall();
       this.anzeigenMstUebersichtService.datenUmwandeln();
      this.anzeigenMstUebersichtService.erzeugeDisplayedColumnNames(true);
       this.anzeigenMstUebersichtService.erzeugeDisplayColumnNames(true);
  
  
  this.props.push(this.anzeigenMstUebersichtService.mstUebersicht) ;
  this.props.push(this.anzeigenMstUebersichtService.displayColumnNames);
  this.props.push(this.anzeigenMstUebersichtService.displayedColumns);
}

/**
   * Filtert und aktualisiert das `BewertungwkUebersicht`-Array basierend auf den ausgewählten Wasserkörpern und dem angegebenen Jahresbereich.
   * 
   * @param selectedWasserkorper - Ein Array ausgewählter Wasserkörper-IDs.
   * @param yearFrom - Das Startjahr des Filterbereichs als Zeichenkette.
   * @param yearTo - Das Endjahr des Filterbereichs als Zeichenkette.
   * 
   * Die Methode führt die folgenden Schritte aus:
   * 1. Initialisiert `filteredArray` und leert `BewertungwkUebersicht`.
   * 2. Überprüft, ob ausgewählte Wasserkörper vorhanden sind.
   * 3. Wenn nur ein Wasserkörper ausgewählt ist und dieser nicht 17 ist, oder wenn mehrere Wasserkörper ausgewählt sind:
   *    - Filtert `anzeigeBewertungService.wkUebersicht` basierend auf den ausgewählten Wasserkörpern.
   *    - Filtert das Ergebnis weiter basierend auf dem angegebenen Jahresbereich.
   * 4. Aktualisiert `BewertungwkUebersicht` mit den gefilterten Ergebnissen.
   * 5. Setzt `BewertungwkUebersichtleer` auf true, wenn gefilterte Ergebnisse vorhanden sind, andernfalls auf false.
   * 6. Setzt `WKUebersichtAnzeigen` auf true, um anzuzeigen, dass die Übersicht angezeigt werden soll.
   */
   WKbewertungabfragen(selectedWasserkorper: any[],yearFrom:string,yearTo:string) {
    let filteredArray: any[] = [];
    this.BewertungwkUebersicht = [];
    this.BewertungwkUebersichtleer=false;
    if (selectedWasserkorper.length > 0) {
        if ((selectedWasserkorper.length === 1 && selectedWasserkorper[0] !== 17) || selectedWasserkorper.length > 1) {

          filteredArray =  this.anzeigeBewertungService.wkUebersicht.filter(item => 
            selectedWasserkorper.some(criteria => criteria === item.idwk)
          );
          this.BewertungwkUebersicht = filteredArray.filter(item => item.Jahr >= Number(yearFrom) && item.Jahr <= Number(yearTo));
          // this.BewertungwkUebersicht = filteredArray;
        }
    }

    // Setze das gefilterte Array zurück
    if (filteredArray.length>0){ this.BewertungwkUebersichtleer=true;}else{this.BewertungwkUebersichtleer=false;}
    this.WKUebersichtAnzeigen = true;
}


  /**
     * Behandelt das Umschalt-Ereignis.
     * 
     * Diese Methode wird ausgelöst, wenn sich der Umschaltzustand ändert. Sie überprüft, 
     * ob der Wert von `componentTypeControl` "artabundanz" enthält und protokolliert 
     * den Wert in der Konsole, wenn dies der Fall ist.
     * 
     * @remarks
     * Zusätzliche Logik kann bei Bedarf in dieser Methode implementiert werden.
     */
  onToggleChange() {
   
    if (this.componentTypeControl.value.includes("artabundanz")===true){
      console.log('Toggle changed', this.componentTypeControl.value);
    }
    // Implement additional logic here
  }
}
/**
 * Formatiert ein gegebenes Date-Objekt in einen String im Format "DD.MM.YYYY".
 *
 * @param {Date} date - Das zu formatierende Datum.
 * @returns {string} Der formatierte Datumsstring.
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}