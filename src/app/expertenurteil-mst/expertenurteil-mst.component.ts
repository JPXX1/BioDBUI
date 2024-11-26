import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { StammdatenService } from '../services/stammdaten.service'; 
//import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import {MstMitExpertenurteil} from 'src/app/interfaces/mst-mit-expertenurteil';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
// import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
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
/**
 * Die Klasse `ExpertenurteilMstComponent` ist verantwortlich für die Verwaltung der Expertenurteil-Oberfläche
 * in der Anwendung. Sie behandelt die Initialisierung, das Laden von Daten, das Filtern und die Benutzerinteraktionen
 * im Zusammenhang mit dem Expertenurteil von Messstellen und Wasserkörpern.
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
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

    /**
     * Behandelt das Änderungsereignis für die Dropdown-Auswahl.
     * 
     * Diese Methode wird ausgelöst, wenn sich die Dropdown-Auswahl ändert. Sie protokolliert die neue Auswahl
     * und führt zusätzliche Logik basierend auf dem ausgewählten Wert aus. Wenn der ausgewählte Wert 
     * 'messstellen' ist, lädt sie die Daten für 'messstellen'. Wenn der ausgewählte Wert 'wasserkorper' ist,
     * lädt sie die Daten für 'wasserkorper'.
     * 
     * @param event - Das Ereignisobjekt, das den neuen Auswahlwert enthält.
     * @returns Ein Promise, das aufgelöst wird, wenn die erforderlichen Daten basierend auf der Auswahl geladen wurden.
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
      // löst das mousover für die Hilfe aus
      /**
       * Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
       * Diese Methode wird verwendet, um Mouseover-Ereignisse auf Elementen mit der Klasse 'helpable' zu registrieren.
       * Sie durchsucht das DOM nach allen Elementen mit der Klasse 'helpable' und registriert Mouseover-Ereignisse
       * mithilfe des helpService.
       *
       * @memberof ExpertenurteilMstComponent
       */
      ngAfterViewInit() {
    
        const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
        this.helpService.registerMouseoverEvents();}
  
       
    /**
     * Initialisiert die Komponente.
     * 
     * Diese Methode wird aufgerufen, sobald die Komponente initialisiert ist. Sie führt folgende Aktionen aus:
     * - Überprüft, ob der Benutzer eingeloggt ist. Falls nicht, wird zur Login-Seite navigiert.
     * - Abonniert die Observables des Hilfeservices, um den Hilfetext und den aktiven Status zu aktualisieren.
     * - Lädt Daten für Wasserkörper, Messstellen und Komponenten.
     * - Ruft die `ngOnInit` Methode des `anzeigeBewertungService` auf.
     * 
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist.
     */
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
    /**
     * Behandelt das Auswahländerungsereignis.
     * 
     * @param event - Das Ereignisobjekt, das die ausgewählten Elemente enthält.
     * 
     * Wenn es ausgewählte Elemente gibt, setzt es den Wert der 'componentType' Formsteuerung auf ['artabundanz'].
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
     * Nach dem Laden der Daten weist es das Wasserkörper-Array der wasserkorper-Eigenschaft der Komponente zu,
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
     * Lädt asynchron Komponentendaten, indem die Methode `callKomponenten` 
     * vom `stammdatenService` aufgerufen wird. Nachdem die Daten geladen wurden,
     * filtert es Elemente mit einer `id` von 6 heraus und weist die verbleibenden
     * Elemente der Eigenschaft `items` zu.
     *
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten geladen und gefiltert sind.
     */
    async loadKomponentenData() {
      await this.stammdatenService.callKomponenten();
      
      this.items = this.stammdatenService.komponenten.filter(m => m.id!=6);
    }
  
    /**
     * Lädt asynchron Messstellendaten, indem der Stammdaten-Service gestartet wird,
     * weist dann das Messstellen-Array vom Service der Messstellen-Eigenschaft der Komponente zu,
     * sortiert die Messstellen und filtert sie nach Typ.
     *
     * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Laden, Sortieren und Filtern der Daten abgeschlossen ist.
     */
    async loadMessstellenData() {
      await this.stammdatenService.start(false, true);
      this.messstellen = this.stammdatenService.messstellenarray;
      this.sortMessstellen();
      this.filterMessstellenType();
    }
  
    /**
     * Sortiert das `wasserkorper` Array basierend auf der `wk_name` Eigenschaft seiner Elemente.
     * Die Sortierung erfolgt aufsteigend unter Verwendung eines lokalen Vergleichs.
     */
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
     * die dem Filterwert entsprechen. Wenn kein Filterwert angegeben wird, behält sie die 
     * zuvor ausgewählten Messstellen bei.
     * 
     * @param filterValue - Der Wert, nach dem die Messstellen gefiltert werden sollen. Wenn leer, 
     *                      behält die Methode die zuvor ausgewählten Messstellen bei.
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
     * Wenn kein Filterwert angegeben wird, behält sie die aktuellen `filteredWasserkorper` bei.
     * 
     * @param filterValue - Der Wert, nach dem die 'wasserkorper' anhand ihres `wk_name` gefiltert werden sollen.
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
     * Filtert die Messstellen basierend auf dem ausgewählten Messstellen-Typ.
     * Wenn der ausgewählte Typ 'fluss' ist, werden alle Messstellen herausgefiltert, die als 'see' markiert sind.
     * Andernfalls werden alle Messstellen herausgefiltert, die nicht als 'see' markiert sind.
     * Nach dem Filtern nach Typ wird ein zusätzlicher Filter basierend auf dem aktuellen Wert der messstellenFilterControl angewendet.
     */
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
     * Schaltet die Auswahl aller repräsentativen Komponenten basierend auf dem angegebenen Kontrollkästchenzustand um.
     * 
     * @param {boolean} isChecked - Der Zustand des Kontrollkästchens, der angibt, ob alle repräsentativen Komponenten ausgewählt werden sollen oder nicht.
     * 
     * Diese Methode führt die folgenden Aktionen aus:
     * - Ruft die Methode `selectionCheckbox` auf.
     * - Bestimmt den Typ der Messpunkte (`messstellenType`) und setzt die Sichtbarkeit (`see`) entsprechend.
     * - Setzt die Eigenschaft `repraesentativeSelected` basierend auf dem Wert von `isChecked`.
     * - Filtert das `messstellen`-Array, um nur repräsentative Komponenten (`repraesent = true`) einzuschließen, und aktualisiert die Eigenschaft `filteredMessstellen`.
     * - Wenn `isChecked` false ist, ruft es die Methode `filterMessstellenType` auf, um die Eigenschaft `filteredMessstellen` zu aktualisieren.
     * - Aktualisiert die Formularsteuerung `selectedComponents` mit den gefilterten Komponenten.
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
    
    
    
    
    
    /**
     * Schaltet die Auswahl aller Komponenten um.
     * 
     * Wenn `isChecked` wahr ist, werden alle Elemente ausgewählt und der Komponententyp auf "messstellenbewertung" gesetzt.
     * Wenn `isChecked` falsch ist, wird die Auswahl gelöscht und der Komponententyp zurückgesetzt.
     * 
     * @param {boolean} isChecked - Gibt an, ob alle Komponenten ausgewählt oder abgewählt werden sollen.
     * @returns {void}
     */
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
    /**
     * Schaltet die Auswahl aller 'Wasserkörper' Elemente um.
     * 
     * @param isChecked - Ein boolescher Wert, der angibt, ob alle 'Wasserkörper' Elemente ausgewählt oder abgewählt werden sollen.
     *                    Wenn true, werden alle Elemente ausgewählt; wenn false, werden alle Elemente abgewählt.
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
     * @param rgb - Der RGB-Farbstring im Format "rgb(r, g, b)", wobei r, g und b Ganzzahlen sind.
     * @returns Der hexadezimale Farbstring im Format "RRGGBB".
     */
   
    rgbToHex(rgb: string): string {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase();
    }
   
  
  //
  /**
   * Behandelt das Klickereignis des Buttons und führt verschiedene Operationen basierend auf den Formulareingaben aus.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operationen abgeschlossen sind.
   * 
   * @throws Protokolliert eine Fehlermeldung in der Konsole, wenn eine Operation fehlschlägt.
   * 
   * Die Methode führt die folgenden Schritte aus:
   * 1. Setzt den Zustand buttonClicked auf true.
   * 2. Ruft Werte aus dem Formular für den Jahresbereich, die Dropdown-Auswahl, ausgewählte Elemente, den Komponententyp,
   *    ausgewählte Wasserkörper und ausgewählte Komponenten ab.
   * 3. Setzt Anzeigeflags zurück und löscht den Datenspeicher.
   * 4. Wenn Wasserkörper ausgewählt sind und keine Komponenten ausgewählt sind, werden zugehörige Messstellen abgefragt.
   * 5. Wenn der Komponententyp 'messstellenbewertung' enthält, werden Messstellenbewertungen abgefragt und das Auswahlkästchen aktualisiert.
   * 6. Wenn der Komponententyp 'wasserkorperbewertung' enthält, werden Wasserkörperbewertungen abgefragt und die Anzeigeflags aktualisiert.
   * 7. Lädt Messstellendaten.
   * 8. Setzt den Zustand buttonClicked nach Abschluss oder Fehler auf false zurück.
   */
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
        // console.log('this.BewertungwkUebersicht:', this.BewertungwkUebersicht);
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
  

  
  

 
  
/**
 * Handles the selection checkbox logic. If the button has not been clicked,
 * it resets the filters for 'Wasserkorper' and 'Messstellen' to their default values,
 * clears the filter controls, and sets the selection flags for 'Messstellen', 
 * 'Wasserkorper', and 'Repraesentative' to false.
 */

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
   * Setzt die Anzeigeflags für verschiedene UI-Komponenten auf ihren Standardzustand zurück.
   * 
   * Diese Methode setzt die folgenden Flags auf `false`:
   * - `WKUebersichtAnzeigen`: Flag zur Anzeige der WK-Übersicht.
   * - `BewertungenMstAnzeige`: Flag zur Anzeige der MST-Bewertungen.
   * - `ArtenAnzeige`: Flag zur Anzeige der Arten (derzeit auskommentiert).
   */
  
  resetDisplayFlags() {
    this.WKUebersichtAnzeigen = false;
    this.BewertungenMstAnzeige = false;
    //this.ArtenAnzeige = false;
  }
  
  /**
   * Löscht den Datenspeicher, indem die gefilterten Messstellen,
   * die MPU-Übersichtsliste und die Bewertungsübersichtsliste auf leere Arrays zurückgesetzt werden.
   */
  
  clearDataStorage() {
   this.filteredMessstellen=[];
    this.dbMPUebersichtMst = [];
    this.BewertungwkUebersicht = [];
  }
  
  //von Messstellen->Wasserkörper
    /**
     * Füllt Lücken in den ausgewählten Elementen, indem eindeutige 'id_wk'-Werte aus dem messstellenarray extrahiert werden.
     * 
     * @param selectedItems - Ein Array ausgewählter Elemente, die verarbeitet werden sollen.
     * @returns Ein Promise, das ein Array eindeutiger 'id_wk'-Werte zurückgibt.
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
   * Füllt Lücken in der Wasserkörperauswahl, indem die Messstellen gefiltert und abgebildet werden.
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
   * Ruft die MstBewertungen für die ausgewählten Komponenten und Elemente innerhalb des angegebenen Jahresbereichs ab und zeigt sie an.
   * 
   * @param selectedComponents - Die vom Benutzer ausgewählten Komponenten.
   * @param selectedItems - Die vom Benutzer ausgewählten Elemente.
   * @param yearFrom - Das Startjahr für das Abrufen der Daten.
   * @param yearTo - Das Endjahr für das Abrufen der Daten.
   * @returns Ein Promise, das aufgelöst wird, wenn das Abrufen der Daten abgeschlossen ist.
   */
 
  async MstBewertungabfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
    this.anzeigenMstUebersichtService.value='' ;this.anzeigenMstUebersichtService.Artvalue='';
        
    this.BewertungenMstAnzeige=true;
    // importiert MstBewertungen aller ausgewählter komponenten
    
    this.dbMPUebersichtMst=await this.msteditService.fetchDataFromDb(selectedItems,selectedComponents, yearTo);

    
     
  }
 
  
    /**
     * Behandelt das Umschaltänderungsereignis.
     * 
     * Diese Methode wird ausgelöst, wenn sich der Umschaltzustand ändert. Sie überprüft, ob der 
     * Wert von `componentTypeControl` "artabundanz" enthält. Wenn dies der Fall ist, protokolliert 
     * sie die Änderung in der Konsole und setzt den Wert der Formularsteuerung `componentType` auf 
     * ['messstellenbewertung'].
     * 
     * Zusätzliche Logik kann bei Bedarf innerhalb dieser Methode implementiert werden.
     */
    onToggleChange() {
     
      if (this.componentTypeControl.value.includes("artabundanz")===true){
        console.log('Toggle changed', this.componentTypeControl.value);
        this.form.get('componentType').setValue(['messstellenbewertung']);
      }
      // Implement additional logic here
    }
  }
  /**
   * Formatiert ein gegebenes Datum in einen String im Format "DD.MM.YYYY".
   *
   * @param date - Das zu formatierende Datum.
   * @returns Ein String, der das formatierte Datum darstellt.
   */
  
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }