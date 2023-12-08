import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';
import { Messgroup } from '../interfaces/messgroup';
import { Messwerte } from '../interfaces/messwerte';

@Injectable({
  providedIn: 'root'
})
export class XlsxImportPhylibService {

  constructor(private impPhylibServ: ImpPhylibServ) { }


  public einheiten:any;
	public mst:any;
	public formen:any;
	public arten:any;
	public tiefen:any;
	arrayBuffer:any;
	public mstimptab:boolean=false;
	public Datimptab:boolean=false;
	newDate: Date;
	public InfoBox:string="";
	public temp:any;
	vorhanden:boolean;

	public MessData:Messwerte[]=[];	public MessDataOrgi:Messwerte[]=[];public MessDataGr:Messgroup[]=[];public MessDataImp:Messwerte[]=[];
	
	
	
	callarten(){

	
		this.impPhylibServ.getArtenPhylibMP(1).subscribe(arten_ => { 
			this.arten=arten_;
		   //console.log(this.arten);
		   //return einheiten;
		},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;		
	}
	ngOnInit() {
		
		this.impPhylibServ.getFormen().subscribe(formen_ => { 
			this.formen =formen_; 
			console.log(this.formen);

			

			
				 },(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		
				 this.impPhylibServ.getTiefen().subscribe(tief_ => { 
					this.tiefen=tief_;
				  console.log(tief_);
				   //return einheiten;
				},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		this.impPhylibServ.getEinheiten().subscribe(einheiten_ => { 
			this.einheiten=einheiten_;
		   console.log(this.einheiten);
		   //return einheiten;
		},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		//
		this.impPhylibServ.getMst().subscribe(mst_ => { 
			this.mst=mst_;
		  // console.log(this.mst);
		   //return einheiten;
		},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		
	  
	}
  Phylibimport(workbook){
		let array: Messwerte[]=[]; this.MessDataGr=[];this.MessDataOrgi=[];
		//let reader = new FileReader();
		
		var sheets;
		var Messstelle:string;var Probe:string;var Taxon;var Form:string;var Messwert;var Einheit;var Tiefe;var cf;
		let aMessstelle:string;let aProbe:string;let aTaxon;let aForm:string;let aMesswert;let aEinheit;let aTiefe;let acf;
		var Oekoregion;var Makrophytenveroedung;var Begruendung;var Helophytendominanz;var Diatomeentyp;var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;var Veggrenze;var typmp;
		let mstOK:boolean;let ok:boolean;
		let XL_row_object;
		let json_Messstelle;
		let mst:string;
	
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
	
										
									if (i == 'Messstelle') {
										//if (index > 0) { console.log("Insert into Messstellen (Messstelle, Oekoregion, Makrophytenveroedung, Begruendung,Helophytendominanz,Diatomeentyp,Phytobenthostyp,Makrophytentyp,WRRLTyp,Gesamtdeckungsgrad) values ('" + Messstelle + "','" + Oekoregion + "','" + Makrophytenveroedung + "','" + Begruendung + "','" + Helophytendominanz + "','" + Diatomeentyp + "','" + Phytobenthostyp + "','" + Makrophytentyp + "','" + WRRLTyp + "','" + Gesamtdeckungsgrad + "');"); }
										Messstelle = obj[index][i];
										if (Messstelle!==null){
											let mstee = this.mst.filter(messstellen => messstellen.namemst== Messstelle);
	
										//console.log(mst);
										
										 if (
											mstee.length !== 0) {mstOK=true;
												}
										 else{
											
											mstOK=false
										 }
											this.groupNAch(Messstelle,typmp,Diatomeentyp,WRRLTyp,Phytobenthostyp,Veggrenze,Makrophytenveroedung,Begruendung,Helophytendominanz,Oekoregion,mstOK,true,false);
										}
										}
									if (i == 'Ökoregion') {
										Oekoregion = obj[index][i];
									}
									if (i == 'Makrophytenverödung') {
										Makrophytenveroedung = obj[index][i];
									}
									if (i == 'Begründung') {
										Begruendung = obj[index][i];
									}
									if (i == 'Helophytendominanz') {
										Helophytendominanz = obj[index][i];
									}
									if (i == 'Diatomeentyp') {
										Diatomeentyp = obj[index][i];
									}
									if (i == 'Phytobenthostyp') {
										Phytobenthostyp = obj[index][i];
									}
									if (i == 'Makrophytentyp') {
										Makrophytentyp = obj[index][i];
									}
									if (i == 'WRRL-Typ') {
										WRRLTyp = obj[index][i];
									}
									if (i == 'Gesamtdeckungsgrad') {
										Gesamtdeckungsgrad = obj[index][i];
									}
									if (i == 'Vegetationsgrenze') {
										Veggrenze = obj[index][i];
									}
									if (i == 'Makrophytentyp') {
										typmp = obj[index][i];
									}
								}
							}
						})
					}
					if (workbook.SheetNames[i] == 'Messwerte') {
						// Here is your object
						let o:number=1;
						obj.forEach((val, index) => {
							if (obj[index] !== null) {
								for (var i in obj[index]) {
									//console.log(val + " / " + obj[index][i] + ": " + i);
	
									o=o+1;
	
									
									if (i == 'Messstelle') {
										
										if (index > 0) { //console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
											array.push({_Nr:o,_Messstelle:mst,_Tiefe:Tiefe,_Probe:Probe,_Taxon:Taxon, _Form:Form, _Messwert:Messwert, _Einheit:Einheit, _cf:cf,MstOK:mstOK,OK:ok,_AnzahlTaxa:1,_idAbundanz:'1'});
											this.MessDataOrgi.push({_Nr:o,_Messstelle:aMessstelle,_Tiefe:aTiefe,_Probe:aProbe,_Taxon:aTaxon, _Form:aForm, _Messwert:Messwert, _Einheit:aEinheit, _cf:cf,MstOK:mstOK,OK:ok,_AnzahlTaxa:1,_idAbundanz:'1'});
										this.groupNAch(aMessstelle,null,null,null,null,null,null,null,null,null,mstOK,ok,null); 

										Messstelle=null;Probe=null;Taxon=null; Form=null;Messwert=null;Einheit=null;Tiefe=null;cf=null;ok=true;mstOK=true;
										aMessstelle=null;aProbe=null;aTaxon=null;aForm=null;aMesswert=null;aEinheit=null;aTiefe=null;acf=null;
									}
										
										mst = obj[index][i];
										//aMessstelle=mst;
										//taxonzus=new Taxonzus();
										let mstee = this.mst.filter(messstellen => messstellen.namemst== mst);
	
										//console.log(mst);
										
										 if (
											mstee.length !== 0) {mstOK=true;
												mst=mstee[0].id_mst;aMessstelle=mstee[0].namemst;}
										 else{
											aMessstelle=mst;
											mstOK=false
										 }
										
										//Messstelle = obj[index][i];
										}
									if (i == 'Probe') {
										aProbe = obj[index][i];
										Probe='11';
									}
									if (i == 'Taxon') {
										//ok=false;
										Taxon = obj[index][i];
										let taxon_ = this.arten.filter(arten => arten.taxon== Taxon);
										if (taxon_.length !== 0) {Taxon=taxon_[0].id_taxon;aTaxon=taxon_[0].taxon;ok=false;}else
										{
											ok=false;
											var taxon2 = this.arten.filter(arten => arten.dvnr== Taxon);
											if (taxon2.length !== 0) {aTaxon=taxon2[0].taxon;}

											
										 }
									}
									if (i == 'Form') {
										Form;
										
										var employeeName:string = obj[index][i];

										//console.log(this.formen);
										//taxonzus=new Taxonzus();
										let taxonzus = this.formen.filter(formen => formen.importname== employeeName);
	
										//console.log(id_taxonzus);
										
										 if (taxonzus !== null) {Form=taxonzus[0].id_taxonzus;aForm=employeeName;}
										 ok=false;
										}
									if (i == 'Messwert') {
										Messwert = obj[index][i];
	
									}
									if (i == 'Einheit') {
	
										var EinheitName:string = obj[index][i];
										let einh= this.einheiten.filter((einheit) => einheit.importname== EinheitName);
										if (einh !== null) {
											Einheit = einh[0].id;aEinheit=EinheitName;
											//console.log('Einheit:'+Einheit);
										}}
										if (i == 'Tiefenbereich') {
	
											var TiefenName:string = obj[index][i];
											let tief= this.tiefen.filter((tiefe) => tiefe.importname== TiefenName);
											if (tief !== null) {
												Tiefe = tief[0].id_tiefe;aTiefe=TiefenName;
												//console.log('Einheit:'+Einheit);
											}else{Tiefe=1;aTiefe=""}
	
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
				this.MessDataImp=array;
				
	}
  groupNAch(mst:string,_typmp:string,_typdia:string,_typwrrl:string,_typphytobenth,_umg:string,_veroedung:string,_b_veroedung:string,_helo_dom:string,_oekoreg:string,mstok:boolean,ok:boolean,keinemp:boolean){
		let MstOK:boolean;let OK:boolean;
		// console.log(mst)
		if (this.MessDataGr.length==0){

			_Typ:String;
		_UMG
			this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,_TypMP:_typmp,_TypDIA:_typdia,_TypWRRL:_typwrrl,_TypPhytoBenthos:_typphytobenth,_UMG:_umg,_Veroedung:_veroedung,_B_veroedung:_b_veroedung,_Helo_dom:_helo_dom,_Oekoreg:_oekoreg,MstOK:mstok,OK:ok,KeineMP:keinemp});

		}else{
			let messgroup = this.MessDataGr.filter(dd => dd._Messstelle== mst);
			

			if (messgroup.length==0){
				this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,_TypMP:_typmp,_TypDIA:_typdia,_TypWRRL:_typwrrl,_TypPhytoBenthos:_typphytobenth,_UMG:_umg,_Veroedung:_veroedung,_B_veroedung:_b_veroedung,_Helo_dom:_helo_dom,_Oekoreg:_oekoreg,MstOK:mstok,OK:ok,KeineMP:keinemp});}
			else{
				for (let i = 0, l = this.MessDataGr.length; i < l; i += 1) {
					
				if (this.MessDataGr[i]._Messstelle==mst){
				var _Nr:number=this.MessDataGr[i]._Nr;
				var _Messstelle: string=this.MessDataGr[i]._Messstelle;
				var _AnzahlTaxa: number=this.MessDataGr[i]._AnzahlTaxa+1;
				var _TypMP:string=this.MessDataGr[i]._TypMP
				var _TypDIA:string=this.MessDataGr[i]._TypDIA
				var _TypWRRL:string=this.MessDataGr[i]._TypWRRL
				var _TypPhytoBenthos:string=this.MessDataGr[i]._TypPhytoBenthos
				
				var _UMG:string=this.MessDataGr[i]._UMG
				var _Veroedung:string=this.MessDataGr[i]._Veroedung
				var _B_veroedung:string=this.MessDataGr[i]._B_veroedung
				var _Oekoreg:string=this.MessDataGr[i]._Oekoreg
				var _Helo_dom:string=this.MessDataGr[i]._Helo_dom
				if (this.MessDataGr[i].MstOK==false || MstOK==false) {MstOK=false;}else {MstOK=true}
				if (this.MessDataGr[i].OK==false || ok==false) {OK=false;}else {OK=true;};
				var KeineMP:boolean;
				if (this.MessDataGr[i].KeineMP==false || keinemp==false) {KeineMP=false;}else {KeineMP=true;};


					
				this.MessDataGr.splice(i, 1);//löscht vorhandenen DS
				this.MessDataGr.push({_Nr,_Messstelle,_AnzahlTaxa,_TypMP,_TypDIA,_TypWRRL,_TypPhytoBenthos,_UMG,_Veroedung,_B_veroedung,_Helo_dom,_Oekoreg,MstOK,OK,KeineMP});
				// console.log(this.MessDataGr)
				break;
					}}
			}
	
	}
			
	}

	
	 pruefeObMesswerteschonVorhanden(jahr:string,probenehmer:string){

		let jahrtemp:string; this.vorhanden=false;
		jahrtemp=('15.07.2006');probenehmer='1';
		let i=0;
		
		
		for (let i = 0, l = this.MessDataImp.length; i < l; i += 1) {
			this.holeMesswerteausDB(this.MessDataImp[i],jahrtemp,probenehmer,'1')
			
			
			
			
		i += 1;}
	
	}
	holeMesswerteausDB(MessDataImp:Messwerte,datum:string,Probenehmer:string,id_import:string){

		this.impPhylibServ.kontrollPhylibMesswerte(MessDataImp, datum,Probenehmer,id_import).subscribe
		(arten_ => { 
			 this.temp=arten_;
			
		
		},) ;

		this.updateVorhanden();


	}
	updateVorhanden(){
		console.log(this.temp);
		if (this.temp.length){
			this.vorhanden=true;}
	  }
	importIntoDB(jahr:string,probenehmer:string):string{
		this.pruefeObMesswerteschonVorhanden( jahr,probenehmer);
		if (this.vorhanden===true){
			return "Es sind bereits Daten der Importdatei in der Datenbank. Der Import kann leider nicht fortgesetzt werden.";
		} else{
		this.importMesswerteIntoDB(jahr,probenehmer);
			return "Datenimport erfolgreich durchgeführt."}}

	importMesswerteIntoDB(jahr:string,probenehmer:string){
	let jahrtemp:string;
	jahrtemp=("15.07."+jahr);
	console.log(jahrtemp);
	for (let i = 0, l = this.MessDataImp.length; i < l; i += 1) {
		var a=a+1;
		
		
	this.impPhylibServ.postMessstellenPhylib(this.MessDataImp[i], jahrtemp,probenehmer,"1");
	
}}
}




