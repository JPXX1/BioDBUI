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
export class XlsxImportPhylibService {

	constructor(private impPhylibServ: ImpPhylibServ,private UebersichtImportService:UebersichtImportService) { }

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

	callarten() {
		

		this.impPhylibServ.getArtenPhylibMP(1).subscribe(arten_ => {
			this.arten = arten_;
			//console.log(this.arten);
			//return einheiten;
		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
	}
	

	
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

	async holeMst() {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.getMst().forEach(value => {
			this.mst = value;
			// console.log('observable -> ' + value);
		});
	}
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

		// this.displayColumnNames.push(valspaltenfiterMst[0].anzeigename);
		// this.dynamicColumns.push(valspaltenfiterMst[0].namespalteng);
		//console.log(workbook.SheetNames[i]);
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
							
							// if(valspaltenfiteranzeige2[0].anzeige_tab2_tab1 === 1){
							// this.displayColumnNames.push(valspaltenfiteranzeige2[i].anzeigename);
							// this.dynamicColumns.push(valspaltenfiteranzeige2[i].namespalteng);}
							
							if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){

								
							}
						
						}

					}



				}
			}
		})
	//console.log(this.messstellenImp);
	this.dynamicColumns.push('fehler1');this.dynamicColumns.push('actions');}

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
			
			 this.uebersicht.push({ nr: this.uebersicht.length + 1, mst: mst, anzahl: 0, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3,import1:importp});

		} else {
			let messgroup = this.uebersicht.filter(dd => dd.mst === mst);


			if (messgroup.length === 0) {
				//nur BEwertungsdaten=Exportdateien
				if (_fehler1 === "" && _fehler2==="" ) { importp = "checked"; } else {importp="";}
				this.uebersicht.push({ nr: this.uebersicht.length + 1, mst: mst, anzahl: 0,jahr:jahr, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3,import1:importp});

			//	this.MessDataGr.push({ _Nr: this.MessDataGr.length + 1, _Messstelle: mst, _AnzahlTaxa: 0, _TypMP: _typmp, _TypDIA: _typdia, _TypWRRL: _typwrrl, _TypPhytoBenthos: _typphytobenth, _UMG: _umg, _Veroedung: _veroedung, _B_veroedung: _b_veroedung, _Helo_dom: _helo_dom, _Oekoreg: _oekoreg, MstOK: mstok, OK: ok, KeineMP: keinemp, gesamtdeckg: _gesamtdeckg },);
			}
			else {

				let i= this.uebersicht.findIndex(x=>x.mst===mst);
				// for (let i = 0, l = this.uebersicht.length; i < l; i += 1) {

					if (this.uebersicht[i].mst === mst) {
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
  
	// if (antwort) {
	//   // Schleife durch das Temp2Set
	//   for (let i = 0, le = Temp2Set.length; i < le; i += 1) {
	// 	// Filtere TempSet nach dem aktuellen kombinierten String
	// 	const ds = TempSet.filter(g => g === Temp2Set[i].temp);
	// 	if (ds.length > 1) {
	// 	  // Filtere die Messstellen nach der aktuellen Messstelle
	// 	  const mstee = this.mst.filter(messstellen => messstellen.id_mst === Temp2Set[i].Mst);
	// 	  if (mstee.length > 1) {
	// 		// Füge den Namen der Messstelle zum MstDoppelteDSTemp hinzu
	// 		MstDoppelteDSTemp.push(mstee[0].namemst);
	// 	  }
	// 	}
	//   }
	// }
  
	// // Erstelle ein Array mit eindeutigen Messstellen aus MstDoppelteDSTemp
	// const distinctArr2 = MstDoppelteDSTemp.filter((value, index, self) => self.indexOf(value) === index);
  
	// if (distinctArr2.length > 0) {
	//   // Initialisiere die MstDoppelteDS-Variable
	//   this.MstDoppelteDS = "(Mst: ";
	//   // Schleife durch das distinctArr2
	//   for (let f = 0, le = distinctArr2.length; f < le; f += 1) {
	// 	// Füge die Messstellen zum MstDoppelteDS-String hinzu
	// 	this.MstDoppelteDS = this.MstDoppelteDS + distinctArr2[f] + "; ";
	//   }
	//   // Schließe den MstDoppelteDS-String
	//   this.MstDoppelteDS = this.MstDoppelteDS + ")";
	// }
  
	// Gib die Antwort zurück
	return antwort;
  }

	  //wenn in Phytoseeexport Jahre mitgeliefert werden
	  async pruefeObMesswerteAbiotikschonVorhandenmitJahr(probenehmer: string) {
		let jahrtemp: string; this.vorhanden = false;
		
		
		for (let a = 0, le = this.uebersicht.length; a < le; a += 1) {

		if (this.uebersicht[a].import1==="checked"){ //import möglich
			jahrtemp = ('15.07.' + this.uebersicht[a].jahr); 
			await this.holeMesswerteAbiotikausDB(jahrtemp, probenehmer);
			// console.log(this.MWausDB);
			let mstee = this.mst.filter(messstellen => messstellen.namemst === this.uebersicht[a].mst);

			let mstID=mstee[0].id_mst;
			const tmpMWteil=this.MWausDB.filter(g=>g.id_mst===mstID)


			if (tmpMWteil.length>0){ 
				this.vorhanden = true;
				this.groupNAchPruefung(this.uebersicht[a]);
				// const relMW=this.MessDataImp.filter(g=>g._Messstelle===mstID);

		// for (let i = 0, l = relMW.length; i < l; i += 1) {
		// 	const mw: Messwerte = relMW[i];
			
			
		// 	// this.mst

		// 	// this.uebersicht.filter(a=>a.mst===mw._Messstelle)

		// 	const combi = this.MWausDB.filter(d => d.id_mst === mw._Messstelle && d.id_taxon === mw._Taxon && d.id_tiefe === mw._Tiefe && d.id_taxonzus === mw._Form && d.id_abundanz === mw._idAbundanz);
		// 	//console.log("combi", combi)

		// 	if (combi.length > 0) {
		// 		this.vorhanden = true;
		// 		this.groupNAchPruefung(this.uebersicht[a]);

		// 		i = l;
		// 	}

		// }
	}}}

	  }
	  async pruefeObMesswerteschonVorhandenJahr(probenehmer: string) {
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
			await this.holeMesswerteausDB(datum,probenehmer);
			
			
			
		 

		
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
				this.groupNAchPruefung(this.uebersicht[a]);

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

	async pruefeObMesswerteschonVorhanden(jahr: string, probenehmer: string) {
		this.uebersichtGeprueft=this.uebersicht;
		let jahrtemp: string; this.vorhanden = false;
		jahrtemp = ('15.07.' + jahr); 
		// probenehmer = '1';
		let i = 0;



		await this.holeMesswerteausDB(jahrtemp, probenehmer);
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
			
			
			// this.mst

			// this.uebersicht.filter(a=>a.mst===mw._Messstelle)

			const combi = this.MWausDB.filter(d => d.id_mst === mw._Messstelle && d.id_taxon === mw._Taxon && d.id_tiefe === mw._Tiefe && d.id_taxonzus === mw._Form && d.id_abundanz === mw._idAbundanz);
			//console.log("combi", combi)

			if (combi.length > 0) {
				this.vorhanden = true;
				this.groupNAchPruefung(this.uebersicht[a]);

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


	groupNAchPruefung(_uebersicht:Uebersicht) {
		let i=this.uebersichtGeprueft.indexOf(_uebersicht)
		if (_uebersicht.import1==="checked"){
			_uebersicht.import1="";
			this.uebersichtGeprueft.splice(i, 1);
			this.uebersichtGeprueft.push(_uebersicht);

}}


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


	async holeMessstellenausDB(datum: string, Probenehmer: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMessstellen(datum, Probenehmer).forEach(value => {
			this.tempMst = value;
			//console.log('observable -> ' + value);
		});
	}
	
	async holeMesswerteAbiotikausDB(datum: string, Probenehmer: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMessstellen(datum, Probenehmer).forEach(value => {
			this.MWausDB = value;
			//console.log('observable -> ' + this.MWausDB);
		});
	}
	async holeMesswerteausDB(datum: string, Probenehmer: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMesswerte2(datum, Probenehmer).forEach(value => {
			this.MWausDB = value;
			//console.log('observable -> ' + this.MWausDB);
		});
	}
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
		this.UebersichtImportService.aktualisiereImportdaten(this.importierteMst,this.importierteMesswerte,bemerkung + " "+this.bemerkungImpMW,this.uebersichtImport.id_imp)
	return bemerkung;
	}
	//Import der Bewertugsergebnisse
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
					this.displayColumnNames.push('Gesamtindex');
					this.dynamicColumns.push('sp3');
					this.displayColumnNames.push('ÖZK');
					this.dynamicColumns.push('sp4');
				}


		for (let i = 0, l = valspaltenfiter.length; i < l; i += 1) {
			this.displayColumnNames.push(valspaltenfiter[i].anzeigename);
			this.dynamicColumns.push(valspaltenfiter[i].namespalteng)
			if(valspaltenfiter[i].spalte_messstelle===true){
				
				if (idVerfahren===1 ){
					this.displayColumnNames.push('Messwerte');
					this.displayColumnNames.push('fehler1');
					this.displayColumnNames.push('fehler2');
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


function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
  }

  function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }