import {ElementRef, HostListener,NgZone,Component, OnInit,Output ,ViewChild,Injectable,EventEmitter,AfterViewInit} from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';
import * as XLSX from 'xlsx';
import { HelpService } from '../services/help.service';
import {PerlodesimportService} from '../services/perlodesimport.service';
import { Messwerte } from '../interfaces/messwerte';
import { Uebersicht } from '../interfaces/uebersicht';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import {ValExceltabsService} from '../services/val-exceltabs.service';
import { SelectjahrComponent } from '../select/selectjahr/selectjahr.component'; 
import { SelectProbenehmerComponent } from '../select/select-probenehmer/select-probenehmer.component'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,Sort} from '@angular/material/sort';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import {UebersichtImportService} from 'src/app/services/uebersicht-import.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {ArraybuendelMstaendern} from 'src/app/interfaces/arraybuendel-mstaendern';
import {MessstelleAendernComponent} from 'src/app/file-upload/messstelle-aendern/messstelle-aendern.component'
import { MatDialog } from '@angular/material/dialog';
import {PhytoseeServiceService} from 'src/app/services/phytosee-service.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {DataAbiotik} from 'src/app/interfaces/data-abiotik';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
/**
 * Die FileUploadComponent ist verantwortlich für das Handling von Datei-Uploads, die Datenverarbeitung und die Verwaltung des Anwendungszustands
 * im Zusammenhang mit Dateiimporten. Sie interagiert mit verschiedenen Diensten, um Operationen wie Datenvalidierung, Import und Anzeige durchzuführen.
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * 
 * @property {SelectjahrComponent} child1 - ViewChild-Referenz zur SelectjahrComponent.
 * @property {SelectProbenehmerComponent} childPN - ViewChild-Referenz zur SelectProbenehmerComponent.
 * @property {MatPaginator} paginator - ViewChild-Referenz zum MatPaginator.
 * @property {MatSort} sort - ViewChild-Referenz zum MatSort.
 * @property {EventEmitter<MessstellenStam>} newData - EventEmitter zum Senden neuer Daten.
 * @property {boolean} ImpHistoryisChecked - Flag, um zu überprüfen, ob die Importhistorie aktiviert ist.
 * @property {boolean} ArtenNichtBekannt - Flag, um zu überprüfen, ob Arten unbekannt sind.
 * @property {boolean} ArtenNichtBekanntIsVisible - Flag, um zu überprüfen, ob der Abschnitt für unbekannte Arten sichtbar ist.
 * @property {DataAbiotik[]} dataAbiotik - Array zur Speicherung abiotischer Daten.
 * @property {any} einheiten - Variable zur Speicherung von Einheiten.
 * @property {any} mst - Variable zur Speicherung von Messstellen.
 * @property {any} formen - Variable zur Speicherung von Formen.
 * @property {any} arten - Variable zur Speicherung von Arten.
 * @property {any} tiefen - Variable zur Speicherung von Tiefen.
 * @property {any} jahr - Variable zur Speicherung des Jahres.
 * @property {any} probenehmer - Variable zur Speicherung des Probenehmers.
 * @property {any} importuebersicht - Variable zur Speicherung der Importübersicht.
 * @property {any} arrayBuffer - Variable zur Speicherung des Array-Buffers.
 * @property {boolean} mstimptab - Flag, um zu überprüfen, ob der Messstellen-Import-Tab aktiv ist.
 * @property {boolean} Datimptab - Flag, um zu überprüfen, ob der Daten-Import-Tab aktiv ist.
 * @property {boolean} Datimptabphyto - Flag, um zu überprüfen, ob der Phytoplankton-Daten-Import-Tab aktiv ist.
 * @property {string} newDate - Variable zur Speicherung des neuen Datums.
 * @property {Uebersicht[]} uebersicht - Array zur Speicherung von Übersichts-Daten.
 * @property {UebersichtImport[]} uebersichtImport - Array zur Speicherung von Importübersichts-Daten.
 * @property {UebersichtImport} newuebersichtImport - Variable zur Speicherung neuer Importübersichts-Daten.
 * @property {BehaviorSubject<boolean>} isLoading$ - BehaviorSubject zur Verwaltung des Ladezustands.
 * @property {boolean} ImportIntoDB - Flag, um zu überprüfen, ob der Import in die Datenbank erlaubt ist.
 * @property {boolean} pruefen - Flag, um zu überprüfen, ob eine Validierung erforderlich ist.
 * @property {boolean} ImportBewertungenAnzeige - Flag, um zu überprüfen, ob die Importbewertungen-Anzeige aktiv ist.
 * @property {MatTableDataSource<Uebersicht>} dataSource - Datenquelle für die Tabelle.
 * @property {MstMakrophyten[]} mstMakrophyten - Array zur Speicherung von Makrophyten-Messstellen.
 * @property {boolean} ImportDatenAnzeige - Flag, um zu überprüfen, ob die Importdaten-Anzeige aktiv ist.
 * @property {Messwerte[]} MessData - Array zur Speicherung von Messdaten.
 * @property {Messwerte[]} MessDataOrgi - Array zur Speicherung der ursprünglichen Messdaten.
 * @property {Messwerte[]} MessDataImp - Array zur Speicherung der importierten Messdaten.
 * @property {string[]} displayColumnNames - Array zur Speicherung der Anzeigespaltennamen.
 * @property {string[]} dynamicColumns - Array zur Speicherung der dynamischen Spalten.
 * @property {boolean} isHelpActive - Flag, um zu überprüfen, ob die Hilfe aktiv ist.
 * @property {string} helpText - Variable zur Speicherung des Hilfetextes.
 * @property {boolean} showHandleRowClick - Flag, um zu überprüfen, ob das Zeilenklick-Handling angezeigt wird.
 * @property {boolean} panelOpenState - Flag, um zu überprüfen, ob das Panel geöffnet ist.
 * @property {string} shortLink - Variable zur Speicherung des Kurzlinks aus der API-Antwort.
 * @property {boolean} loading - Flag, um zu überprüfen, ob das Laden aktiv ist.
 * @property {File} file - Variable zur Speicherung der Datei.
 * 
 * @method handleJahrSelected - Handhabt das Ereignis, wenn ein Jahr ausgewählt wird.
 * @method InfoBox - Zeigt eine Snackbar-Nachricht an.
 * @method handlePNSelected - Handhabt das Ereignis, wenn ein Probenehmer ausgewählt wird.
 * @method ausblendenDVNR - Schaltet die Sichtbarkeit unbekannter Arten um.
 * @method ausblendenImporthistorie - Schaltet die Sichtbarkeit der Importhistorie um.
 * @method ngOnInit - Lifecycle-Hook, der aufgerufen wird, nachdem Angular alle datengebundenen Eigenschaften initialisiert hat.
 * @method onValueChange - Handhabt das Ereignis, wenn sich ein Wert ändert.
 * @method close - Schließt die Importdaten- und Bewertungsanzeige.
 * @method openexpand - Öffnet die Importdaten-Anzeige.
 * @method onChange - Handhabt das Ereignis, wenn eine Datei ausgewählt wird.
 * @method onDeleteClick - Handhabt das Ereignis, wenn der Löschen-Button geklickt wird.
 * @method handleData - Handhabt die Datenverarbeitung basierend auf dem Ergebnis.
 * @method ngAfterViewInit - Lifecycle-Hook, der aufgerufen wird, nachdem Angular die Ansicht einer Komponente vollständig initialisiert hat.
 * @method onUpload - Handhabt den Datei-Upload-Prozess.
 * @method hole - Überprüft, ob Daten verfügbar sind.
 * @method pruefeObMesswerteschonVorhanden - Überprüft asynchron, ob Messwerte bereits vorhanden sind.
 * @method MessageImportierbareDaten - Generiert eine Nachricht über importierbare Daten.
 * @method archivImportErzeugen - Erstellt einen Archiv-Import.
 * @method importIntoDB - Importiert Daten in die Datenbank.
 * @method sortData2 - Platzhalter-Methode zum Sortieren von Daten.
 * @method sortData - Sortiert die Importübersichts-Daten.
 * @method addfile - Handhabt das Hinzufügen einer Datei und verarbeitet sie basierend auf dem Datentyp.
 * @method edit - Öffnet einen Dialog zum Bearbeiten einer Messstelle.
 * @method displayableColumns - Setzt die anzeigbaren Spalten basierend auf der Verfahrens-ID.
 * @method handleRowClick - Handhabt das Ereignis, wenn eine Zeile geklickt wird.
 * @method getColorFehler - Holt die Farbe für Fehler.
 * @method startLoading - Startet den Lade-Spinnner.
 * @method stopLoading - Stoppt den Lade-Spinnner.
 * 
 * @constructor
 * @param {ElementRef} el - Referenz zum Element.
 * @param {NgZone} zone - Angular-Zonen-Dienst.
 * @param {MatSnackBar} snackBar - Material-Snackbar-Dienst.
 * @param {HelpService} helpService - Dienst zur Handhabung der Hilfe-Funktionalität.
 * @param {Router} router - Angular-Router-Dienst.
 * @param {AuthService} authService - Dienst zur Handhabung der Authentifizierung.
 * @param {AnzeigeBewertungMPService} anzeigeBewertungMPService - Dienst zur Handhabung der Bewertungsanzeige.
 * @param {UebersichtImportService} uebersichtImportService - Dienst zur Handhabung der Importübersicht.
 * @param {FarbeBewertungService} Farbebewertg - Dienst zur Handhabung der Farbbewertungen.
 * @param {PerlodesimportService} perlodesimportService - Dienst zur Handhabung des Perlodes-Imports.
 * @param {FileUploadService} fileUploadService - Dienst zur Handhabung von Datei-Uploads.
 * @param {XlsxImportPhylibService} xlsxImportPhylibService - Dienst zur Handhabung von XLSX-Importen.
 * @param {ValExceltabsService} valExceltabsService - Dienst zur Validierung von Excel-Tabs.
 * @param {PhytoseeServiceService} phytoseeServiceService - Dienst zur Handhabung des Phytosee-Dienstes.
 * @param {MatDialog} dialog - Material-Dialog-Dienst.
 * @param {StammdatenService} stammdatenService - Dienst zur Handhabung von Stammdaten.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
@Injectable()
export class FileUploadComponent implements OnInit,AfterViewInit {
	@ViewChild(SelectjahrComponent, {static: false}) child1: SelectjahrComponent;
	@ViewChild(SelectProbenehmerComponent, {static: false}) childPN: SelectProbenehmerComponent;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@Output() newData =new EventEmitter<MessstellenStam>();

	@HostListener('window:resize', ['$event'])
	@HostListener('window:scroll', ['$event'])
	/**
	 * Setzt die Skalierung des Elements auf 1 zurück, wenn eine Änderung festgestellt wird.
	 * Diese Methode verhindert das Zoomen, indem sie den Transformationsmaßstab auf 1 setzt
	 * und eine benutzerdefinierte Stil-Eigenschaft anwendet, um die Zoomverhinderung anzuzeigen.
	 */
	preventZoom() {
	  // Zurücksetzen der Skalierung auf 1, falls eine Veränderung festgestellt wird
	  this.el.nativeElement.style.transform = 'scale(1)';
	  this.el.nativeElement.style.preventZoom = 'true';
	}
	ImpHistoryisChecked: boolean = false;
	ArtenNichtBekannt: boolean = false;
	ArtenNichtBekanntIsVisible: boolean = false;
	dataAbiotik:DataAbiotik[]=[];
	public einheiten:any;
	public mst:any;
	public formen:any;
	public arten:any;
	public tiefen:any;
	public jahr:any;
	public probenehmer:any;
	public importuebersicht:any;
	arrayBuffer:any;
	public mstimptab:boolean=false;
	public Datimptab:boolean=false;
	public Datimptabphyto:boolean=false;
	public newDate: string;
	public uebersicht:Uebersicht[]=[];
	public uebersichtImport:UebersichtImport[];
	public newuebersichtImport:UebersichtImport;
	isLoading$ = new BehaviorSubject<boolean>(false); 
	ImportIntoDB:boolean=true;
	pruefen:boolean=true;
	ImportBewertungenAnzeige:boolean=false;
	dataSource: MatTableDataSource<Uebersicht>;
	mstMakrophyten:MstMakrophyten[];
	ImportDatenAnzeige:boolean=true;
	public MessData:Messwerte[]=[];	public  MessDataOrgi:Messwerte[]=[];//public MessDataGr:Messgroup[]=[];
	public MessDataImp:Messwerte[]=[];
	displayColumnNames:string[]=['Nr','Messstelle','Anzahl', 'MPtyp'];
	dynamicColumns:string[]=['nr','mst','anzahl','sp3','fehler1','actions'];//,'sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','fehler1','fehler2','fehler3'];//,'_Messstelle', '_TypWRRL','_UMG', '_AnzahlTaxa','MstOK', 'OK'
	isHelpActive: boolean = false;
	helpText: string = '';
	showHandleRowClick: boolean = false; // Setze dies je nach Tabelle oder Anforderung
	panelOpenState = false;
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor (private el: ElementRef,private zone: NgZone, private snackBar: MatSnackBar,private helpService: HelpService,private router: Router,private authService: AuthService,private anzeigeBewertungMPService:AnzeigeBewertungMPService,private uebersichtImportService:UebersichtImportService,private Farbebewertg:FarbeBewertungService,private perlodesimportService:PerlodesimportService,private fileUploadService: FileUploadService,
		private xlsxImportPhylibService:XlsxImportPhylibService,private valExceltabsService:ValExceltabsService,private phytoseeServiceService:PhytoseeServiceService,
		public dialog: MatDialog,private stammdatenService:StammdatenService) { 

		
	}
	
// Diese Methode wird ausgelöst, wenn das Event von der Kindkomponente gefeuert wird
/**
 * Handhabt die Auswahl eines Jahres.
 * 
 * Diese Methode wird ausgelöst, wenn ein Jahr ausgewählt wird. Sie setzt das `ImportIntoDB`-Flag auf true
 * und das `pruefen`-Flag auf false. Zusätzliche Logik kann hinzugefügt werden, um das ausgewählte Jahr zu verarbeiten oder zu speichern.
 * 
 * @param selectedJahr - Das ausgewählte Jahr.
 */

handleJahrSelected(selectedJahr: number) {
	this.ImportIntoDB=true;
	this.pruefen=false;
    // console.log("Ausgewähltes Jahr:", selectedJahr);
    // Hier kannst du beliebige Logik einfügen, z.B. das Jahr speichern oder verarbeiten
  }
 // Methode zum Anzeigen einer Snackbar-Nachricht
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
      verticalPosition: 'top',
    });
  }
/**
 * Handhabt das Ereignis, wenn eine Probenehmernummer (PN) ausgewählt wird.
 * 
 * @param selectedPN - Die ausgewählte Probenehmernummer.
 */
  handlePNSelected(selectedPN: number) {
	this.ImportIntoDB=true;
	this.pruefen=false;

  }
/**
 * Schaltet die Sichtbarkeit von Elementen mit dem Taxon "ID_ART nicht bekannt" um.
 * 
 * Wenn `ArtenNichtBekannt` auf true gesetzt ist, filtert es Elemente mit dem Taxon "ID_ART nicht bekannt"
 * aus `MessDataImp` und `MessDataOrgi` heraus. Es aktualisiert auch das `uebersicht` Array im `xlsxImportPhylibService`,
 * um die Änderungen im Fehler- und Importstatus widerzuspiegeln, und aktualisiert die Datenquelle für die Tabelle.
 */
  ausblendenDVNR(){
	this.ArtenNichtBekannt = !this.ArtenNichtBekannt;

	if (this.ArtenNichtBekannt===true){
		const MessDataImpoD: Messwerte[] = this.xlsxImportPhylibService.MessDataImp.filter(item => typeof item._Taxon === 'string' && !item._Taxon.includes('ID_ART nicht bekannt'));
		const MessDataTemp: Messwerte[] = this.MessDataOrgi.filter(item => typeof item._Taxon === 'string' && !item._Taxon.includes('ID_ART nicht bekannt'));
				
		this.MessDataOrgi=MessDataTemp;
	this.xlsxImportPhylibService.uebersicht.forEach(item => {
											if (item.fehler2 === "checked") {
												item.fehler2 = "";
											}
											if (item.fehler2 !== "checked" && item.fehler1 !== "checked") {
												item.import1 = "checked";
											} else {
												item.import1 = "";
											}
										});
		this.dataSource = new MatTableDataSource(this.xlsxImportPhylibService.uebersicht);
	}
}
/**
 * Schaltet die Sichtbarkeit der Importhistorie um und aktualisiert die Übersicht.
 * 
 * Diese Methode schaltet den Zustand von `ImpHistoryisChecked` um und ruft die Methode 
 * `uebersichtImportService.handle` mit dem neuen Zustand auf. Nach dem Serviceaufruf 
 * wird die Eigenschaft `uebersichtImport` mit der neuesten Übersicht aus dem Service aktualisiert.
 * 
 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Operation abgeschlossen ist.
 */
  async ausblendenImporthistorie() {
    // this.ImportDatenAnzeige = false;
    this.ImpHistoryisChecked = !this.ImpHistoryisChecked; // Toggle the checked state
	await this.uebersichtImportService.handle(this.ImpHistoryisChecked); 
	this.uebersichtImport=this.uebersichtImportService.uebersicht; 
}
	
	/**
	 * Initialisiert die Komponente.
	 * 
	 * Diese Methode wird aufgerufen, sobald die Komponente initialisiert ist. Sie überprüft, ob der Benutzer eingeloggt ist,
	 * und navigiert zur Login-Seite, falls nicht. Wenn der Benutzer eingeloggt ist, werden verschiedene
	 * Komponenteneigenschaften initialisiert und es wird auf Observables vom helpService und uebersichtImportService abonniert.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist.
	 */
	async ngOnInit() {
		if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
			
        } else{
			this.ImportDatenAnzeige=false;
			this.ImportBewertungenAnzeige=false;
			
		await this.uebersichtImportService.start();
		this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
		this.uebersichtImport=this.uebersichtImportService.uebersicht;
		//console.log(this.uebersichtImport);
	}}
	/**
	 * Handhabt das Änderungsereignis für einen Wert.
	 * 
	 * @param $event - Das Ereignisobjekt, das den neuen Wert enthält.
	 */
	onValueChange($event){
		console.log($event)
		this.newDate=$event;
	  }
	/**
	 * Schließt die Importansichten, indem die Anzeigeflags auf false gesetzt werden.
	 * Diese Methode verbirgt die Abschnitte für Importdaten und Importbewertungen.
	 */
	close(){
		this.ImportDatenAnzeige=false;
		this.ImportBewertungenAnzeige=false;
	}
	/**
	 * Öffnet die erweiterte Ansicht und handhabt den Importdienst.
	 * 
	 * Diese Methode führt die folgenden Aktionen aus:
	 * 1. Ruft die `handle`-Methode des `uebersichtImportService` mit dem Parameter `ImpHistoryisChecked` auf.
	 * 2. Setzt `ImportBewertungenAnzeige` auf `false`.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Handhabung des Importdienstes abgeschlossen ist.
	 */
 
	async openexpand(){
		//this.ImportDatenAnzeige=true;
		// console.log();
	await this.uebersichtImportService.handle(this.ImpHistoryisChecked);
	this.ImportBewertungenAnzeige=false;
	}  
	// On file Select 
	/**
	 * Handhabt das Änderungsereignis, wenn eine Datei ausgewählt wird.
	 * 
	 * @param event - Das Ereignisobjekt, das die ausgewählte Datei enthält.
	 * 
	 * Diese Methode führt die folgenden Aktionen aus:
	 * - Setzt `ImportDatenAnzeige` und `ImportBewertungenAnzeige` auf false.
	 * - Weist die ausgewählte Datei der `file`-Eigenschaft zu.
	 * - Setzt `pruefen` und `ImportIntoDB` auf true.
	 * - Initialisiert eine neue `MatTableDataSource`.
	 * - Setzt `mstimptab`, `Datimptab` und `Datimptabphyto` auf false.
	 * - Erstellt ein neues `UebersichtImport`-Objekt und weist den Dateinamen `dateiname` zu.
	 */
	
	onChange(event) {
		this.ImportDatenAnzeige=false;
		this.ImportBewertungenAnzeige=false;
		this.file=event.target.files[0];
		this.pruefen=true;this.ImportIntoDB=true;
		// this.InfoBox="";
		this.dataSource=new MatTableDataSource();
		this.mstimptab=false;  this.Datimptab=false;this.Datimptabphyto=false;
		this.newuebersichtImport= {} as UebersichtImport;
		this.newuebersichtImport.dateiname=this.file.name;
	}
	/**
	 * Handhabt das Klick-Ereignis zum Löschen einer Datei.
	 * Diese Methode wird ausgelöst, wenn der Löschen-Button geklickt wird.
	 */
	onDeleteClick(){}
	

	/**
	 * Handhabt die Datenverarbeitung basierend auf dem Ergebnisobjekt.
	 * 
	 * @param {any} result - Das Ergebnisobjekt, das zu verarbeitende Daten enthält.
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Datenverarbeitung abgeschlossen ist.
	 * 
	 * Die Funktion führt die folgenden Operationen aus:
	 * - Überprüft, ob die `id_verfahren` im Ergebnis gültig ist.
	 * - Wenn gültig, wird das `mstMakrophyten` Array geleert.
	 * - Wenn nicht gültig, wird das `dataAbiotik` Array geleert.
	 * - Abhängig vom `import_export` Flag im Ergebnis:
	 *   - Wenn true, wird `anzeigeBewertungMPService.callImpMstMP` und `anzeigeBewertungMPService.arrayNeuFuellen` mit `id_imp` aufgerufen.
	 *     - Aktualisiert `mstMakrophyten` mit den Daten aus `anzeigeBewertungMPService`.
	 *     - Setzt `ImportDatenAnzeige` auf true.
	 *   - Wenn false, wird `uebersichtImportService.callgetBwMstTaxa` mit `id_imp` aufgerufen.
	 *     - Aktualisiert `dataAbiotik` mit den Daten aus `uebersichtImportService`.
	 *     - Setzt `ImportBewertungenAnzeige` auf true und `ImportDatenAnzeige` auf false.
	 */
	async handleData(result){
		const validIds = [1, 3, 6];
if (validIds.includes(result.id_verfahren)) {
  // Your code here

		this.mstMakrophyten=[];}else{
		this.dataAbiotik=[];	
		}
		
		// this.MakrophytenAnzeige=true;
//   this.MakrophytenMstAnzeige=false;
  //await 
  if (result.import_export===true){
  await this.anzeigeBewertungMPService.callImpMstMP(result.id_imp);

  

  this.anzeigeBewertungMPService.arrayNeuFuellen(result.id_imp);

  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
  this.ImportDatenAnzeige=true;
//   console.log( this.mstMakrophyten);

  }else{//console.log(this.dataAbiotik);
	await this.uebersichtImportService.callgetBwMstTaxa(result.id_imp);
	this.dataAbiotik = this.uebersichtImportService.dataAbiotik;
	//console.log(this.dataAbiotik);
	this.ImportBewertungenAnzeige=true;
	this.ImportDatenAnzeige=false;
  }
 
	  }

	  // löst das mousover für die Hilfe aus
	/**
	 * Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
	 * Diese Methode wird verwendet, um Mouseover-Ereignisse für Elemente mit der Klasse 'helpable' zu registrieren.
	 * Sie nutzt den helpService, um diese Ereignisse zu verwalten.
	 *
	 * @memberof FileUploadComponent
	 */
	
	  ngAfterViewInit() {
	
	//	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
		this.helpService.registerMouseoverEvents();}


	
	// OnClick of button Upload 
	/**
	 * Handhabt den Datei-Upload-Prozess.
	 * 
	 * Diese Methode initiiert den Datei-Upload, indem sie den Ladeprozess startet,
	 * eine Flag-Variable setzt und den Datei-Upload-Service aufruft. Sie aktualisiert
	 * auch den Kurzlink und stellt sicher, dass der Ladeprozess nach Abschluss des
	 * Uploads gestoppt wird.
	 * 
	 * @bemerkungen
	 * - Die Methode läuft innerhalb der Angular-Zone, um eine ordnungsgemäße Änderungserkennung sicherzustellen.
	 * - Die `mstimptab`-Flagge wird während des Upload-Prozesses auf true gesetzt.
	 * - Der `shortLink` wird vorübergehend auf 'FF' gesetzt.
	 * - Der Datei-Upload-Service wird mit der hochzuladenden Datei aufgerufen.
	 * - Der Ladeprozess wird nach Abschluss des Uploads gestoppt.
	 */
	onUpload() {
		this.zone.run(() => this.startLoading());
		this.mstimptab=true;  
		

		this.shortLink='FF';
		
		this.fileUploadService.upload(this.file).subscribe(
			(event: any) => {
				if (typeof (event) === 'object') {

					

					
				}
			}
		);

		//name uploaddatei in UeberesichtImport;
		
		this.zone.run(() => this.stopLoading());// Flag variable 
	}


	/**
	 * Überprüft den Status von `xlsxImportPhylibService.vorhanden` und zeigt eine entsprechende Nachricht an.
	 * 
	 * Wenn `xlsxImportPhylibService.vorhanden` `true` ist, wird `InfoBox` mit der Nachricht "mist" aufgerufen.
	 * Andernfalls wird `InfoBox` mit der Nachricht "allet jut" aufgerufen.
	 */
	
	hole(){
	
	
		if (this.xlsxImportPhylibService.vorhanden===true)
		{this.InfoBox("mist")} else
		{this.InfoBox("allet jut")};
	
	
	}
	
		/**
		 * Überprüft asynchron, ob Messwerte bereits vorhanden sind.
		 * 
		 * Diese Methode führt eine Reihe von Überprüfungen und Operationen durch, um festzustellen, 
		 * ob Messwerte für ein ausgewähltes Jahr und einen ausgewählten Probennehmer bereits im System vorhanden sind. 
		 * Sie gibt dem Benutzer über eine InfoBox Rückmeldung und behandelt doppelte Messwerte, indem sie den Benutzer 
		 * mit einem Bestätigungsdialog auffordert.
		 * 
		 * Die Methode folgt diesen Schritten:
		 * 1. Überprüft, ob das Jahr und der Probennehmer ausgewählt sind.
		 * 2. Protokolliert die Länge der ursprünglichen Messdaten, die Verfahrensnummer und die importierten Messstationen.
		 * 3. Abhängig von der Verfahrensnummer ruft sie verschiedene Methoden auf, um vorhandene Messwerte zu überprüfen.
		 * 4. Wenn doppelte Messwerte gefunden werden, fordert sie den Benutzer mit einem Bestätigungsdialog auf, die Duplikate zu entfernen.
		 * 5. Gibt dem Benutzer über eine InfoBox Rückmeldung basierend auf den Ergebnissen der Überprüfungen.
		 * 
		 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Überprüfungen und Operationen abgeschlossen sind.
		 */
	async pruefeObMesswerteschonVorhanden(){
		this.jahr = this.child1.selected; this.probenehmer = this.childPN.selectedPN;

		if (!this.jahr) {
			this.InfoBox('Bitte erst das Untersuchungsjahr auswählen.');
		} else {

			if (!this.probenehmer) {
				this.InfoBox("Bitte erst den Probenehmer auswählen.");
			} else {
				console.log(this.MessDataOrgi.length)
				console.log(this.valExceltabsService.NrVerfahren)
				console.log(this.xlsxImportPhylibService.messstellenImp)
				if ((this.MessDataOrgi.length > 0 && (this.valExceltabsService.NrVerfahren === 1 || 
					this.valExceltabsService.NrVerfahren === 3 || 
					this.valExceltabsService.NrVerfahren === 6)) || this.xlsxImportPhylibService.messstellenImp.length > 0) {
					if (this.valExceltabsService.NrVerfahren!==5 && this.valExceltabsService.NrVerfahren!==7){
						
						if(this.valExceltabsService.NrVerfahren!==6 ){
							
						  await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr);}else{
							//Verfahren=6//
							await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhandenJahr();
						}}
					else {
						//Verfahren=5 u. Verfahren=7
						await this.xlsxImportPhylibService.pruefeObMesswerteAbiotikschonVorhandenmitJahr();}
					
					if (this.xlsxImportPhylibService.vorhanden == true) { this.InfoBox("Daten lassen sich nicht oder nur teilweise importieren.") ;}  
						if (this.xlsxImportPhylibService.doppelteMesswerte()===true){
							const dialogRef = this.dialog.open(ConfirmDialogComponent, {
								width: '250px',
								data: { message: 'Es wurden doppelte Messwerte gefunden. Möchten Sie fortfahren und die doppelten Werte entfernen?' }
							  });
							  dialogRef.afterClosed().subscribe(result => {
								if (result === true) {
								  // Der Benutzer hat "Ja" gewählt -> Distinct anwenden
								  const distinctObjects = Array.from(
									new Map(this.xlsxImportPhylibService.MessDataImp.map(item => [JSON.stringify(item), item])).values()
								  );
								  this.xlsxImportPhylibService.MessDataImp = distinctObjects;
						
								  // Setze die InfoBox-Nachricht
								  //this.InfoBox ("Die doppelten Messwerte wurden entfernt.Die Daten sind zum Import bereit.");
								  this.InfoBox ("Die doppelten Messwerte wurden entfernt."+this.MessageImportierbareDaten()); 
								  this.ImportIntoDB = false; 
								}else {
									// Der Benutzer hat "Nein" gewählt -> Abbrechen
									this.InfoBox ("Der Import wurde abgebrochen.");
									//console.log(this.InfoBox);
								  }
								});
						
						  

							//this.InfoBox="Die Importdatei enthält mind. einen doppelten Messwert:" + this.xlsxImportPhylibService.MstDoppelteDS+ ". Der Import wird abgebrochen.";
						} else 
						{
							
							this.InfoBox (this.MessageImportierbareDaten());
							// this.InfoBox ("Daten sind zum import bereit.");
							this.ImportIntoDB = false; };
				} else {
					 this.InfoBox ("Bitte erst eine Importdatei hochladen.");
				
				}

			}
		}
	}
	/**
	 * Generiert eine Nachricht, die den Importstatus der Daten angibt.
	 *
	 * Diese Methode überprüft das `uebersichtGeprueft`-Array aus dem `xlsxImportPhylibService`-Service,
	 * um festzustellen, wie viele Elemente als "checked" (bereit für den Import) markiert sind und wie viele nicht.
	 * Basierend auf diesen Zählungen gibt sie eine Nachricht zurück, die angibt, ob alle Daten bereits in der Datenbank sind,
	 * alle Daten zum Import bereit sind oder einige Daten zum Import bereit sind, während einige bereits in der Datenbank sind.
	 *
	 * @returns {string} Eine Nachricht, die den Importstatus der Daten angibt.
	 */
	MessageImportierbareDaten():string {
		let message;
		const checkedCount = this.xlsxImportPhylibService.uebersichtGeprueft.filter(item => item.import1 === "checked").length;
		const uncheckedCount = this.xlsxImportPhylibService.uebersichtGeprueft.filter(item => item.import1 === "").length;
	  
		if (checkedCount===0 && this.xlsxImportPhylibService.uebersichtGeprueft.length>0) {
			message="Alle Daten sind bereits in der Datenbank vorhanden";
		}else if (uncheckedCount===0 && this.xlsxImportPhylibService.uebersichtGeprueft.length>0) {
			message="Alle Daten sind zum Import bereit";}else if
			(uncheckedCount>0 &&  checkedCount>0 && 
				this.xlsxImportPhylibService.uebersichtGeprueft.length>0) 
	  {	message="Einige Daten sind bereits in der Datenbank vorhanden, einige sind zum Import bereit.";}
		return message;
	  }
			/**
			 * Generiert eine neue Importübersicht und archiviert sie.
			 * 
			 * Diese Methode führt die folgenden Aktionen aus:
			 * 1. Generiert eine neue Import-ID und weist sie `newuebersichtImport` zu.
			 * 2. Weist den aktuellen Probenehmer und das Jahr `newuebersichtImport` zu.
			 * 3. Initialisiert `anzahlmst` und `anzahlwerte` auf 0.
			 * 4. Setzt das Feld `bemerkung` auf einen leeren String.
			 * 5. Archiviert die neue Importübersicht mit `uebersichtImportService`.
			 * 6. Weist die neue Importübersicht `xlsxImportPhylibService` zu.
			 */
			archivImportErzeugen(){

				this.newuebersichtImport.id_imp=this.uebersichtImportService.neueImportid(this.uebersichtImport);
				this.newuebersichtImport.id_pn=this.probenehmer;
				this.newuebersichtImport.jahr=this.jahr;
				this.newuebersichtImport.anzahlmst=0;
				this.newuebersichtImport.anzahlwerte=0;
				this.newuebersichtImport.bemerkung="";
				
				this.uebersichtImportService.archiviereNeueImportUebersicht(this.newuebersichtImport);
				this.xlsxImportPhylibService.uebersichtImport=this.newuebersichtImport;
				
			}
		/**
	 * Importiert Daten in die Datenbank basierend auf dem ausgewählten Jahr und Probenehmer.
	 * 
	 * Diese Methode führt die folgenden Schritte aus:
	 * 1. Überprüft, ob das Jahr und der Probenehmer ausgewählt sind.
	 * 2. Bestimmt, ob ein spezifisches Datum basierend auf der Verfahrensnummer einbezogen werden soll.
	 * 3. Je nach Verfahrensnummer importiert sie entweder Messdaten oder Bewertungsdaten.
	 * 4. Zeigt während des Prozesses entsprechende Nachrichten an den Benutzer an.
	 * 5. Aktualisiert die Importübersichtsliste mit den neuen Importdetails.
	 * 
	 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Importvorgang abgeschlossen ist.
	 */
	async	importIntoDB(){
		// this.zone.run(() => this.startLoading());
			let useincludeDate:boolean=false;
			this.jahr=this.child1.selected;
			this.probenehmer=this.childPN.selectedPN;
			console.log(this.jahr);

			if (!this.jahr){this.InfoBox("Bitte erst das Untersuchungsjahr auswählen.");
			}else{

			if (!this.probenehmer){this.InfoBox("Bitte erst den Probenehmer auswählen.");
			}else 
			
			{
				//PhytoLLBB_import(6) und PhytoflussExport(7) haben ein anderes Datum
				if (this.valExceltabsService.NrVerfahren===6 || this.valExceltabsService.NrVerfahren===7)	
					{useincludeDate=true;this.newuebersichtImport.id_komp=5;}
				// Import Artdaten für Phytoplankton, MZB, Phylib
			if (this.valExceltabsService.NrVerfahren===1 || 
				this.valExceltabsService.NrVerfahren===3|| this.valExceltabsService.NrVerfahren===6){
			if (this.MessDataOrgi.length>0 ){
				// await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr,this.probenehmer);
				// await this.xlsxImportPhylibService.pruefeObMessstellenschonVorhanden(this.jahr,this.probenehmer);
				
			
				
				this.InfoBox("Der Import wird durchgeführt.");

				//neue importID,Jahr und Probenehmer erzeugen/anfuegen
				
				this.archivImportErzeugen();
				
				 const message =await this.xlsxImportPhylibService.importIntoDB(this.jahr,this.probenehmer,useincludeDate);
				this.InfoBox(message);
				this.uebersichtImportService.uebersicht.push(this.newuebersichtImport);
				this.uebersichtImport.push(this.newuebersichtImport);
				return;
			}}
				else 
				// hier werden die Bewertungen importiert
				
				console.log(this.valExceltabsService.NrVerfahren);
				if (this.valExceltabsService.NrVerfahren===2 || this.valExceltabsService.NrVerfahren===4 || 
					this.valExceltabsService.NrVerfahren===5|| this.valExceltabsService.NrVerfahren===7){

						if (this.valExceltabsService.NrVerfahren===7){this.xlsxImportPhylibService.vorhanden=false;}
					if (this.xlsxImportPhylibService.vorhanden===true)
				{this.InfoBox("Es sind bereits Messwerte der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden.")} else
				if (this.xlsxImportPhylibService.vorhandenMst===true)
				{this.InfoBox("Es sind bereits abiotische Daten der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden.")} else

				

				{this.InfoBox("Der Import wird durchgeführt.");
					if (this.valExceltabsService.NrVerfahren===5){	this.newuebersichtImport.id_komp=5;}
				
					//neue importID,Jahr und Probenehmer erzeugen/anfuegen
				
				
				this.archivImportErzeugen();
				this.xlsxImportPhylibService.holeMst();
				const message=this.xlsxImportPhylibService.importBewertungIntoDB(this.jahr,this.probenehmer);
				this.InfoBox(message);
				
				this.uebersichtImportService.uebersicht.push(this.newuebersichtImport);
				this.uebersichtImport.push(this.newuebersichtImport);
				return;
			}}
				else 
				{this.InfoBox("Bitte erst eine Importdatei hochladen.")}
				}}
			}
			sortData2(){


			}
			//sortiert Importübersicht 	
	sortData(sort: Sort) {
		/**
		 * Erstellt eine flache Kopie des `uebersichtImport` Arrays und weist sie der `data` Variable zu.
		 * Dies stellt sicher, dass das ursprüngliche Array nicht verändert wird, wenn `data` manipuliert wird.
		 */
		const data = this.uebersichtImport.slice();
		if (!sort.active || sort.direction === '') {
			this.uebersichtImport = data;
			return;
		} this.uebersichtImport = [];
		this.uebersichtImport = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'probenehmer':
					return compare(a.probenehmer, b.probenehmer, isAsc);
				case 'dateiname':
					var upperA = a.dateiname.toUpperCase();
    				var upperB = b.dateiname.toUpperCase();
					return compare(upperA, upperB, isAsc);
				case 'verfahren':
					return compare(a.verfahren, b.verfahren, isAsc);
				case 'komponente':
					return compare(a.komponente, b.komponente, isAsc);
				case 'jahr':
					return compare(a.jahr, b.jahr, isAsc);
				case 'importiert':

					const importiertA = Date.parse(b.importiert);
					const importiertB = Date.parse(a.importiert);
					return compare(importiertA, importiertB, isAsc);

				case 'bemerkung':
					return compare(a.bemerkung, b.bemerkung, isAsc);

				default:
					return 0;
			}
		});
	}

	
			/**
			 * Handhabt das Hinzufügen einer Datei und verarbeitet sie basierend auf dem enthaltenen Datentyp.
			 * Diese Funktion liest die Datei als ArrayBuffer, verarbeitet sie mit der FileReader-API
			 * und bestimmt dann den Datentyp in der Datei, um spezifische Importoperationen durchzuführen.
			 * 
			 * Die Funktion unterstützt mehrere Importtypen, einschließlich:
			 * - Phylib-Import
			 * - Phylib-Bewertungen
			 * - Perlodes-Import
			 * - Perlodes-Export
			 * - Phytosee-Export
			 * - LLBB_Ilat-Import
			 * - Phytofluss-Export
			 * 
			 * Die Funktion aktualisiert verschiedene UI-Elemente und interne Zustände basierend auf dem Importtyp.
			 * 
			 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Dateiverarbeitung abgeschlossen ist.
			 */
			async addfile()     
		{  this.ImportDatenAnzeige=false;


			this.zone.run(() => this.startLoading());

			try {
			this.pruefen=true;
			this.mstimptab=true; this.Datimptab=false; this.Datimptabphyto=false; this.ImportIntoDB=true;
	//	this.file= event.target.files[0];     
		let fileReader = new FileReader();    
		fileReader.readAsArrayBuffer(this.file);     
		 fileReader.onload = async (e) => {    
			this.arrayBuffer = fileReader.result;    
			var data = new Uint8Array(this.arrayBuffer);    
			var arr = new Array();    
			for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
			var bstr = arr.join("");    
			var workbook = XLSX.read(bstr, {type:"binary"}); 
			//Tab1 Inhalte löschen
			//this.MessDataGr=[];
			
			//Exceltabs auslesen und VErfahren auswählen
			await this.valExceltabsService.ExcelTabsinArray(workbook);	
			let valexcelspalten: any=this.valExceltabsService.valspalten

			//importUebrsicht ID verfahren festlegen
			
			
			
			// console.log(this.valExceltabsService.NrVerfahren);
			this.xlsxImportPhylibService.uebersicht=[];
			this.newuebersichtImport.id_verfahren=this.valExceltabsService.NrVerfahren;
			console.log(this.valExceltabsService.NrVerfahren);
				switch(this.valExceltabsService.NrVerfahren) {
					
				  case 1:
						//importiert die Daten aus der XLSX in die Interfaces Messwerte und Messgroup
						this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						
						await this.xlsxImportPhylibService.Phylibimport(workbook,this.valExceltabsService.valspalten,0,1,this.valExceltabsService.NrVerfahren);
						// Phylibimport(workbook,valspalten: any, tabMST: number,tabMW: number,verfahrennr : number)
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						this.newuebersichtImport.id_komp=1;
					
						this.displayableColumns(1);
						
						
						this.InfoBox("Phylib-Importdatei erkannt (" + this.file.name+ "). " + this.xlsxImportPhylibService.MessDataOrgi.length + " Datensätze in der Importdatei.");
						this.Datimptab=false;this.Datimptabphyto=false;
						this.pruefen=false;
						// this.dataSource.sort = this.sort;
					break;
				  case 2:
					this.newuebersichtImport.id_komp=1;
					this.InfoBox("Phylib-Bewertungen erkannt (" + this.file.name+ "). ");
					this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						this.MessDataOrgi =[];
						await  this.xlsxImportPhylibService.PhylibBewertungimport(workbook,this.valExceltabsService.valspalten,1,this.valExceltabsService.NrVerfahren );
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						this.pruefen=false;
						this.displayableColumns(2);
						// this.dataSource.sort=this.sort;
						this.Datimptab=false;this.Datimptabphyto=false;
						break;
					case 3:
						let message="";
						this.newuebersichtImport.id_komp=3;
						// this.xlsxImportPhylibService.uebersicht=[];
						this.xlsxImportPhylibService.MessDataOrgi=[];
						await this.perlodesimportService.startimport(workbook);
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						this.ArtenNichtBekanntIsVisible=this.perlodesimportService.ArtenNichtBekanntIsVisible;
						if (this.ArtenNichtBekanntIsVisible===true){message=" Einige Arten sind nicht bekannt.";}
						this.InfoBox("Perlodes-Importdatei erkannt (" + this.file.name+ ")." + 
							this.xlsxImportPhylibService.MessDataOrgi.length + 
							" Datensätze in der Importdatei."+message);
						this.ArtenNichtBekanntIsVisible=this.perlodesimportService.ArtenNichtBekanntIsVisible;
					this.displayableColumns(3);
					// this.dataSource.sort=this.sort;
					this.Datimptab=false;this.Datimptabphyto=false;
					this.pruefen=false;
					break;
					case 4://MZB export
					// this.xlsxImportPhylibService.uebersicht=[];
					this.newuebersichtImport.id_komp=3;
					await this.perlodesimportService.Perlodesexport(workbook, this.valExceltabsService.valspalten,3,this.valExceltabsService.NrVerfahren );
					// this.xlsxImportPhylibService.uebersicht=[];
					this.InfoBox("Perlodes-Bewertungen erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.");
					this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
					this.Datimptab=false;this.Datimptabphyto=false;
					this.displayableColumns(4);
					// this.dataSource.sort=this.sort;
					this.pruefen=false;
					break;
					case 5: //PhytoseeExport
					// code block
					await this.phytoseeServiceService.Phytoseeexport(workbook, this.valExceltabsService.valspalten,3,this.valExceltabsService.NrVerfahren);
					this.InfoBox("Phytosee-Export erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.");
					this.Datimptab=false;this.Datimptabphyto=false;
					this.displayableColumns(5);
					// this.dataSource.sort=this.sort;
					
					this.pruefen=false;
					break;
					case 6://LLBB_Ilat Import
					// this.InfoBox="";
					const result=await this.phytoseeServiceService.PhytoseeLLBBimport(workbook, this.valExceltabsService.valspalten,workbook.SheetNames.length,this.valExceltabsService.NrVerfahren,  this.valExceltabsService.loescheErste5Zeilen);
					this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
					if (result===("Import erfolgreich")){ 
						this.pruefen=false;
						this.InfoBox("LLBB-Phytoplankton-Import erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Messstellen in der Importdatei.");}
					else {this.InfoBox(result);}
						this.Datimptab=false;this.Datimptabphyto=false;

					this.displayableColumns(6);
					break;
					case 7: //PhytoflussExport
					// code block
					await this.phytoseeServiceService.Phytoflussexport(workbook, this.valExceltabsService.valspalten,2,this.valExceltabsService.NrVerfahren);
					this.InfoBox("Phytofluss-Export erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.");
					this.Datimptab=false;this.Datimptabphyto=false;
					this.displayableColumns(7);
					// this.dataSource.sort=this.sort;
					
					this.pruefen=false;
					break;
				  default:
					this.InfoBox("Keine Importdatei.");
				}
				 this.dataSource.sort=this.sort;
			}   }finally { this.zone.run(() => this.stopLoading());} 
			}

	/**
	 * Bearbeitet die Details einer gegebenen Person in der Übersicht.
	 * 
	 * Diese Funktion führt die folgenden Schritte aus:
	 * 1. Ruft die Methode `callBwUebersicht` des `stammdatenService` auf.
	 * 2. Filtert das `messstellenarray` mit der Methode `filterMst` des `stammdatenService`.
	 * 3. Findet die alte Messstellen-ID basierend auf der gegebenen `mst` der Person.
	 * 4. Öffnet einen Dialog zum Bearbeiten der Messstellendetails.
	 * 5. Nach dem Schließen des Dialogs aktualisiert sie die Übersicht und andere verwandte Datenstrukturen mit den neuen Messstellendetails.
	 * 
	 * @param {Uebersicht} person - Die Person, deren Details bearbeitet werden sollen.
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn der Bearbeitungsvorgang abgeschlossen ist.
	 */
	
	async edit(person: Uebersicht) {
		let mst_id_alt
		// console.log(this.xlsxImportPhylibService.MessDataImp)
		// let mststam1:MessstellenStam[]=this.stammdatenService.messstellenarray;
		
		
		await this.stammdatenService.callBwUebersicht();
		await this.stammdatenService.filterMst(true,false);
	
	  //console.log(this.stammdatenService.wk)
	  let name_alt:string=person.mst;
		
		let aMst = this.stammdatenService.messstellenarray.find(i => i.namemst === name_alt);
		if (aMst)
		{ mst_id_alt=aMst.id_mst;}
	
		let temp:ArraybuendelMstaendern;
		temp=({mststam:this.stammdatenService.messstellenarray,namemst:person.mst});
		
	
		// person.wknamen=(this.stammdatenService.wk);
		const dialogRef = this.dialog.open(MessstelleAendernComponent, {
		  width: '800px',height: '800px',
		  data: temp
		  });
	 
	  
		dialogRef.afterClosed().subscribe(result => {
		  if (result) {
			let mst_id_neu=result.id_mst;
			// let Uebersicht =this.xlsxImportPhylibService.uebersicht.filter(dd=>dd.mst===person.mst)
			let a = this.xlsxImportPhylibService.uebersicht.findIndex(i => i.mst === person.mst);
			this.xlsxImportPhylibService.uebersicht[a].mst=result.namemst
			this.xlsxImportPhylibService.uebersicht[a].fehler1=''; 
			if (this.xlsxImportPhylibService.uebersicht[a].fehler2!=="checked" && this.xlsxImportPhylibService.uebersicht[a].fehler3!=="checked")
				{this.xlsxImportPhylibService.uebersicht[a].import1="checked";}
			
			//let b=this.MessData.findIndex(i => i._Messstelle === person.mst);

			for (let i = 0, l = this.MessDataOrgi.length; i < l; i += 1) {
		console.log(this.MessDataOrgi[i]._Messstelle)
				if (this.MessDataOrgi[i]._Messstelle===name_alt){

					this.MessDataOrgi[i]._Messstelle=result.namemst;
				}
				
			}

			for (let b = 0, l = this.xlsxImportPhylibService.messstellenImp.length; b < l; b += 1) {
				
				
				
				
				if (this.xlsxImportPhylibService.messstellenImp[b].uebersicht.mst===name_alt){

					this.xlsxImportPhylibService.messstellenImp[b].id_mst=result.id_mst;
				}
			}

			console.log(this.xlsxImportPhylibService.MessDataImp)
			for (let c = 0, l = this.xlsxImportPhylibService.MessDataImp.length;c < l; c += 1) {

				
				if (Number(this.xlsxImportPhylibService.MessDataImp[c]._Messstelle)===mst_id_alt){

					this.xlsxImportPhylibService.MessDataImp[c]._Messstelle=mst_id_neu;
				}
			}
			
	
		}});
	  }


/**
 * Bestimmt und setzt die anzeigbaren Spalten basierend auf der angegebenen Verfahrens-ID.
 * 
 * @param idverfahren - Die ID des Verfahrens, um zu bestimmen, welche Spalten angezeigt werden sollen.
 * 
 * Diese Methode führt die folgenden Aktionen aus:
 * - Setzt die Tab-Variable basierend auf der Verfahrens-ID.
 * - Ruft die Methode `waehleSpaltenUebersicht` des `xlsxImportPhylibService` auf, um zu bestimmen, welche Spalten angezeigt werden sollen.
 * - Setzt die Eigenschaften `displayColumnNames` und `dynamicColumns` aus dem `xlsxImportPhylibService`.
 * - Setzt die Eigenschaft `uebersicht` und initialisiert die `dataSource` mit einer neuen `MatTableDataSource`.
 * - Konfiguriert den Paginator für die Datenquelle.
 */
displayableColumns(idverfahren:number){
	let tab:number;
	if (idverfahren===4 || idverfahren===5) {tab=2;} else {tab=0;}
	
	this.showHandleRowClick=this.xlsxImportPhylibService.waehleSpaltenUebersicht(idverfahren,this.valExceltabsService.valspalten,tab);
	this.displayColumnNames=this.xlsxImportPhylibService.displayColumnNames;
	this.dynamicColumns=this.xlsxImportPhylibService.dynamicColumns;

	this.uebersicht = this.xlsxImportPhylibService.uebersicht;
	this.dataSource = new MatTableDataSource(this.xlsxImportPhylibService.uebersicht);
	this.dataSource.paginator = this.paginator;
	this.paginator._intl.itemsPerPageLabel="Zeilen pro Seite";
}
	/**
	 * Handhabt das Klick-Ereignis auf eine Zeile in der Tabelle.
	 * 
	 * @param row - Das Zeilenobjekt, das angeklickt wurde.
	 * 
	 * Diese Methode führt die folgenden Aktionen aus:
	 * - Überprüft, ob die `NrVerfahren`-Eigenschaft von `valExceltabsService` gleich 6 ist.
	 *   - Wenn wahr, setzt `Datimptabphyto` auf true und `Datimptab` auf false.
	 *   - Andernfalls setzt `Datimptab` auf true und `Datimptabphyto` auf false.
	 * - Filtert das `MessDataOrgi`-Array, um Elemente zu finden, bei denen `_Messstelle` mit `row.mst` übereinstimmt.
	 * - Weist das gefilterte Ergebnis `MessData` zu.
	 * - Protokolliert das `row`-Objekt in der Konsole.
	 */
	
	handleRowClick(row){
		if (this.valExceltabsService.NrVerfahren===6){
		this.Datimptabphyto=true;
		this.Datimptab=false;}
		else{
		this.Datimptab=true;
		this.Datimptabphyto=false;}	
		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== row.mst);
		this.MessData=messgroup;
		console.log(row);
	}
	
		/**
		 * Bestimmt die Farbe basierend auf den angegebenen booleschen Werten.
		 *
		 * @param Wert1 - Der erste boolesche Wert zur Bewertung.
		 * @param Wert2 - Der zweite boolesche Wert zur Bewertung.
		 * @returns Die Farbe, die vom Farbebewertg-Dienst basierend auf den Eingabewerten bestimmt wird.
		 */
	getColorFehler(Wert1:boolean,Wert2:boolean){

		return this.Farbebewertg.getColorFehler(Wert1,Wert2);
	  }
	 
	
	/**
	 * Startet den Ladeprozess, indem das `isLoading$` Observable auf true gesetzt wird,
	 * was einen Spinner aktiviert, und "startLoading" in die Konsole schreibt.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn der Ladeprozess startet.
	 */
	  async startLoading() {
		this.isLoading$.next(true); // Spinner aktivieren
		console.log("startLoading");
	}
	
	/**
	 * Stoppt den Ladeprozess, indem das isLoading$ Observable auf false gesetzt wird.
	 * Dies deaktiviert den Spinner und schreibt eine Nachricht in die Konsole.
	 *
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn der Ladeprozess gestoppt ist.
	 */
	
	async stopLoading() {
		this.isLoading$.next(false); // Spinner aktivieren
		console.log("stopLoading");
	}
}

/**
 * Vergleicht zwei Werte vom Typ number, string oder boolean.
 *
 * @param a - Der erste zu vergleichende Wert.
 * @param b - Der zweite zu vergleichende Wert.
 * @param isAsc - Ein boolescher Wert, der angibt, ob der Vergleich in aufsteigender Reihenfolge erfolgen soll.
 * @returns Eine negative Zahl, wenn `a` kleiner als `b` ist, eine positive Zahl, wenn `a` größer als `b` ist, oder 0, wenn sie gleich sind.
 */

function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
	


