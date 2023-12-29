import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';
import { MstIndex } from '../interfaces/mst-index';
import { Uebersicht } from '../interfaces/uebersicht';
import { Messwerte } from '../interfaces/messwerte';
import { MessstellenImp } from '../interfaces/messstellen-imp';

@Injectable({
	providedIn: 'root'
})
export class XlsxImportPhylibService {

	constructor(private impPhylibServ: ImpPhylibServ) { }


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
	public temp: any;
	public tempMst: any;
	public parameterabiot: any;
	public _uebersicht:Uebersicht;
	
	vorhanden: boolean;
	vorhandenMst: boolean;
	
	public MessData: Messwerte[] = []; public MessDataOrgi: Messwerte[] = []; //public MessDataGr: Messgroup[] = []; 
	public MessDataImp: Messwerte[] = []; public messstellenImp: MessstellenImp[] = [];
	public uebersicht:Uebersicht[]=[];
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

		this.impPhylibServ.getFormen().subscribe(formen_ => {
			this.formen = formen_;
			console.log(this.formen);




		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });

		this.impPhylibServ.getTiefen().subscribe(tief_ => {
			this.tiefen = tief_;
			console.log(tief_);
			//return einheiten;
		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
		this.impPhylibServ.getEinheiten().subscribe(einheiten_ => {
			this.einheiten = einheiten_;
			console.log(this.einheiten);
			//return einheiten;
		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
		//



		this.impPhylibServ.getParameterAbiot().subscribe(mst_ => {
			this.parameterabiot = mst_;
			// console.log(this.mst);
			//return einheiten;
		}, (err) => { this.InfoBox = this.InfoBox + " " + err.message });


	}

	async holeMst() {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.getMst().forEach(value => {
			this.mst = value;
			console.log('observable -> ' + value);
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
		let json_Messstelle; var Messstelle: string; let mstOK: boolean;
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
								mstOK = true;
								bidmst = mstee[0].id_mst;
							}
							else {

								mstOK = false
							}

						}
						this._uebersicht.mst=Messstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=true;this._uebersicht.fehler3=true;
						//this.groupNAch(Messstelle,  null, null, "1", "1", "1", "1", "1", "1", "1", "1","1",mstOK, true, false);
						
						
							
					} else {
						const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);
						const valspaltenfiteranzeige2 =valspaltenfiteranzeige.filter(excelspalten => excelspalten.spalten_name === i);

						if (valspaltenfiter2.length === 1) {
							//Oekoregion = obj[index][i];
							//let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);
							bwert = obj[index][i];

							bidpara = valspaltenfiter2[0].id_para;

							bideinh = valspaltenfiter2[0].id_einheit;
							
							this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
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
	console.log(this.messstellenImp);this.dynamicColumns.push('actions');}

schalteSpalte(Spalte:string,wert:string){

	// this._uebersicht=null;this._uebersicht= {} as Uebersicht;
	console.log()
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
console.log(this.mstindex);	
}
	async Phylibimport(workbook,valspalten: any, tabMST: number,tabMW: number,verfahrennr : number) {
		let array: Messwerte[] = []; this.uebersicht = []; this.MessDataOrgi = [];
		//let reader = new FileReader();
		await this.holeMst();
		var sheets;
		var Messstelle: string; var Probe: string; var Taxon; var Form: string; var Messwert; var Einheit; var Tiefe; var cf;
		let aMessstelle: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
		// var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
		let bidmst; let bidpara; let bideinh; let bwert;
		let mstOK: boolean; let ok: boolean;
		let XL_row_object;
		let json_Messstelle;
		this._uebersicht= {} as Uebersicht;
		let mst: string;

		//welche Spalte in der Übersicht
		const valspaltenfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === tabMST);
		const valtabfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.id_tab === tabMST);

		
		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
		const valspaltenfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1);

			for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1)   {



			//console.log(workbook.SheetNames[i]);
			XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
			json_Messstelle = JSON.stringify(XL_row_object);
			const obj = JSON.parse(json_Messstelle);
			if (i === valtabfiterMst[0].id_tab) {
				await obj.forEach((val, index) => {
					if (obj[index] !== null) {

						//index für jede Messstelle ermitteln und in Array abspeichern
						this.funktionIndexMst(workbook,valspaltenfiterMst[0].spalten_name,valtabfiterMst[0].id_tab);





						for (var i in obj[index]) {
							//var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
							if (index > 0) {
								//let bveggrenze;let bidmst;let bidpara;let bideinh;let bidpara;
								//groupNAch(Messstelle,  Makrophytentyp, Diatomeentyp, WRRLTyp, Phytobenthostyp, Veggrenze, Makrophytenveroedung, Begruendung, Helophytendominanz, "", "","",mstOK, true, false)
	
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
											mstOK = true;
										bidmst = mstee[0].id_mst;
									}
									else {

										mstOK = false
									}

									// if (index > 0) {
									// //let bveggrenze;let bidmst;let bidpara;let bideinh;let bidpara;
									// this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
									// this.groupNAch(Messstelle, Makrophytentyp, Diatomeentyp, WRRLTyp, Phytobenthostyp, Veggrenze, Makrophytenveroedung, Begruendung, Helophytendominanz, Oekoregion, mstOK, true, false, Gesamtdeckungsgrad);
									// bidmst=null; bideinh=null; bidpara=null; bwert=null; 
									// Messstelle=null; Makrophytentyp=null; Diatomeentyp=null; WRRLTyp=null; Phytobenthostyp=null; Veggrenze=null; Makrophytenveroedung=null; Begruendung=null; Helophytendominanz=null; Oekoregion=null; mstOK=null; Gesamtdeckungsgrad=null;
									// }		
								}	this._uebersicht.mst=Messstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=true;this._uebersicht.fehler3=true;
					
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
									
									this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
									this.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
									const mstAusArray=this.mstindex.filter(exc=>exc.index===index)
									this._uebersicht.mst=mstAusArray[0].mst;
									
									if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){
		
										
									}
								
								}
		
							}
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							//++
							
						// 	if (i === 'Ökoregion') {
						// 			Oekoregion = obj[index][i];
						// 			let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 			if (
						// 				veggrenze.length !== 0) {
						// 				bidpara = veggrenze[0].id;
						// 			}
						// 			bideinh = 13;
						// 			bwert = Oekoregion;
						// 			this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 		}

						// 	if (i === 'Makrophytenverödung') {
						// 		Makrophytenveroedung = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Makrophytenveroedung;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}

						// 	if (i === 'Begründung') {
						// 		Begruendung = obj[index][i];

						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Begruendung;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });

						// 	}
						// 	if (i === 'Helophytendominanz') {
						// 		Helophytendominanz = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Helophytendominanz;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });

						// 	}
						// 	if (i === 'Diatomeentyp') {
						// 		Diatomeentyp = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Diatomeentyp;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}
						// 	if (i === 'Phytobenthostyp') {
						// 		Phytobenthostyp = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Phytobenthostyp;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}
						// 	if (i === 'Makrophytentyp') {
						// 		Makrophytentyp = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Makrophytentyp;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}
						// 	if (i === 'WRRL-Typ') {
						// 		WRRLTyp = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = WRRLTyp;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}

						// 	if (i === 'Gesamtdeckungsgrad') {
						// 		Gesamtdeckungsgrad = obj[index][i];
						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 1; bwert = Gesamtdeckungsgrad;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}

						// 	if (i === 'Vegetationsgrenze') {
						// 		Veggrenze = obj[index][i];

						// 		let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

						// 		if (
						// 			veggrenze.length !== 0) {
						// 			bidpara = veggrenze[0].id;
						// 		}
						// 		bideinh = 13;
						// 		bwert = Veggrenze;
						// 		this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						// 	}
					
						 }
					}
				}

				)
			}
			if (workbook.SheetNames[i] == 'Messwerte') {

				console.log(this.uebersicht);
				// Here is your object
				let o: number = 1;
				obj.forEach((val, index) => {
					if (obj[index] !== null) {
						for (var i in obj[index]) {
							//console.log(val + " / " + obj[index][i] + ": " + i);

							o = o + 1;


							if (i == 'Messstelle') {

								if (index > 0) { this.groupNAch();//console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
									array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1 });
									this.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1 });
									// this.groupNAch(aMessstelle,  "1", "1", "1", "1", "1", "1", "1", "1", "1", "1","1",mstOK, true, false);
									this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=true;this._uebersicht.fehler3=true;
									Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = true; mstOK = true;
									aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
								}

								mst = obj[index][i];
								//aMessstelle=mst;
								//taxonzus=new Taxonzus();
								let mstee = this.mst.filter(messstellen => messstellen.namemst == mst);

								//console.log(mst);

								if (
									mstee.length !== 0) {
										mstOK = true;
									mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
								}
								else {
									aMessstelle = mst;
									mstOK = false
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
								let taxon_ = this.arten.filter(arten => arten.taxon == Taxon);
								if (taxon_.length !== 0) { Taxon = taxon_[0].id_taxon; aTaxon = taxon_[0].taxon; ok = false; } else {
									ok = false;
									var taxon2 = this.arten.filter(arten => arten.dvnr == Taxon);
									if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon; }


								}
							}
							if (i == 'Form') {
								Form;

								var employeeName: string = obj[index][i];

								//console.log(this.formen);
								//taxonzus=new Taxonzus();
								let taxonzus = this.formen.filter(formen => formen.importname == employeeName);

								//console.log(id_taxonzus);

								if (taxonzus !== null) { Form = taxonzus[0].id_taxonzus; aForm = employeeName; }
								ok = false;
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

								cf = true;


							} else { cf = false }
						}
					}
				})

				//of(array);
			}
		}
		this.MessDataImp = array;
		
	}




	async groupNAch() {

		let mst: string=this._uebersicht.mst;
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
		let _fehler1: boolean=this._uebersicht.fehler1;let  _fehler2: boolean=this._uebersicht.fehler2;
		let _fehler3: boolean=this._uebersicht.fehler3;
		console.log(this._uebersicht);
		if (this.uebersicht.length == 0) {

			
			
			 this.uebersicht.push({ nr: this.uebersicht.length + 1, mst: mst, anzahl: 0, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3});

		} else {
			let messgroup = this.uebersicht.filter(dd => dd.mst == mst);


			if (messgroup.length == 0) {
				this.uebersicht.push({ nr: this.uebersicht.length + 1, mst: mst, anzahl: 0, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7, sp8: _sp8, sp9: _sp9, sp10: _sp10, sp11: _sp11,sp12: _sp12, sp13: _sp13,fehler1: _fehler1, fehler2: _fehler2, fehler3: _fehler3});

			//	this.MessDataGr.push({ _Nr: this.MessDataGr.length + 1, _Messstelle: mst, _AnzahlTaxa: 0, _TypMP: _typmp, _TypDIA: _typdia, _TypWRRL: _typwrrl, _TypPhytoBenthos: _typphytobenth, _UMG: _umg, _Veroedung: _veroedung, _B_veroedung: _b_veroedung, _Helo_dom: _helo_dom, _Oekoreg: _oekoreg, MstOK: mstok, OK: ok, KeineMP: keinemp, gesamtdeckg: _gesamtdeckg },);
			}
			else {
				for (let i = 0, l = this.uebersicht.length; i < l; i += 1) {

					if (this.uebersicht[i].mst === mst) {
						var _nr_: number = this.uebersicht[i].nr;
						var _mst_: string = this.uebersicht[i].mst;
						var _anzahl_: number = this.uebersicht[i].anzahl + 1;
						if (this.uebersicht[i].sp3!==undefined){ _sp3 = this.uebersicht[i].sp3};
						if (this.uebersicht[i].sp4!==undefined){_sp4 = this.uebersicht[i].sp4};
						if (this.uebersicht[i].sp5!==undefined){
							console.log(this.uebersicht[i].sp5);
							_sp5 = this.uebersicht[i].sp5};
						if (this.uebersicht[i].sp6!==undefined){_sp6 = this.uebersicht[i].sp6};
						if (this.uebersicht[i].sp7!==undefined){var _sp7_: string = this.uebersicht[i].sp7}else{var _sp7_=_sp7};
						if (this.uebersicht[i].sp8!==undefined){var _sp8_: string = this.uebersicht[i].sp8}else{var _sp8_=_sp8};
						if (this.uebersicht[i].sp9!==undefined){var _sp9_: string = this.uebersicht[i].sp9};
						if (this.uebersicht[i].sp10!==undefined){var _sp10_: string = this.uebersicht[i].sp10};
						if (this.uebersicht[i].sp11!==undefined){var _sp11_: string = this.uebersicht[i].sp11};
						if (this.uebersicht[i].sp12!==undefined){var _sp12_: string = this.uebersicht[i].sp12};
						if (this.uebersicht[i].sp13!==undefined){var _sp13_: string = this.uebersicht[i].sp13};
						let _fehler1_:boolean;
						let _fehler2_:boolean;
						let _fehler3_:boolean;
						

						
						if (this.uebersicht[i].fehler1 == false) { _fehler1_ = false; } else { _fehler1_ = true }
						if (this.uebersicht[i].fehler2 == false) { _fehler2_ = false; } else { _fehler2_ = true; };
						if (this.uebersicht[i].anzahl === 0) { _fehler3_ = true; } else { _fehler3_ = false; };
						




						this.uebersicht.splice(i, 1);//löscht vorhandenen DS
						this.uebersicht.push({ nr:_nr_, mst: _mst_, anzahl: _anzahl_, sp3: _sp3, sp4: _sp4, sp5: _sp5, sp6: _sp6, sp7:_sp7_, sp8: _sp8_, sp9: _sp9_, sp10: _sp10_, sp11: _sp11_,sp12: _sp12_, sp13: _sp13_,fehler1: _fehler1_, fehler2: _fehler2, fehler3: _fehler3});

						//this.MessDataGr.push({ _Nr, _Messstelle, _AnzahlTaxa, _TypMP, _TypDIA, _TypWRRL, _TypPhytoBenthos, _UMG, _Veroedung, _B_veroedung, _Helo_dom, _Oekoreg, MstOK, OK, KeineMP, gesamtdeckg: agesamtdeckg });
						// console.log(this.MessDataGr)
						break;
					}
				}
			}

		}

	}


	async pruefeObMesswerteschonVorhanden(jahr: string, probenehmer: string) {

		let jahrtemp: string; this.vorhanden = false;
		jahrtemp = ('15.07.' + jahr); probenehmer = '1';
		let i = 0;



		await this.holeMesswerteausDB(jahrtemp, probenehmer);
		for (let i = 0, l = this.MessDataImp.length; i < l; i += 1) {
			const mw: Messwerte = this.MessDataImp[i];


			const combi = this.temp.filter(d => d.id_mst === mw._Messstelle && d.id_taxon === mw._Taxon && d.id_tiefe === mw._Tiefe && d.id_taxonzus === mw._Form && d.id_abundanz === mw._idAbundanz);
			console.log("combi", combi)

			if (combi.length > 0) {
				this.vorhanden = true;
				i = l;
			}

		}
	}

	async pruefeObMessstellenschonVorhanden(jahr: string, probenehmer: string) {

		let jahrtemp: string; this.vorhandenMst = false;
		jahrtemp = ('15.07.' + jahr); probenehmer = '1';
		let i = 0;



		await this.holeMessstellenausDB(jahrtemp, probenehmer);
		for (let i = 0, l = this.messstellenImp.length; i < l; i += 1) {
			const mw: MessstellenImp = this.messstellenImp[i];


			const combi = this.tempMst.filter(d => d.id_mst === mw.id_mst && d.id_para === mw.id_para && d.id_einh === mw.id_einh);
			console.log("combi", combi && mw)

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
			console.log('observable -> ' + value);
		});
	}
	async holeMesswerteausDB(datum: string, Probenehmer: string) {
		// this.workbookInit(datum,Probenehmer)
		await this.impPhylibServ.kontrollPhylibMesswerte2(datum, Probenehmer).forEach(value => {
			this.temp = value;
			console.log('observable -> ' + value);
		});
	}
	importIntoDB(jahr: string, probenehmer: string): string {
		this.pruefeObMesswerteschonVorhanden(jahr, probenehmer);
		this.pruefeObMessstellenschonVorhanden(jahr, probenehmer);
		if (this.vorhanden === true) {
			return "Es sind bereits Taxadaten der Importdatei in der Datenbank vorhanden. Der Import kann leider nicht fortgesetzt werden.";
		} else
			if (this.vorhandenMst === true) {
				return "Es sind bereits abiotische Daten der Importdatei in der Datenbank vorhanden. Der Import kann leider nicht fortgesetzt werden.";
			} else {
				this.importMesswerteIntoDB(jahr, probenehmer);
				this.importMessstellenIntoDB(jahr, probenehmer);
				return "Datenimport erfolgreich durchgeführt."
			}
	}

	importMesswerteIntoDB(jahr: string, probenehmer: string) {
		let jahrtemp: string;
		jahrtemp = ("15.07." + jahr);
		console.log(jahrtemp);
		for (let i = 0, l = this.MessDataImp.length; i < l; i += 1) {
			var a = a + 1;


			this.impPhylibServ.postMesswertePhylib(this.MessDataImp[i], jahrtemp, probenehmer, "1");


		}
	}

	importMessstellenIntoDB(jahr: string, probenehmer: string) {
		let jahrtemp: string;
		jahrtemp = ("15.07." + jahr);
		console.log(jahrtemp);
		for (let i = 0, l = this.MessDataImp.length; i < l; i += 1) {
			var a = a + 1;


			this.impPhylibServ.postMessstellenPhylib(this.messstellenImp[i], jahrtemp, probenehmer,"1");

		}
	}
	
	waehleSpaltenUebersicht(idVerfahren:number,valspalten:any,idtab:number){
		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === idVerfahren && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === idtab);
		this.displayColumnNames=[];this.dynamicColumns=[];
		this.displayColumnNames.push('Nr');
				this.dynamicColumns.push('nr');
		for (let i = 0, l = valspaltenfiter.length; i < l; i += 1) {
			this.displayColumnNames.push(valspaltenfiter[i].anzeigename);
			this.dynamicColumns.push(valspaltenfiter[i].namespalteng)
			if(valspaltenfiter[i].spalte_messstelle===true){
				this.displayColumnNames.push('Messwerte');
				this.dynamicColumns.push('anzahl');
			}
		}
		this.dynamicColumns.push('actions');
	}
}




