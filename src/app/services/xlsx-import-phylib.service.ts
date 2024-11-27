import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';

import { MstIndex } from '../interfaces/mst-index';
import { Uebersicht } from '../interfaces/uebersicht';
import { Messwerte } from '../interfaces/messwerte';
import { MessstellenImp } from '../interfaces/messstellen-imp';
import {UebersichtImportService} from 'src/app/services/uebersicht-import.service';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
/**
 * Dienstklasse zum Importieren und Verarbeiten von Daten aus Excel-Arbeitsmappen für die Phylib-Bewertung.
 * 
 * Dieser Dienst bietet Methoden zur Handhabung verschiedener Operationen im Zusammenhang mit dem Import von Daten aus Excel-Dateien,
 * einschließlich Abrufen von Daten aus externen Diensten, Verarbeiten und Validieren der Daten sowie Importieren in die Datenbank.
 * 
 * @author Dr. Jens Päzolt, UmweltSoft
 * @date 20-10-2024
 * @bemerkungen
 * Der Dienst umfasst Methoden für:
 * - Abrufen verschiedener Datentypen (z.B. Arten, Formen, Tiefen, Einheiten, ParameterAbiot) aus externen Diensten.
 * - Konvertieren von Observables in Promises für asynchrone Operationen.
 * - Importieren und Verarbeiten von Daten aus Excel-Arbeitsmappen.
 * - Handhaben und Validieren von Daten für Messstellen und Messwerte.
 * - Gruppieren und Verarbeiten von Daten basierend auf verschiedenen Kriterien.
 * - Importieren von Daten in die Datenbank und Handhaben potenzieller Duplikate.
 * 
 * @beispiel
 * ```typescript
 * const xlsxImportService = new XlsxImportPhylibService(impPhylibServ, UebersichtImportService);
 * await xlsxImportService.ngOnInit();
 * await xlsxImportService.PhylibBewertungimport(workbook, valspalten, tab, verfahrennr);
 * ```
 * 
 * @param impPhylibServ - Der Dienst zur Handhabung von Phylib-Importoperationen.
 * @param UebersichtImportService - Der Dienst zur Handhabung von Importübersichtsoperationen.
 * 
 * @property {string} MstDoppelteDS - Ein String zum Speichern doppelter Datensätze.
 * @property {any} einheiten - Speichert Einheitsdaten.
 * @property {any} mst - Speichert Messstellendaten.
 * @property {any} formen - Speichert Formdaten.
 * @property {any} arten - Speichert Artendaten.
 * @property {any} tiefen - Speichert Tiefendaten.
 * @property {any} arrayBuffer - Speichert Array-Puffer-Daten.
 * @property {boolean} mstimptab - Gibt an, ob der Messstellen-Import-Tab aktiv ist.
 * @property {boolean} Datimptab - Gibt an, ob der Datenimport-Tab aktiv ist.
 * @property {Date} newDate - Speichert ein neues Datum.
 * @property {string} InfoBox - Speichert Informationsnachrichten.
 * @property {any} MWausDB - Speichert Messwerte aus der Datenbank.
 * @property {any} tempMst - Speichert temporäre Messstellendaten.
 * @property {any} parameterabiot - Speichert abiotische Parameterdaten.
 * @property {Uebersicht} _uebersicht - Speichert Übersichtsdatensätze.
 * @property {number} importierteMesswerte - Speichert die Anzahl der importierten Messwerte.
 * @property {number} importierteMst - Speichert die Anzahl der importierten Messstellen.
 * @property {UebersichtImport} uebersichtImport - Speichert Importübersichtsdaten.
 * @property {boolean} vorhanden - Gibt an, ob Daten bereits vorhanden sind.
 * @property {boolean} vorhandenMst - Gibt an, ob Messstellen bereits vorhanden sind.
 * @property {string} bemerkungImpMW - Speichert Bemerkungen zu importierten Messwerten.
 * @property {Messwerte[]} MessData - Speichert Messdaten.
 * @property {Messwerte[]} MessDataOrgi - Speichert originale Messdaten.
 * @property {Messwerte[]} MessDataImp - Speichert importierte Messdaten.
 * @property {MessstellenImp[]} messstellenImp - Speichert importierte Messstellen.
 * @property {Uebersicht[]} uebersicht - Speichert Übersichtsdatensätze.
 * @property {Uebersicht[]} uebersichtGeprueft - Speichert geprüfte Übersichtsdatensätze.
 * @property {string[]} displayColumnNames - Speichert Anzeigespaltennamen.
 * @property {string[]} dynamicColumns - Speichert dynamische Spalten.
 * @property {MstIndex[]} mstindex - Speichert Messstellenindizes.
 */
export class XlsxImportPhylibService {

	constructor(private impPhylibServ: ImpPhylibServ,
		private UebersichtImportService:UebersichtImportService) { }

	public MstDoppelteDS:string;
	public einheiten: any;
	public mst: any;
	public formen: any;
	public arten: any;
	public tiefen: any;
	arrayBuffer: any;
	public mstimptab: boolean = false;
	public Datimptab: boolean = false;
	newDate: Date;
	public InfoBox: string = "";
	public MWausDB: any;
	public tempMst: any;
	public parameterabiot: any;
	public _uebersicht:Uebersicht;
	public importierteMesswerte:number;
	public importierteMst:number;
	public uebersichtImport:UebersichtImport;
	vorhanden: boolean;
	vorhandenMst: boolean;
	public bemerkungImpMW:string="";
	
	public MessData: Messwerte[] = []; public MessDataOrgi: Messwerte[] = []; //public MessDataGr: Messgroup[] = []; 
	public MessDataImp: Messwerte[] = []; public messstellenImp: MessstellenImp[] = [];
	public uebersicht:Uebersicht[]=[];
	public uebersichtGeprueft:Uebersicht[]=[];
	displayColumnNames:string[]=[];
	dynamicColumns:string[]=[];
	mstindex:MstIndex[]=[];

	/**
	 * Ruft die Liste der Arten (Spezies) vom Phylib-Dienst ab und weist sie zu.
	 * 
	 * Diese Methode ruft die Methode `getArtenPhylibMP` des `impPhylibServ`-Dienstes mit einem Parameter von `1` auf.
	 * Das Ergebnis wird der `arten`-Eigenschaft der Klasse zugewiesen.
	 * 
	 * Wenn ein Fehler während des Dienstaufrufs auftritt, wird die Fehlermeldung der `InfoBox`-Eigenschaft hinzugefügt.
	 */
	callarten() {
		

		this.impPhylibServ.getArtenPhylibMP(1).subscribe(arten_ => {
			this.arten = arten_;
			//console.log(this.arten);
			//return einheiten;
		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
	}
	

	
	/**
	 * Initialisiert die Komponente durch Abrufen verschiedener Daten vom Dienst.
	 * 
	 * Diese Methode wird aufgerufen, wenn die Komponente initialisiert wird. Sie führt die folgenden Aktionen aus:
	 * - Ruft "formen"-Daten vom Dienst ab und weist sie der Eigenschaft `this.formen` zu.
	 * - Ruft "tiefen"-Daten vom Dienst ab und weist sie der Eigenschaft `this.tiefen` zu.
	 * - Ruft "einheiten"-Daten vom Dienst ab und weist sie der Eigenschaft `this.einheiten` zu.
	 * - Ruft "parameterabiot"-Daten vom Dienst ab und weist sie der Eigenschaft `this.parameterabiot` zu.
	 * 
	 * Wenn eine der Abrufoperationen fehlschlägt, wird eine Fehlermeldung der Eigenschaft `this.InfoBox` hinzugefügt und der Fehler wird in der Konsole protokolliert.
	 * 
	 * @async
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn alle Daten abgerufen wurden.
	 */
	async ngOnInit() {
		try {
			// Using firstValueFrom to convert the observable to a promise
			this.formen = await firstValueFrom(this.impPhylibServ.getFormen());
			//console.log(this.formen);
		  } catch (err) {
  // Asserting that err is an instance of Error
  const errorMessage = (err as Error).message;
  this.InfoBox += " " + errorMessage;
  console.error('Error fetching formen:', errorMessage);
}

		

try {
	// Converting the Observable to a Promise using firstValueFrom
	this.tiefen = await firstValueFrom(this.impPhylibServ.getTiefen());
	// console.log(this.tiefen);
  } catch (err: unknown) {
	// Using a type guard to check and access the error message
	if (err instanceof Error) {
	  this.InfoBox += " " + err.message;
	} else {
	  this.InfoBox += " An error occurred.";
	}
	console.error('Error fetching tiefen:', err);
  }

		

		
		try {
			this.einheiten = await firstValueFrom(this.impPhylibServ.getEinheiten());
			// console.log(this.einheiten);
		  } catch (err: unknown) {
			// Using a type guard to check and access the error message
			if (err instanceof Error) {
			  this.InfoBox += " " + err.message;
			} else {
			  this.InfoBox += " An error occurred.";
			}
			console.error('Error fetching tiefen:', err);
		  }
		
		  try {
			this.parameterabiot = await firstValueFrom(this.impPhylibServ.getParameterAbiot());
		  } catch (err: unknown) {
			// Using a type guard to check and access the error message
			if (err instanceof Error) {
			  this.InfoBox += " " + err.message;
			} else {
			  this.InfoBox += " An error occurred.";
			}
			console.error('Error fetching tiefen:', err);
		  }


	}

	/**
	 * Ruft asynchron die MST-Daten mithilfe des impPhylibServ-Dienstes ab und weist sie der mst-Eigenschaft zu.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die MST-Daten abgerufen und zugewiesen wurden.
	 */
	async holeMst() {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.getMst().forEach(value => {
			this.mst = value;
			// console.log('observable -> ' + value);
		});
	}
		/**
		 * Importiert und verarbeitet Daten aus einer Excel-Arbeitsmappe für die Phylib-Bewertung.
		 * 
		 * @param workbook - Die Excel-Arbeitsmappe, aus der die Daten importiert werden sollen.
		 * @param valspalten - Ein Array von Spaltendefinitionen, die zum Filtern und Verarbeiten der Daten verwendet werden.
		 * @param tab - Der Index des zu verarbeitenden Blattes innerhalb der Arbeitsmappe.
		 * @param verfahrennr - Die Verfahrensnummer, die zum Filtern der Spaltendefinitionen verwendet wird.
		 * 
		 * @returns Ein Versprechen, das aufgelöst wird, wenn der Import und die Verarbeitung abgeschlossen sind.
		 */
	async PhylibBewertungimport(workbook, valspalten: any, tab: number,verfahrennr : number) {
		await this.holeMst();
		this.displayColumnNames=[];
		this.dynamicColumns=[];
		this.displayColumnNames.push('Nr');
		this.dynamicColumns.push('nr');
		
		
		this.uebersicht=[];
		var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
		this.messstellenImp = [];
		tab = tab - 1;
		let XL_row_object;
		let json_Messstelle; var Messstelle: string; let mstOK: string;
		let bidmst; let bidpara; let bideinh; let bwert;
		// for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {
			const valspaltenfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === tab);
	
		
		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
		const valspaltenfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1);

		
		XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tab]]);
		json_Messstelle = JSON.stringify(XL_row_object);
		const obj = JSON.parse(json_Messstelle);
		// if (workbook.SheetNames[i] == 'Messstellen' || workbook.SheetNames[i] == 'Messstelle') {
			await  obj.forEach((val, index) => {
			if (obj[index] !== null) {
				if (index>0){this.groupNAch();}
				this._uebersicht= {} as Uebersicht;
				for (var i in obj[index]) {
					

					if (i === valspaltenfiterMst[0].spalten_name) {
						Messstelle = obj[index][i];
						if (Messstelle !== null) {
							let mstee = this.mst.filter(messstellen => messstellen.namemst == Messstelle);
							// Messstelle=null; Makrophytentyp=null; Diatomeentyp=null; WRRLTyp=null; Phytobenthostyp=null; Veggrenze=null; Makrophytenveroedung=null; Begruendung=null; Helophytendominanz=null; Oekoregion=null; mstOK=null; Gesamtdeckungsgrad=null;
							
							if (
								mstee.length !== 0) {
								mstOK = "";
								bidmst = mstee[0].id_mst;
							}
							else {

								mstOK = "checked";
							}

						}
						this._uebersicht.mst=Messstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
				
						
						
							
					} else {
						const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);
						const valspaltenfiteranzeige2 =valspaltenfiteranzeige.filter(excelspalten => excelspalten.spalten_name === i);

						if (valspaltenfiter2.length === 1) {
							//Oekoregion = obj[index][i];
							//let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);
							bwert = obj[index][i];

							bidpara = valspaltenfiter2[0].id_para;

							bideinh = valspaltenfiter2[0].id_einheit;
							
							this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht });
							this.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
							
							
							if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){

								
							}
						
						}

					}



				}
			}
		})
	//console.log(this.messstellenImp);
	this.dynamicColumns.push('fehler1');this.dynamicColumns.push('actions');}

/**
 * Aktualisiert die angegebene Spalte in der Übersicht mit dem gegebenen Wert und setzt optional das Jahr.
 *
 * @param Spalte - Die zu aktualisierende Spalte (z.B. "sp3", "sp4", etc.).
 * @param wert - Der Wert, der für die angegebene Spalte gesetzt werden soll.
 * @param jahr - Optional. Das Jahr, das in der Übersicht gesetzt werden soll.
 */
schalteSpalte(Spalte:string,wert:string,jahr?:string) {

	// this._uebersicht=null;this._uebersicht= {} as Uebersicht;
	// console.log()

	if (jahr!==undefined){this._uebersicht.jahr=jahr;}
	
	switch(Spalte) { 
		case "sp3": { 
			this._uebersicht.sp3= wert;
		   break; 
		} 
		case "sp4": { 
			this._uebersicht.sp4= wert;
		   break; 
		} 
		case "sp5": { 
			this._uebersicht.sp5= wert;
		   break; 
		} 
		case "sp6": { 
			this._uebersicht.sp6= wert;
		   break; 
		} 
		case "sp7": { 
			this._uebersicht.sp7= wert;
		   break; 
		} 
		case "sp8": { 
			this._uebersicht.sp8= wert;
		   break; 
		} 
		case "sp9": { 
			this._uebersicht.sp9= wert;
		   break; 
		} 
		case "sp10": { 
			this._uebersicht.sp10= wert;
		   break; 
		} 
		case "sp11": { 
			this._uebersicht.sp11= wert;
		   break; 
		} 
		case "sp12": { 
			this._uebersicht.sp12= wert;
		   break; 
		} 
		case "sp13": { 
			this._uebersicht.sp13= wert;
		   break; 
		} 
		default: { 
		   //statements; 
		   break; 
		} 
	 } 

}


//findet die Spaltennummer für die Mst_Spalte (wenn nicht die erste, gibt es sonst truble)
/**
 * Extrahiert und indiziert spezifische Spaltenwerte aus einem angegebenen Blatt in einer Excel-Arbeitsmappe.
 *
 * @param workbook - Das Excel-Arbeitsmappenobjekt.
 * @param spaltennameMst - Der Name der Spalte, aus der Werte extrahiert werden sollen.
 * @param tabNrMst - Der Index des Blattes, das innerhalb der Arbeitsmappe verarbeitet werden soll.
 *
 * Diese Funktion iteriert durch die Blätter in der Arbeitsmappe, identifiziert das angegebene Blatt anhand seines Index,
 * konvertiert die Blattdaten in JSON und extrahiert dann Werte aus der angegebenen Spalte. Die extrahierten Werte
 * und ihre entsprechenden Zeilenindizes werden im `mstindex`-Array gespeichert.
 */
funktionIndexMst(workbook,spaltennameMst:string,tabNrMst:number) {
	this.mstindex=[];
	for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1)   {
		if (i===tabNrMst){
			let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
			let json_Messstelle = JSON.stringify(XL_row_object);
			const obj = JSON.parse(json_Messstelle);
			obj.forEach((val, indexe) => {
			for (var a in obj[indexe]) {
				if (a === spaltennameMst) {
					spaltennameMst
					
					this.mstindex.push({mst:obj[indexe][a],index:indexe});
					
				}

			}
		})}
	}
// console.log(this.mstindex);	
}


		/**
		 * Importiert Daten aus einer Excel-Arbeitsmappe in die Anwendung.
		 * 
		 * @param workbook - Die Excel-Arbeitsmappe, aus der die Daten importiert werden sollen.
		 * @param valspalten - Ein Array von Spaltenkonfigurationen für den Import.
		 * @param tabMST - Der Index des Blattes, das die Messstationsdaten enthält.
		 * @param tabMW - Der Index des Blattes, das die Messdaten enthält.
		 * @param verfahrennr - Die Verfahrensnummer für den Import.
		 * 
		 * @returns Ein Versprechen, das aufgelöst wird, wenn der Import abgeschlossen ist.
		 * 
		 * @remarks
		 * Diese Methode verarbeitet die bereitgestellte Excel-Arbeitsmappe, extrahiert Daten basierend auf den bereitgestellten Spaltenkonfigurationen und der Verfahrensnummer.
		 * Sie füllt verschiedene Arrays und Objekte mit den importierten Daten, einschließlich Messstationen und Messwerten.
		 * Die Methode führt auch Validierungen und Filterungen basierend auf den bereitgestellten Konfigurationen durch.
		 * 
		 * @example
		 * ```typescript
		 * const workbook = XLSX.readFile('path/to/excel/file.xlsx');
		 * const valspalten = [...]; // Spaltenkonfigurationen definieren
		 * const tabMST = 0; // Index des Blattes mit den Messstationsdaten
		 * const tabMW = 1; // Index des Blattes mit den Messdaten
		 * const verfahrennr = 123; // Verfahrensnummer
		 * 
		 * await Phylibimport(workbook, valspalten, tabMST, tabMW, verfahrennr);
		 * ```
		 */
	async Phylibimport(workbook,valspalten: any, tabMST: number,tabMW: number,verfahrennr : number) {
		let array: Messwerte[] = []; this.uebersicht = []; this.MessDataOrgi = [];
		//let reader = new FileReader();
		await this.holeMst();
		var sheets;let importp:string;
		var Messstelle: string; var Probe: string; var Taxon; var Form: string; var Messwert; var Einheit; var Tiefe; var cf;let RLD;
		let aMessstelle: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
		// var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
		let bidmst; let bidpara; let bideinh; let bwert;
		let mstOK: string; let ok: string;
		let XL_row_object;
		let json_Messstelle;
		this._uebersicht= {} as Uebersicht;
		let mst: string;

		//welche Spalte in der Übersicht
		const valspaltenfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === tabMST);
		const valtabfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.id_tab === tabMST);

		
		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
		const valspaltenfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1);

			for (let a = 0, l = workbook.SheetNames.length; a < l; a += 1)   {



			//console.log(workbook.SheetNames[i]);
			XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[a]]);
			json_Messstelle = JSON.stringify(XL_row_object);
			const obj = JSON.parse(json_Messstelle);
			if (a === valtabfiterMst[0].id_tab) {
				await obj.forEach((val, index) => {
					if (obj[index] !== null) {

						//index für jede Messstelle ermitteln und in Array abspeichern
						this.funktionIndexMst(workbook,valspaltenfiterMst[0].spalten_name,valtabfiterMst[0].id_tab);





						for (var i in obj[index]) {
							//var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
							if (index > 0) {
								
								  this.groupNAch();
								  this._uebersicht= {} as Uebersicht;
								  
								}	

							if (i === valspaltenfiterMst[0].spalten_name) {
								//if (index > 0) { console.log("Insert into Messstellen (Messstelle, Oekoregion, Makrophytenveroedung, Begruendung,Helophytendominanz,Diatomeentyp,Phytobenthostyp,Makrophytentyp,WRRLTyp,Gesamtdeckungsgrad) values ('" + Messstelle + "','" + Oekoregion + "','" + Makrophytenveroedung + "','" + Begruendung + "','" + Helophytendominanz + "','" + Diatomeentyp + "','" + Phytobenthostyp + "','" + Makrophytentyp + "','" + WRRLTyp + "','" + Gesamtdeckungsgrad + "');"); }
								Messstelle = obj[index][i];
								if (Messstelle !== null) {
									let mstee = this.mst.filter(messstellen => messstellen.namemst == Messstelle);

									//console.log(mst);

									if (
										mstee.length !== 0) {
										mstOK = "";
										importp="checked";
										bidmst = mstee[0].id_mst;
									}
									else {

										mstOK = "checked";
										importp="";
									}

										
								}	
								
								
								this._uebersicht.mst=Messstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";this._uebersicht.import1=importp;
					
							} else
								
							//+++++++++++++

							{
								const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);
								const valspaltenfiteranzeige2 =valspaltenfiteranzeige.filter(excelspalten => excelspalten.spalten_name === i);
		
								if (valspaltenfiter2.length === 1) {
									//Oekoregion = obj[index][i];
									//let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);
									bwert = obj[index][i];
		
									bidpara = valspaltenfiter2[0].id_para;
		
									bideinh = valspaltenfiter2[0].id_einheit;
									
									this.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
									const mstAusArray=this.mstindex.filter(exc=>exc.index===index)
									this._uebersicht.mst=mstAusArray[0].mst;this._uebersicht.import1=importp;
									this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht :this._uebersicht });
									
									if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){
		
										
									}
								
								}
		
							}
								
						 }
					}
				}

				)
			}
			if (workbook.SheetNames[a] == 'Messwerte') {

				//console.log(this.uebersicht);
				// Here is your object
				let o: number = 1;
				obj.forEach((val, index) => {
					if (obj[index] !== null) {
						for (var i in obj[index]) {
							//console.log(val + " / " + obj[index][i] + ": " + i);

							o = o + 1;


							if (i == 'Messstelle') {

								if (index > 0) { //console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
									//importfreigabe importp=true =>Freigabe
									
									array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
									this.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
									
									this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=ok;this._uebersicht.fehler3="";this._uebersicht.import1=importp;
									Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = ""; mstOK = "";RLD=null;
									aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
									this.groupNAch();
								}

								mst = obj[index][i];
								//aMessstelle=mst;
								//taxonzus=new Taxonzus();
								let mstee = this.mst.filter(messstellen => messstellen.namemst == mst);

								//console.log(mst);

								if (
									mstee.length !== 0) {
										mstOK = "";importp="checked";
									mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
								}
								else {
									aMessstelle = mst;
									mstOK = "checked";importp="";
								}
								
									
								//Messstelle = obj[index][i];
							}
							if (i == 'Probe') {
								aProbe = obj[index][i];
								Probe = '11';
							}
							if (i == 'Taxon') {
								//ok=false;
								Taxon = obj[index][i];
								let taxon_ = this.arten.filter(arten => arten.dvnr == Taxon);
								if (taxon_.length !== 0) { Taxon = taxon_[0].id_taxon; aTaxon = taxon_[0].taxon; RLD=taxon_[0].rld;
									ok = "";  } else {
									ok = "checked";
									var taxon2 = this.arten.filter(arten => arten.taxon == Taxon);
									if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon;ok = ""; Taxon = taxon2[0].id_taxon;RLD=taxon2[0].rld;  }


								}
							}
							if (i == 'Form') {
								Form;

								var employeeName: string = obj[index][i];

								//console.log(this.formen);
								//taxonzus=new Taxonzus();
								let taxonzus = this.formen.filter(formen => formen.importname == employeeName);

								//console.log(id_taxonzus);

								if (taxonzus.length >0) { Form = taxonzus[0].id_taxonzus; aForm = employeeName; }
								//ok = false;
							}
							if (i == 'Messwert') {
								Messwert = obj[index][i];

							}
							if (i == 'Einheit') {

								var EinheitName: string = obj[index][i];
								let einh = this.einheiten.filter((einheit) => einheit.importname == EinheitName);
								if (einh !== null) {
									Einheit = einh[0].id; aEinheit = EinheitName;
									//console.log('Einheit:'+Einheit);
								}
							}
							if (i == 'Tiefenbereich') {

								var TiefenName: string = obj[index][i];
								let tief = this.tiefen.filter((tiefe) => tiefe.importname == TiefenName);
								if (tief !== null) {
									Tiefe = tief[0].id_tiefe; aTiefe = TiefenName;
									//console.log('Einheit:'+Einheit);
								} else { Tiefe = 1; aTiefe = "" }

							}
							if (i == 'cf') {
								var cftemp = obj[index][i];
								if  (cftemp===0){

									cf = false

								}else {  cf = true;}
								


							} 
						}
					}
					
				})

				//of(array);
			}
		}
									array.push({ _Nr: array.length+1, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
									this.MessDataOrgi.push({ _Nr: array.length+1, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
								
		this.MessDataImp = array;
		
	}

		/**
		 * Gruppiert und verarbeitet Daten asynchron basierend auf der bereitgestellten Übersicht.
		 * 
		 * Diese Methode führt die folgenden Operationen aus:
		 * - Extrahiert verschiedene Eigenschaften aus dem `_uebersicht`-Objekt.
		 * - Überprüft, ob die `mst`-Eigenschaft definiert ist.
		 * - Wenn das `uebersicht`-Array leer ist, fügt es ein neues Objekt mit den extrahierten Eigenschaften hinzu.
		 * - Wenn das `uebersicht`-Array nicht leer ist, filtert es das Array, um passende `mst`-Werte zu finden.
		 * - Wenn keine passenden `mst`-Werte gefunden werden, fügt es ein neues Objekt mit den extrahierten Eigenschaften hinzu.
		 * - Wenn ein passender `mst`-Wert gefunden wird, aktualisiert es das bestehende Objekt mit neuen Werten und erhöht die `anzahl`-Eigenschaft.
		 * - Handhabt verschiedene Bedingungen, um die Eigenschaften `import1`, `fehler1`, `fehler2` und `fehler3` basierend auf den extrahierten Werten zu setzen.
		 * 
		 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
		 */
	async groupNAch() {
		// console.log(this._uebersicht);
		let mst: string=this._uebersicht.mst;
		let jahr: string=this._uebersicht.jahr;
		let _sp3: string=this._uebersicht.sp3;
		let _sp4: string=this._uebersicht.sp4;
		let _sp5: string=this._uebersicht.sp5;
		let _sp6:string=this._uebersicht.sp6;
		let _sp7: string=this._uebersicht.sp7;
		let _sp8: string=this._uebersicht.sp8;
		let _sp9: string=this._uebersicht.sp9;
		let _sp10: string=this._uebersicht.sp10;
		let _sp11: string=this._uebersicht.sp11;
		let _sp12: string=this._uebersicht.sp12;
		let _sp13: string=this._uebersicht.sp13;
		let _fehler1: string=this._uebersicht.fehler1;
		let  _fehler2: string=this._uebersicht.fehler2;
		let _fehler3: string=this._uebersicht.fehler3;
		let importp:string=this._uebersicht.import1;
		
		if (mst!==undefined){
		if (this.uebersicht.length == 0) {

			if (_fehler1 === "" && _fehler2==="" ) { importp = "checked"; } else {importp="";}
			
			 this.uebersicht.push({ nr: this.uebersicht.length + 1,jahr:jahr, mst: mst, anzahl: 0, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3,import1:importp});

		} else {
			//let messgroup = this.uebersicht.filter(dd => dd.mst === mst);
			let messgroup = this.uebersicht.filter(dd => dd.mst === mst && dd.jahr === jahr);

			if (messgroup.length === 0) {
				//nur BEwertungsdaten=Exportdateien
				if (_fehler1 === "" && _fehler2==="" ) { importp = "checked"; } else {importp="";}
				this.uebersicht.push({ nr: this.uebersicht.length + 1, mst: mst, anzahl: 0,jahr:jahr, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3,import1:importp});

			//	this.MessDataGr.push({ _Nr: this.MessDataGr.length + 1, _Messstelle: mst, _AnzahlTaxa: 0, _TypMP: _typmp, _TypDIA: _typdia, _TypWRRL: _typwrrl, _TypPhytoBenthos: _typphytobenth, _UMG: _umg, _Veroedung: _veroedung, _B_veroedung: _b_veroedung, _Helo_dom: _helo_dom, _Oekoreg: _oekoreg, MstOK: mstok, OK: ok, KeineMP: keinemp, gesamtdeckg: _gesamtdeckg },);
			}
			else {

				let i= this.uebersicht.findIndex(x=>x.mst===mst);
				// for (let i = 0, l = this.uebersicht.length; i < l; i += 1) {

					if (this.uebersicht[i].mst === mst && this.uebersicht[i].jahr === jahr) {
						var _nr_: number = this.uebersicht[i].nr;
						var _mst_: string = this.uebersicht[i].mst;
						var _anzahl_: number = this.uebersicht[i].anzahl + 1;
						this.uebersicht[i].jahr=jahr;
						if (this.uebersicht[i].sp3!==undefined){ _sp3 = this.uebersicht[i].sp3};
						if (this.uebersicht[i].sp4!==undefined){_sp4 = this.uebersicht[i].sp4};
						if (this.uebersicht[i].sp5!==undefined){
							// console.log(this.uebersicht[i].sp5);
							_sp5 = this.uebersicht[i].sp5};
						if (this.uebersicht[i].sp6!==undefined){_sp6 = this.uebersicht[i].sp6};
						if (this.uebersicht[i].sp7!==undefined){var _sp7_: string = this.uebersicht[i].sp7}else{var _sp7_=_sp7};
						if (this.uebersicht[i].sp8!==undefined){var _sp8_: string = this.uebersicht[i].sp8}else{var _sp8_=_sp8};
						if (this.uebersicht[i].sp9!==undefined){var _sp9_: string = this.uebersicht[i].sp9}else{var _sp9_=_sp9};
						if (this.uebersicht[i].sp10!==undefined){var _sp10_: string = this.uebersicht[i].sp10}else{var _sp10_=_sp10};
						if (this.uebersicht[i].sp11!==undefined){var _sp11_: string = this.uebersicht[i].sp11};
						if (this.uebersicht[i].sp12!==undefined){var _sp12_: string = this.uebersicht[i].sp12};
						if (this.uebersicht[i].sp13!==undefined){var _sp13_: string = this.uebersicht[i].sp13};
						let _fehler1_:string;
						let _fehler2_:string;
						let _fehler3_:string;
						let _importp:string;
						

						
						if (this.uebersicht[i].fehler1 === "checked") { _fehler1_ = "checked"; } else { _fehler1_ = ""; }
						if (this.uebersicht[i].fehler2 === "checked" || _fehler2==="checked" ) { _fehler2_ = "checked"; } else {}
						// console.log(this.uebersicht[i].import1);
						if (this.uebersicht[i].anzahl === 0) { _fehler3_ = "checked"; } else { _fehler3_ = ""; };
						if (importp!==undefined && this.uebersicht[i].import1!==undefined){
						if (importp === "" || this.uebersicht[i].import1==="" ) { 
							_importp = ""; } else {
								_importp="checked";}
						if (_fehler1_==="checked"  ||_fehler2==="checked" ){_importp = "";}
						}


						this.uebersicht.splice(i, 1);//löscht vorhandenen DS
						this.uebersicht.push({ nr:_nr_, mst: _mst_, jahr:jahr,anzahl: _anzahl_, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7_, sp8: _sp8_, sp9: _sp9_, sp10: _sp10_, sp11: _sp11_,sp12: _sp12_, sp13: _sp13_,fehler1: _fehler1_, fehler2: _fehler2_, fehler3: _fehler3_,import1:_importp});

						//this.MessDataGr.push({ _Nr, _Messstelle, _AnzahlTaxa, _TypMP, _TypDIA, _TypWRRL, _TypPhytoBenthos, _UMG, _Veroedung, _B_veroedung, _Helo_dom, _Oekoreg, MstOK, OK, KeineMP, gesamtdeckg: agesamtdeckg });
						 //
					
					}
				
			}

		}}
		// console.log(this.uebersicht);
	}

/**
 * Berechnet die Anzahl der importierten, eindeutigen Messstellen.
 *
 * @returns {number} Die Anzahl der eindeutigen Messstellen.
 */
anzahlMstImp():number{
let anzahlmst:number=0;
let TempSet:number[]  = [];
for (let a = 0, le = this.messstellenImp.length; a < le; a += 1) {
	
	const temp:number=this.messstellenImp[a].id_mst ;
	TempSet.push(temp);
}
const distinctArr=TempSet.filter((value,index,self)=>self.indexOf(value)===index)
		
anzahlmst=  distinctArr.length;

return anzahlmst;
}

/**
 * Überprüft auf doppelte Messwerte in den importierten Daten.
 *
 * Diese Methode iteriert durch das `MessDataImp`-Array, kombiniert verschiedene Eigenschaften jedes Elements zu einem String
 * und speichert diese Strings in einem temporären Array. Anschließend erstellt sie ein Array mit eindeutigen Werten dieser kombinierten Strings
 * und vergleicht dessen Länge mit der Länge des ursprünglichen Arrays, um festzustellen, ob Duplikate vorhanden sind.
 *
 * @returns {boolean} - Gibt `true` zurück, wenn doppelte Messwerte gefunden werden, andernfalls `false`.
 */
doppelteMesswerte(): boolean {
	// Temporäres Array, um doppelte Messstellen zu speichern
	let MstDoppelteDSTemp: string[] = [];
	// Antwort, die angibt, ob doppelte Messwerte gefunden wurden
	let antwort: boolean = false;
	// Temporäres Array, um kombinierte Werte zu speichern
	let TempSet: string[] = [];
	// Temporäres Array, um Messstellen und kombinierte Werte zu speichern
	let Temp2Set: { Mst: string, temp: string }[] = [];
	// Länge des Arrays mit eindeutigen Werten
	let laengeArrDistinct: number;
	// Länge des ursprünglichen Arrays
	let laengeArrOrg: number = this.MessDataImp.length;
  
	// Schleife durch das ursprüngliche Array
	for (let a = 0, le = this.MessDataImp.length; a < le; a += 1) {
	  // Kombiniere verschiedene Eigenschaften zu einem String
	  const temp: string = this.MessDataImp[a]._Messstelle + "," + this.MessDataImp[a]._Einheit + "," + this.MessDataImp[a]._Datum + "," + this.MessDataImp[a]._Form + "," + this.MessDataImp[a]._Taxon + "," + this.MessDataImp[a]._Tiefe;
	  // Füge den kombinierten String zum TempSet hinzu
	  TempSet.push(temp);
	  console.log(temp);
	  // Füge die Messstelle und den kombinierten String zum Temp2Set hinzu
	  Temp2Set.push({ Mst: this.MessDataImp[a]._Messstelle, temp: temp });
	}
  
	// Erstelle ein Array mit eindeutigen Werten aus TempSet
	const distinctArr = TempSet.filter((value, index, self) => self.indexOf(value) === index);
	// Bestimme die Länge des Arrays mit eindeutigen Werten
	laengeArrDistinct = distinctArr.length;
  
	// Setze die Antwort auf true, wenn die Länge des ursprünglichen Arrays größer ist als die Länge des Arrays mit eindeutigen Werten
	antwort = laengeArrOrg > laengeArrDistinct;
  
	
  
	// Gib die Antwort zurück
	return antwort;
  }

	  //wenn in Phytoseeexport Jahre mitgeliefert werden
	/**
	 * Überprüft asynchron, ob abiotische Messwerte für ein bestimmtes Jahr bereits vorhanden sind.
	 * 
	 * Diese Methode iteriert über eine Übersichtsliste (`uebersicht`) und für jeden Eintrag, der als "checked" markiert ist,
	 * wird ein Datumsstring unter Verwendung des Jahres aus dem Eintrag konstruiert. Anschließend werden die Messwerte
	 * aus der Datenbank für dieses Datum abgerufen. Wenn Messwerte gefunden werden, die mit der Messstation und den Parametern
	 * aus den importierten Daten übereinstimmen, wird eine Flagge (`vorhanden`) auf true gesetzt und die Daten nach der Überprüfung gruppiert.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
	 */
	  async pruefeObMesswerteAbiotikschonVorhandenmitJahr() {
		let jahrtemp: string; this.vorhanden = false;
		
		
		for (let a = 0, le = this.uebersicht.length; a < le; a += 1) {
			
		if (this.uebersicht[a].import1==="checked"){ //import möglich
			jahrtemp = ('15.07.' + this.uebersicht[a].jahr); 
			await this.holeMesswerteAbiotikausDB(jahrtemp);
			// console.log(this.MWausDB);
			let mstee = this.mst.filter(messstellen => messstellen.namemst === this.uebersicht[a].mst);

			let mstID=mstee[0].id_mst;
			const messtellenImp_temp=this.messstellenImp.filter(g=>g.id_mst===mstID);
			const tmpMWteil=this.MWausDB.filter(g=>g.id_mst===mstID && messtellenImp_temp.some(m => m.id_para === g.id_para))


			if (tmpMWteil.length>0){ 
				this.vorhanden = true;
				this.groupNachPruefung(this.uebersicht[a]);
				// const relMW=this.MessDataImp.filter(g=>g._Messstelle===mstID);

		
	}}}

	  }
	/**
	 * Überprüft asynchron, ob Messwerte für das Jahr bereits vorhanden sind.
	 * 
	 * Diese Methode filtert die eindeutigen Messdaten nach Datum und iteriert durch jedes eindeutige Datum.
	 * Für jedes Datum ruft sie die Messwerte aus der Datenbank ab und überprüft, ob sie bereits vorhanden sind.
	 * Wenn die Messwerte in der Datenbank gefunden werden, aktualisiert sie die `vorhanden`-Flagge und gruppiert die Übersicht entsprechend.
	 * 
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
	 */
	  async pruefeObMesswerteschonVorhandenJahr() {
		this.uebersichtGeprueft=this.uebersicht;
		this.vorhanden = false;

		// probenehmer = '1';
		let i = 0;
		const distinctArray = this.MessDataImp.filter((value, index, self) => 
			index === self.findIndex((t) => (
			  t._Datum === value._Datum 
			))
		  );

		for (let i = 0; i < distinctArray.length; i++) {
			const element = distinctArray[i];
			
			let datum: string=element._Datum;
			await this.holeMesswerteausDB(datum);
			
			
			
		 

		
		if (this.MWausDB.length>0){
		for (let a = 0, le = this.uebersicht.length; a < le; a += 1) {

		if (this.uebersicht[a].import1==="checked"){ //import möglich


			let mstee = this.mst.filter(messstellen => messstellen.namemst === this.uebersicht[a].mst);

			let mstID=mstee[0].id_mst;
			const tmpMWteil=this.MWausDB.filter(g=>g.id_mst===mstID)


			if (tmpMWteil.length>0){ 

				const relMW=this.MessDataImp.filter(g=>g._Messstelle===mstID);

		for (let i = 0, l = relMW.length; i < l; i += 1) {
			const mw: Messwerte = relMW[i];
			
			
			

			const combi = this.MWausDB.filter(d => d.id_mst === mw._Messstelle && d.id_taxon === mw._Taxon && d.id_tiefe === mw._Tiefe && d.id_taxonzus === mw._Form && d.id_abundanz === mw._idAbundanz);
			

			if (combi.length > 0) {
				this.vorhanden = true;
				this.groupNachPruefung(this.uebersicht[a]);

				i = l;
			}

		}}}}}else {
			
			let combi = this.uebersicht.filter(d => d.import1 === "checked");
			if (combi!==null){
				if (combi.length>0)
				{this.vorhanden = false;}	else{

					this.vorhanden = true;}
			}
			


		}
		} this.uebersicht=this.uebersichtGeprueft;}

		/**
		 * Überprüft asynchron, ob Messwerte für ein bestimmtes Jahr bereits in der Datenbank vorhanden sind.
		 * 
		 * @param jahr - Das Jahr als String, um nach vorhandenen Messwerten zu suchen.
		 * @returns Ein Versprechen, das aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
		 * 
		 * Diese Methode führt die folgenden Schritte aus:
		 * 1. Setzt die Eigenschaft `uebersichtGeprueft` auf die aktuelle `uebersicht`.
		 * 2. Initialisiert die Eigenschaft `vorhanden` auf false.
		 * 3. Konstruiert einen temporären Datumsstring unter Verwendung des angegebenen Jahres.
		 * 4. Ruft Messwerte aus der Datenbank für das konstruierte Datum ab.
		 * 5. Wenn Messwerte in der Datenbank gefunden werden:
		 *    - Iteriert über das `uebersicht`-Array, um importierbare Einträge zu überprüfen.
		 *    - Filtert Messpunkte (`mst`), um passende Einträge zu finden.
		 *    - Überprüft, ob die Messwerte aus der Datenbank mit den importierten Messdaten übereinstimmen.
		 *    - Wenn eine Übereinstimmung gefunden wird, setzt die Eigenschaft `vorhanden` auf true und ruft die Methode `groupNAchPruefung` auf.
		 * 6. Wenn keine Messwerte in der Datenbank gefunden werden:
		 *    - Filtert das `uebersicht`-Array nach Einträgen, die als importierbar markiert sind.
		 *    - Setzt die Eigenschaft `vorhanden` basierend auf dem Vorhandensein importierbarer Einträge.
		 * 7. Stellt die Eigenschaft `uebersicht` auf ihren ursprünglichen Zustand zurück.
		 */
	async pruefeObMesswerteschonVorhanden(jahr: string) {
		this.uebersichtGeprueft=this.uebersicht;
		let jahrtemp: string; this.vorhanden = false;
		jahrtemp = ('15.07.' + jahr); 
		// probenehmer = '1';
		let i = 0;



		await this.holeMesswerteausDB(jahrtemp);
		if (this.MWausDB.length>0){
			// console.log(this.uebersicht);
		for (let a = 0, le = this.uebersicht.length; a < le; a += 1) {
			// console.log(this.uebersicht);
		if (this.uebersicht[a].import1==="checked"){ //import möglich
// console.log(this.uebersicht[a].mst);

			let mstee = this.mst.filter(messstellen => messstellen.namemst === this.uebersicht[a].mst);

			let mstID=mstee[0].id_mst;
			const tmpMWteil=this.MWausDB.filter(g=>g.id_mst===mstID)


			if (tmpMWteil.length>0){ 

				const relMW=this.MessDataImp.filter(g=>g._Messstelle===mstID);

		for (let i = 0, l = relMW.length; i < l; i += 1) {
			const mw: Messwerte = relMW[i];
			
			
			const combi = this.MWausDB.filter(d => d.id_mst === mw._Messstelle && d.id_taxon === mw._Taxon && d.id_tiefe === mw._Tiefe && d.id_taxonzus === mw._Form && d.id_abundanz === mw._idAbundanz);
			

			if (combi.length > 0) {
				this.vorhanden = true;
				this.groupNachPruefung(this.uebersicht[a]);

				i = l;
			}

		}}}}}else {
			
			let combi = this.uebersicht.filter(d => d.import1 === "checked");
			if (combi!==null){
				if (combi.length>0)
				{this.vorhanden = false;}	else{

					this.vorhanden = true;}
			}
			


		}
		
		this.uebersicht=this.uebersichtGeprueft;}


	/**
		 * Aktualisiert den Status des angegebenen Übersichtselements im `uebersichtGeprueft`-Array.
		 * Wenn die `import1`-Eigenschaft des Übersichtselements auf "checked" gesetzt ist, wird die Eigenschaft auf einen leeren String zurückgesetzt,
		 * das Element aus seiner aktuellen Position im Array entfernt und dann an das Ende des Arrays verschoben.
		 *
		 * @param _uebersicht - Das zu aktualisierende Übersichtselement.
		 */
	groupNachPruefung(_uebersicht: Uebersicht) {
		const index = this.uebersichtGeprueft.findIndex(item => item === _uebersicht);
	  
		// Prüfen, ob das Objekt im Array existiert und `import1` auf "checked" steht
		if (index !== -1 && _uebersicht.import1 === "checked") {
		  // `import1` auf leeren String setzen
		  this.uebersichtGeprueft[index].import1 = "";
		}
	  }



	/**
	 * Überprüft, ob Messstellen für ein bestimmtes Jahr und einen Probennehmer bereits vorhanden sind.
	 * 
	 * Diese Methode setzt die Eigenschaft `vorhandenMst` auf `true`, wenn Messstellen gefunden werden,
	 * die den Kriterien entsprechen und bereits in der Datenbank vorhanden sind.
	 * 
	 * @param jahr - Das Jahr, für das überprüft werden soll, ob Messstellen bereits vorhanden sind.
	 * @param probenehmer - Der Probennehmer.
	 * @returns Ein Versprechen, das aufgelöst wird, wenn die Überprüfung abgeschlossen ist.
	 */
	async pruefeObMessstellenschonVorhanden(jahr: string, probenehmer: string) {

		let jahrtemp: string; this.vorhandenMst = false;
		jahrtemp = ('15.07.' + jahr); probenehmer = '1';
		let i = 0;



		await this.holeMessstellenausDB(jahrtemp, probenehmer);
		for (let i = 0, l = this.messstellenImp.length; i < l; i += 1) {
			const mw: MessstellenImp = this.messstellenImp[i];


			const combi = this.tempMst.filter(d => d.id_mst === mw.id_mst && d.id_para === mw.id_para && d.id_einh === mw.id_einh);
			//console.log("combi", combi && mw)

			if (combi.length > 0) {
				this.vorhandenMst = true;
				i = l;
			}

		}
	}


	/**
	 * Ruft asynchron Messstellen aus der Datenbank basierend auf dem angegebenen Datum und Probennehmer ab.
	 *
	 * @param {string} datum - Das Datum, für das die Messstellen abgerufen werden sollen.
	 * @param {string} Probenehmer - Der Probennehmer, der mit den Messstellen verbunden ist.
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Messstellen abgerufen und verarbeitet wurden.
	 */
	async holeMessstellenausDB(datum: string, Probenehmer: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMessstellen(datum).forEach(value => {
			this.tempMst = value;
			//console.log('observable -> ' + value);
		});
	}
	
	/**
	 * Ruft asynchron Messwerte für abiotische Faktoren aus der Datenbank für ein bestimmtes Datum ab.
	 * 
	 * @param {string} datum - Das Datum, für das die Messwerte abgerufen werden sollen.
	 * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn die Messwerte abgerufen und verarbeitet wurden.
	 */
	async holeMesswerteAbiotikausDB(datum: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMessstellen(datum).forEach(value => {
			this.MWausDB = value;
			//console.log('observable -> ' + this.MWausDB);
		});
	}
	/**
		 * Ruft asynchron Messwerte aus der Datenbank für ein bestimmtes Datum ab.
		 * 
		 * @param datum - Das Datum, für das die Messwerte abgerufen werden sollen.
		 * @returns Ein Versprechen, das aufgelöst wird, wenn die Messwerte abgerufen und in `this.MWausDB` gespeichert wurden.
		 */
	async holeMesswerteausDB(datum: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMesswerte2(datum).forEach(value => {
			this.MWausDB = value;
			//console.log('observable -> ' + this.MWausDB);
		});
	}
		/**
		 * Importiert Daten in die Datenbank für ein bestimmtes Jahr und einen bestimmten Probennehmer.
		 *
		 * @param jahr - Das Jahr, für das die Daten importiert werden.
		 * @param probenehmer - Der Probennehmer, der für die Daten verantwortlich ist.
		 * @param useincludeDate - Ein boolesches Flag, das angibt, ob das Datum im Import enthalten sein soll.
		 * @returns Ein Versprechen, das aufgelöst wird und einen String zurückgibt, der den Erfolg oder Misserfolg des Datenimports angibt.
		 */
	async importIntoDB(jahr: string, probenehmer: string,useincludeDate:boolean):Promise<string> {
		// this.pruefeObMesswerteschonVorhanden(jahr, probenehmer);
		// this.pruefeObMessstellenschonVorhanden(jahr, probenehmer);

		let importMW=await this.importMesswerteIntoDB(jahr, probenehmer,useincludeDate);
		let importMSt=await this.importMessstellenIntoDB(jahr, probenehmer);
		
				if (importMW==="Import der Messwerte erfolgreich." &&
				importMSt==="Import der Messstellendaten erfolgreich.")
				{return "Datenimport erfolgreich durchgeführt."} else{
					return "Datenimport nicht erfolgreich."
				}
			
	}
	//Phylib/Perloes ExportDatei
		/**
		 * Importiert die Bewertungsdaten in die Datenbank für ein bestimmtes Jahr und einen bestimmten Probennehmer.
		 * 
		 * Diese Methode überprüft zuerst, ob die Messpunkte bereits in der Datenbank vorhanden sind.
		 * Wenn entweder taxonomische Daten oder abiotische Daten aus der Importdatei bereits vorhanden sind,
		 * wird der Importvorgang abgebrochen und eine entsprechende Nachricht zurückgegeben.
		 * Andernfalls wird der Import der Bewertungsdaten der Messpunkte in die Datenbank fortgesetzt.
		 * 
		 * @param jahr - Das Jahr, für das die Daten importiert werden.
		 * @param probenehmer - Der Probennehmer, der mit den Daten verbunden ist.
		 * @returns Eine Zeichenkette, die das Ergebnis des Importvorgangs angibt.
		 */
	importBewertungIntoDB(jahr: string, probenehmer: string): string {
		
		this.pruefeObMessstellenschonVorhanden(jahr, probenehmer);
		let rueckgabe:string="";
		if (this.vorhanden === true || this.vorhandenMst === true) {

			if (this.vorhanden === true){
				rueckgabe= "Es sind bereits Taxadaten der Importdatei in der Datenbank vorhanden. Der Import kann leider nicht fortgesetzt werden.";
		} 
			if (this.vorhandenMst === true) {
				rueckgabe= "Es sind bereits abiotische Daten der Importdatei in der Datenbank vorhanden. Der Import kann leider nicht fortgesetzt werden.";
			}} else {
				
				this.importMessstellenBewertungIntoDB(jahr, probenehmer);
				rueckgabe= "Datenimport erfolgreich durchgeführt."
			}
			return rueckgabe;
	}
	/**
	 * Importiert Messwerte in die Datenbank.
	 *
	 * @param {string} jahr - Das Jahr, das für den Import verwendet werden soll.
	 * @param {string} probenehmer - Der Probenehmer, der für den Import verwendet werden soll.
	 * @param {boolean} useIncludedDate - Flag, das angibt, ob das in den Daten enthaltene Datum verwendet werden soll.
	 * @returns {Promise<string>} - Ein Versprechen, das eine Zeichenkette zurückgibt, die das Ergebnis des Imports angibt.
	 *
	 * Diese Funktion verarbeitet die Messdaten und importiert sie in die Datenbank. Sie iteriert über die 
	 * Übersichtsdaten und filtert die Messpunkte, die importiert werden müssen. Für jeden Messpunkt 
	 * sendet sie die Messwerte an die Datenbank unter Verwendung des angegebenen Jahres, Probenehmers und der Import-ID. 
	 * Die Funktion verfolgt die Anzahl der importierten Messwerte und gibt eine Bemerkung zurück, die angibt, 
	 * ob der Import erfolgreich war oder ob Fehler aufgetreten sind.
	 */
	async importMesswerteIntoDB(jahr: string, probenehmer: string,useIncludedDate:boolean):Promise<string> {
		let jahrtemp: string;
		if (useIncludedDate===false){jahrtemp = ("15.07." + jahr);}
		//console.log(jahrtemp);
		let messwertanzahl:number=0;
		let bemerkung="Import der Messwerte erfolgreich.";
		for (let a = 0, le = this.uebersicht.length; a < le; a += 1) {

			if (this.uebersicht[a].import1==="checked"){ //import möglich
				let mstee = this.mst.filter(messstellen => messstellen.namemst === this.uebersicht[a].mst);
				let mstID=mstee[0].id_mst;
				const tmpMWteil=this.MessDataImp.filter(g=>g._Messstelle===mstID)


				if (tmpMWteil.length>0){ 
	
					
	

		for (let i = 0, l = tmpMWteil.length; i < l; i += 1) {
			messwertanzahl = messwertanzahl + 1;
			if (useIncludedDate===true)	
			{jahrtemp=tmpMWteil[i]._Datum}
			let variable:number=await this.impPhylibServ.postMesswertePhylib(tmpMWteil[i], jahrtemp, probenehmer, this.uebersichtImport.id_imp)
			//console.log (variable);
			if (variable!==201){

				bemerkung="Fehler beim Import der Messwerte."


			};
 

		}
	}}}this.importierteMesswerte=messwertanzahl;
	this.bemerkungImpMW=bemerkung;
return bemerkung;
}

	/**
	 * Importiert Messstellen in die Datenbank für ein bestimmtes Jahr und einen bestimmten Probennehmer.
	 * 
	 * @param jahr - Das Jahr, für das die Messstellen importiert werden.
	 * @param probenehmer - Der Probennehmer, der für die Messungen verantwortlich ist.
	 * @returns Ein Versprechen, das eine Zeichenkette zurückgibt, die das Ergebnis des Importvorgangs angibt.
	 * 
	 * Die Funktion konstruiert einen Datumsstring unter Verwendung des angegebenen Jahres, iteriert über die 
	 * Messstellen und versucht, jede einzelne mit der Methode `postMessstellenPhylib` zu importieren. 
	 * Wenn ein Importvorgang fehlschlägt, wird die Bemerkung aktualisiert, um einen Fehler anzuzeigen.
	 * 
	 * Nach dem Versuch, alle Messstellen zu importieren, aktualisiert die Funktion die Importübersicht 
	 * mit den Ergebnissen und gibt eine Bemerkung zurück, die den Erfolg oder Misserfolg des Importvorgangs angibt.
	 */
	async importMessstellenIntoDB(jahr: string, probenehmer: string):Promise<string> {
		let jahrtemp: string;
		let bemerkung="Import der Messstellendaten erfolgreich.";
		let a=0;
		jahrtemp = ("15.07." + jahr);
		// console.log(this.messstellenImp.length);
		// console.log(this.messstellenImp);

		this.importierteMst=this.anzahlMstImp(); 
		for (let i = 0, l = this.messstellenImp.length; i < l; i += 1) {
			a = a + 1;


			if (await this.impPhylibServ.postMessstellenPhylib(this.messstellenImp[i], jahrtemp, probenehmer,this.uebersichtImport.id_imp)==="Fehler"){

				bemerkung="Fehler beim Import der Messtellendaten."	
			}
			
		}

		let UebersichtImport:UebersichtImport  = {} as UebersichtImport;
		UebersichtImport.id_imp=this.uebersichtImport.id_imp;
		UebersichtImport.id_verfahren=this.uebersichtImport.id_verfahren;
		UebersichtImport.bemerkung=bemerkung;
		UebersichtImport.anzahlwerte=this.importierteMesswerte;
		UebersichtImport.anzahlmst=this.importierteMst;
   
		this.UebersichtImportService.aktualisiereImportdaten(this.importierteMst,this.importierteMesswerte,bemerkung + " "+this.bemerkungImpMW,this.uebersichtImport.id_imp);
	return bemerkung;
	}

		/**
		 * Importiert die Bewertung von Messpunkten in die Datenbank für ein gegebenes Jahr und einen Probenehmer.
		 * 
		 * @param jahr - Das Jahr, für das die Auswertung importiert wird.
		 * @param probenehmer - Der Probenehmer, der für die Auswertung verantwortlich ist.
		 * 
		 * Diese Methode filtert die Übersichtsdatensätze, um nur die Einträge einzuschließen, die für den Import markiert sind.
		 * Anschließend iteriert sie über die gefilterten Daten, gleicht die Messpunkte ab und entfernt doppelte Einträge.
		 * Für jeden eindeutigen Eintrag wird ein Datumsstring erstellt und die Daten werden an den Phylib-Dienst gesendet.
		 * Schließlich wird die Importdatenübersicht mit der Anzahl der verarbeiteten Einträge aktualisiert.
		 *Import der Bewertungsergebnisse wenn in der Exportdatei Jahre mitgeliefert werden
		* wird das verwendet, sonst das aus dem Auswahlfeld	( nur für PhytoSee und Phytofluss verwendet)*/
	importMessstellenBewertungIntoDB(jahr: string, probenehmer: string) {
		let jahrtemp: string;
		
		console.log(jahrtemp);
		let g=0;
		let b=0;
		// for (let i = 0, l = this.messstellenImp.length; i < l; i += 1) {
			const uebersichtfiltert=this.uebersicht.filter(daten=>daten.import1==="checked")
			for (let a = 0, le = uebersichtfiltert.length; a < le; a += 1) {

				// if (this.uebersicht[a].import1==="checked"){ //import möglich
					g = g + 1;
					let mstee = this.mst.filter(messstellen => messstellen.namemst === uebersichtfiltert[a].mst);
					if (mstee.length>0){
					let mstID=mstee[0].id_mst;
					const tmpMWteil=this.messstellenImp.filter(g=>g.id_mst===mstID)

					// Entfernt doppelte Werte aus dem Array
					const distinctTmpMWteil = Array.from(new Set(tmpMWteil));

					// distinctTmpMWteil enthält jetzt nur noch eindeutige Werte
	
					if (distinctTmpMWteil.length>0){ 
						for (let i = 0, l = distinctTmpMWteil.length; i < l; i += 1) {
							b=b+1;
							if (distinctTmpMWteil[i].jahr===undefined){
								jahrtemp = ("15.07." + jahr);}else{
									jahrtemp = ("15.07." + distinctTmpMWteil[i].jahr);
								}
			this.impPhylibServ.postMessstellenPhylib(distinctTmpMWteil[i], jahrtemp, probenehmer,this.uebersichtImport.id_imp);

		}}}}
		
   
		this.UebersichtImportService.aktualisiereImportdaten(g,b,"",this.uebersichtImport.id_imp);
	}
	
	/**
	 * Wählt und konfiguriert die anzuzeigenden Spalten basierend auf der angegebenen Verfahrens-ID, den Spaltenwerten und der Tabellen-ID aus.
	 *
	 * @param idVerfahren - Die ID des Verfahrens, um zu bestimmen, welche Spalten angezeigt werden sollen.
	 * @param valspalten - Ein Array von Spaltenwerten, die gefiltert und sortiert werden sollen.
	 * @param idtab - Die ID der Tabelle, um die Spalten zu filtern.
	 * @returns Ein boolescher Wert, der angibt, ob das Zeilenklick-Handle angezeigt werden soll.
	 *
	 * Die Methode führt die folgenden Schritte aus:
	 * 1. Filtert das `valspalten`-Array basierend auf `idVerfahren`, `anzeige_tab2_tab1` und `idtab`.
	 * 2. Sortiert die gefilterten Spalten nach ihrer `namespalteng`-Eigenschaft.
	 * 3. Initialisiert die Arrays `displayColumnNames` und `dynamicColumns`.
	 * 4. Fügt Standardspalten zu den Arrays basierend auf `idVerfahren` hinzu.
	 * 5. Iteriert durch die gefilterten Spalten und fügt sie den Arrays hinzu.
	 * 6. Fügt spezifische Spalten basierend auf `idVerfahren` hinzu.
	 * 7. Fügt eine 'actions'-Spalte hinzu, wenn `idVerfahren` in der angegebenen Liste enthalten ist.
	 */
	waehleSpaltenUebersicht(idVerfahren:number,valspalten:any,idtab:number):boolean{
		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === idVerfahren && (excelspalten.anzeige_tab2_tab1 === 1||excelspalten.anzeige_tab2_tab1 ===4) && excelspalten.id_tab === idtab);
		let showHandleRowClick: boolean = false; 
		valspaltenfiter.sort((a,b)=>{return compare(a.namespalteng,b.namespalteng,true)});

if (idVerfahren===1 || idVerfahren===3 || idVerfahren===6){showHandleRowClick=true;}

		this.displayColumnNames=[];this.dynamicColumns=[];
		this.displayColumnNames.push('Nr');
				this.dynamicColumns.push('nr');
				if  (idVerfahren===4 ){
					this.displayColumnNames.push('Mst');
					this.dynamicColumns.push('mst');
				}
				if  (idVerfahren===6 || idVerfahren===7 ){
					this.displayColumnNames.push('Mst');
					this.dynamicColumns.push('mst');
				}
				if (idVerfahren===5){
					this.displayColumnNames.push('Mst');
					this.dynamicColumns.push('mst');
					this.displayColumnNames.push('Jahr');
					this.dynamicColumns.push('jahr');
				}
				if ( idVerfahren===7){
					
					this.displayColumnNames.push('Jahr');
					this.dynamicColumns.push('jahr');
					this.displayColumnNames.push('Gewässer');
					this.dynamicColumns.push('sp3');
					this.displayColumnNames.push('Gesamtindex');
					this.dynamicColumns.push('sp4');
					this.displayColumnNames.push('ÖZK');
					this.dynamicColumns.push('sp5');
				}


		for (let i = 0, l = valspaltenfiter.length; i < l; i += 1) {
			this.displayColumnNames.push(valspaltenfiter[i].anzeigename);
			this.dynamicColumns.push(valspaltenfiter[i].namespalteng)
			if(valspaltenfiter[i].spalte_messstelle===true){
				
				if (idVerfahren===1 ){
					this.displayColumnNames.push('Messwerte');
					// this.displayColumnNames.push('fehler1');
					// this.displayColumnNames.push('fehler2');
					// this.displayColumnNames.push('fehler3');
					//this.displayColumnNames.push('Import');
					this.dynamicColumns.push('anzahl');
				}
			}
		}
		if  (idVerfahren===3 || idVerfahren===6){
			this.displayColumnNames.push('Messwerte');
			this.displayColumnNames.push('fehler1');
					this.displayColumnNames.push('fehler2');
					// this.displayColumnNames.push('fehler3');
					//this.displayColumnNames.push('Import');
					this.dynamicColumns.push('anzahl');
		}
		if  (idVerfahren===5 || idVerfahren===7){
			// this.displayColumnNames.push('Gewässername');
			this.displayColumnNames.push('fehler1');
					// this.displayColumnNames.push('fehler2');
					// this.displayColumnNames.push('fehler3');
			this.displayColumnNames.push('Import');
					// this.dynamicColumns.push('anzahl');
		}
		this.dynamicColumns.push('fehler1');
		if (idVerfahren!==5 && idVerfahren!==2 && idVerfahren!==4 && idVerfahren!==7){
			this.dynamicColumns.push('fehler2');}
		this.dynamicColumns.push('import1');
		
		 // Füge die Aktionsspalte hinzu, falls relevant
		 if ([1, 2, 3, 4, 5, 6,7].includes(idVerfahren)) {
			this.dynamicColumns.push('actions');
		  }
		
		
	return showHandleRowClick;
}}


/**
 * Filtert nicht eindeutige Werte aus einem Array heraus.
 *
 * @param value - Der aktuelle Wert, der im Array verarbeitet wird.
 * @param index - Der Index des aktuellen Wertes, der im Array verarbeitet wird.
 * @param array - Das Array, auf dem `onlyUnique` aufgerufen wird.
 * @returns Ein boolescher Wert, der angibt, ob der Wert im Array eindeutig ist.
 */

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
  }

  function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }