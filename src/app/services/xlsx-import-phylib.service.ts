import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';
import { Messgroup } from '../interfaces/messgroup';
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

	vorhanden: boolean;
	vorhandenMst: boolean;

	public MessData: Messwerte[] = []; public MessDataOrgi: Messwerte[] = []; public MessDataGr: Messgroup[] = []; public MessDataImp: Messwerte[] = []; public messstellenImp: MessstellenImp[] = [];



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
	async PhylibBewertungimport(workbook, valspalten: any, tab: number, verfahrennr: number) {
		await this.holeMst();

		this.messstellenImp = [];
		tab = tab - 1;
		let XL_row_object;
		let json_Messstelle; var Messstelle: string; let mstOK: boolean;
		let bidmst; let bidpara; let bideinh; let bwert;
		// for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {

		const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import === true);

		//console.log(workbook.SheetNames[i]);
		XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tab]]);
		json_Messstelle = JSON.stringify(XL_row_object);
		const obj = JSON.parse(json_Messstelle);
		// if (workbook.SheetNames[i] == 'Messstellen' || workbook.SheetNames[i] == 'Messstelle') {
		obj.forEach((val, index) => {
			if (obj[index] !== null) {
				for (var i in obj[index]) {
					

					if (i === 'Messstelle') {
						Messstelle = obj[index][i];
						if (Messstelle !== null) {
							let mstee = this.mst.filter(messstellen => messstellen.namemst == Messstelle);

							if (
								mstee.length !== 0) {
								mstOK = true;
								bidmst = mstee[0].id_mst;
							}
							else {

								mstOK = false
							}

						}

					} else {
						const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);

						if (valspaltenfiter2.length === 1) {
							//Oekoregion = obj[index][i];
							//let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);
							bwert = obj[index][i];

							bidpara = valspaltenfiter2[0].id_para;

							bideinh = valspaltenfiter2[0].id_einheit;

							this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
						}

					}



				}
			}
		})
	console.log(this.messstellenImp);}


	
	async Phylibimport(workbook) {
		let array: Messwerte[] = []; this.MessDataGr = []; this.MessDataOrgi = [];
		//let reader = new FileReader();
		await this.holeMst();
		var sheets;
		var Messstelle: string; var Probe: string; var Taxon; var Form: string; var Messwert; var Einheit; var Tiefe; var cf;
		let aMessstelle: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
		var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
		let bidmst; let bidpara; let bideinh; let bwert;
		let mstOK: boolean; let ok: boolean;
		let XL_row_object;
		let json_Messstelle;
		let mst: string;

		for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {



			//console.log(workbook.SheetNames[i]);
			XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
			json_Messstelle = JSON.stringify(XL_row_object);
			const obj = JSON.parse(json_Messstelle);
			if (workbook.SheetNames[i] == 'Messstellen' || workbook.SheetNames[i] == 'Messstelle') {
				obj.forEach((val, index) => {
					if (obj[index] !== null) {
						for (var i in obj[index]) {
							//var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
							if (index > 0) {
								//let bveggrenze;let bidmst;let bidpara;let bideinh;let bidpara;
							
								this.groupNAch(Messstelle, Makrophytentyp, Diatomeentyp, WRRLTyp, Phytobenthostyp, Veggrenze, Makrophytenveroedung, Begruendung, Helophytendominanz, Oekoregion, mstOK, true, false, Gesamtdeckungsgrad);
								//bidmst=null; bideinh=null; bidpara=null; bwert=null; 
								Messstelle=null; Makrophytentyp=null; Diatomeentyp=null; WRRLTyp=null; Phytobenthostyp=null; Veggrenze=null; Makrophytenveroedung=null; Begruendung=null; Helophytendominanz=null; Oekoregion=null; mstOK=null; Gesamtdeckungsgrad=null;
								}	

							if (i === 'Messstelle') {
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
								}
							} else
								if (i === 'Ökoregion') {
									Oekoregion = obj[index][i];
									let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

									if (
										veggrenze.length !== 0) {
										bidpara = veggrenze[0].id;
									}
									bideinh = 13;
									bwert = Oekoregion;
									this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
								}

							if (i === 'Makrophytenverödung') {
								Makrophytenveroedung = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Makrophytenveroedung;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}

							if (i === 'Begründung') {
								Begruendung = obj[index][i];

								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Begruendung;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });

							}
							if (i === 'Helophytendominanz') {
								Helophytendominanz = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Helophytendominanz;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });

							}
							if (i === 'Diatomeentyp') {
								Diatomeentyp = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Diatomeentyp;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}
							if (i === 'Phytobenthostyp') {
								Phytobenthostyp = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Phytobenthostyp;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}
							if (i === 'Makrophytentyp') {
								Makrophytentyp = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Makrophytentyp;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}
							if (i === 'WRRL-Typ') {
								WRRLTyp = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = WRRLTyp;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}

							if (i === 'Gesamtdeckungsgrad') {
								Gesamtdeckungsgrad = obj[index][i];
								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 1; bwert = Gesamtdeckungsgrad;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}

							if (i === 'Vegetationsgrenze') {
								Veggrenze = obj[index][i];

								let veggrenze = this.parameterabiot.filter(formen => formen.importname == i);

								if (
									veggrenze.length !== 0) {
									bidpara = veggrenze[0].id;
								}
								bideinh = 13;
								bwert = Veggrenze;
								this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null });
							}
					
						}
					}
				}

				)
			}
			if (workbook.SheetNames[i] == 'Messwerte') {
				// Here is your object
				let o: number = 1;
				obj.forEach((val, index) => {
					if (obj[index] !== null) {
						for (var i in obj[index]) {
							//console.log(val + " / " + obj[index][i] + ": " + i);

							o = o + 1;


							if (i == 'Messstelle') {

								if (index > 0) { //console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
									array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1 });
									this.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1 });
									this.groupNAch(aMessstelle, null, null, null, null, null, null, null, null, null, mstOK, ok, null, null);

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
	groupNAch(mst: string, _typmp: string, _typdia: string, _typwrrl: string, _typphytobenth, _umg: string, _veroedung: string, _b_veroedung: string, _helo_dom: string, _oekoreg: string, mstok: boolean, ok: boolean, keinemp: boolean, _gesamtdeckg: string) {
		let MstOK: boolean; let OK: boolean;
		// console.log(mst)
		if (this.MessDataGr.length == 0) {

			_Typ: String;
			_UMG
			this.MessDataGr.push({ _Nr: this.MessDataGr.length + 1, _Messstelle: mst, _AnzahlTaxa: 0, _TypMP: _typmp, _TypDIA: _typdia, _TypWRRL: _typwrrl, _TypPhytoBenthos: _typphytobenth, _UMG: _umg, _Veroedung: _veroedung, _B_veroedung: _b_veroedung, _Helo_dom: _helo_dom, _Oekoreg: _oekoreg, MstOK: mstok, OK: ok, KeineMP: keinemp, gesamtdeckg: _gesamtdeckg });

		} else {
			let messgroup = this.MessDataGr.filter(dd => dd._Messstelle == mst);


			if (messgroup.length == 0) {
				this.MessDataGr.push({ _Nr: this.MessDataGr.length + 1, _Messstelle: mst, _AnzahlTaxa: 0, _TypMP: _typmp, _TypDIA: _typdia, _TypWRRL: _typwrrl, _TypPhytoBenthos: _typphytobenth, _UMG: _umg, _Veroedung: _veroedung, _B_veroedung: _b_veroedung, _Helo_dom: _helo_dom, _Oekoreg: _oekoreg, MstOK: mstok, OK: ok, KeineMP: keinemp, gesamtdeckg: _gesamtdeckg },);
			}
			else {
				for (let i = 0, l = this.MessDataGr.length; i < l; i += 1) {

					if (this.MessDataGr[i]._Messstelle == mst) {
						var _Nr: number = this.MessDataGr[i]._Nr;
						var _Messstelle: string = this.MessDataGr[i]._Messstelle;
						var _AnzahlTaxa: number = this.MessDataGr[i]._AnzahlTaxa + 1;
						var _TypMP: string = this.MessDataGr[i]._TypMP
						var _TypDIA: string = this.MessDataGr[i]._TypDIA
						var _TypWRRL: string = this.MessDataGr[i]._TypWRRL
						var _TypPhytoBenthos: string = this.MessDataGr[i]._TypPhytoBenthos

						var _UMG: string = this.MessDataGr[i]._UMG
						var _Veroedung: string = this.MessDataGr[i]._Veroedung
						var _B_veroedung: string = this.MessDataGr[i]._B_veroedung
						var _Oekoreg: string = this.MessDataGr[i]._Oekoreg
						var _Helo_dom: string = this.MessDataGr[i]._Helo_dom
						if (this.MessDataGr[i].MstOK == false || MstOK == false) { MstOK = false; } else { MstOK = true }
						if (this.MessDataGr[i].OK == false || ok == false) { OK = false; } else { OK = true; };
						var KeineMP: boolean;
						if (this.MessDataGr[i].KeineMP == false || keinemp == false) { KeineMP = false; } else { KeineMP = true; };
						var agesamtdeckg: string = this.MessDataGr[i].gesamtdeckg;




						this.MessDataGr.splice(i, 1);//löscht vorhandenen DS
						this.MessDataGr.push({ _Nr, _Messstelle, _AnzahlTaxa, _TypMP, _TypDIA, _TypWRRL, _TypPhytoBenthos, _UMG, _Veroedung, _B_veroedung, _Helo_dom, _Oekoreg, MstOK, OK, KeineMP, gesamtdeckg: agesamtdeckg });
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
}




