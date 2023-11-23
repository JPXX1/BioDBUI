import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import {PageEvent} from '@angular/material/paginator';
import { FileUploadService } from './services/file-upload.service';
import * as XLSX from 'xlsx';
import { ImpPhylibServ } from './services/impformenphylib.service';
import { SortEvent } from 'primeng/api';





@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
@Injectable()
export class FileUploadComponent implements OnInit {
	InfoBox = 'Start BioDB. Keine Infos!';
	public einheiten:any;
	public mst:any;
	public formen:any;
	public arten:any;
	public tiefen:any;
	arrayBuffer:any;
	public mstimptab:boolean=false;
	public Datimptab:boolean=false;
	

	public MessData:messdata[]=[];	public MessDataOrgi:messdata[]=[];public MessDataGr:Messgroup[]=[];public MessDataImp:messdata[]=[];
	//xls:WorkBook11;


	
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor(private fileUploadService: FileUploadService,private impPhylibServ: ImpPhylibServ) { 
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
callarten(){

	
	this.impPhylibServ.getArtenPhylibMP(1).subscribe(arten_ => { 
		this.arten=arten_;
	   //console.log(this.arten);
	   //return einheiten;
	},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;		
}
	  
	// On file Select 
	onChange(event) {
		this.file=event.target.files[0];
		this.mstimptab=false;  this.Datimptab=false;
	}




	customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });}
	// OnClick of button Upload 
	onUpload() {
		this.loading = !this.loading;
		this.mstimptab=true;  
		//console.log(this.file); 
		//this.startconvertExcelToJson(this.file);

		this.shortLink='FF';
		
		this.fileUploadService.upload(this.file).subscribe(
			(event: any) => {
				if (typeof (event) === 'object') {

					// Short link via api response 
					//this.shortLink = event.link;

					this.loading = false; // Flag variable 
				}
			}
		);
	}
	
	group(){
		
	var temp=this.groupBy(this.MessData,'_Messstelle');
	for (let i = 0, l = temp.length; i < l; i += 1) {
		//console.log(temp[i]);
	}
	
	
}
	groupBy = (array, key) => {
		// Return the end result
		return array.reduce((result, currentValue) => {
		  // If an array already present for key, push it to the array. Else create an array and push the object
		  ;(result[currentValue[key]] = result[currentValue[key]] || []).push(
			currentValue,
		  )
		  // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
		  return result
		}, {}) // empty object is the initial value for result object
	  }
		addfile()     
		{  
			this.mstimptab=true; this.Datimptab=false;  
	//	this.file= event.target.files[0];     
		let fileReader = new FileReader();    
		fileReader.readAsArrayBuffer(this.file);     
		fileReader.onload = (e) => {    
			this.arrayBuffer = fileReader.result;    
			var data = new Uint8Array(this.arrayBuffer);    
			var arr = new Array();    
			for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
			var bstr = arr.join("");    
			var workbook = XLSX.read(bstr, {type:"binary"}); 
			
			
			//Exceltabs auslesen

			//for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {

				//Phylibimportdatei
				if (workbook.SheetNames.length=2){
					if ((workbook.SheetNames[0]=='Messstellen' ||  workbook.SheetNames[0]=='Messstelle') && workbook.SheetNames[1]=='Messwerte') {

						this.impPhylibServ.getArtenPhylibMP(1).subscribe(arten_ => { 
							this.arten=arten_;
						   //console.log(this.arten);
						   //return einheiten;
						},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	

						this.impPhylibServ.getTiefen().subscribe(tiefen_ => { 
							this.tiefen=tiefen_;
						   console.log(this.tiefen);
						   //return einheiten;
						},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
					this.Phylibimport(workbook);
					console.log(this.MessDataGr);
					this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "), Import erfolgt. " + this.MessData.length + " Datensätze in der Importdatei.";
					
					}
					else{this.InfoBox="Fehler beim Import von (" + this.file.name+ "). Die Beschriftung der Exeltabs entspricht nicht dem Standard."}
				}else{this.InfoBox="Fehler"}



		  
				 
		}    
	  }  ;
	


	
	  Phylibimport(workbook){
		let array: messdata[]=[]; this.MessDataGr=[];this.MessDataOrgi=[];
		//let reader = new FileReader();
		
		var sheets;
		var Messstelle:string;var Probe:string;var Taxon;var Form:string;var Messwert;var Einheit;var Tiefe;var cf;
		let aMessstelle:string;let aProbe:string;let aTaxon;let aForm:string;let aMesswert;let aEinheit;let aTiefe;let acf;
		var Oekoregion;var Makrophytenveroedung;var Begruendung;var Helophytendominanz;var Diatomeentyp;var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
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
											this.groupNAch(Messstelle,mstOK,true);
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
											array.push({_Nr:o,_Messstelle:mst,_Tiefe:Tiefe,_Probe:Probe,_Taxon:Taxon, _Form:Form, _Messwert:Messwert, _Einheit:Einheit, _cf:cf,MstOK:mstOK,OK:ok,_AnzahlTaxa:1});
											this.MessDataOrgi.push({_Nr:o,_Messstelle:aMessstelle,_Tiefe:aTiefe,_Probe:Probe,_Taxon:aTaxon, _Form:aForm, _Messwert:Messwert, _Einheit:aEinheit, _cf:cf,MstOK:mstOK,OK:ok,_AnzahlTaxa:1});
										this.groupNAch(aMessstelle,mstOK,ok); 

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
										Probe = obj[index][i];
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
				//this.makeChildrenTree();	
		
	}

	handleRowClick(mst:string){
		this.Datimptab=true;
		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== mst);
		this.MessData=messgroup;
		console.log(mst);
	}
	// makeChildrenTree(){
	// 	let mst ;
	// 	let array: messdata[]=[];
	// 	for (let i = 0, l = this.MessDataGr.length; i < l; i += 1) {
	// 		console.log(this.MessDataOrgi[1]._Messstelle)
	// 	 mst =this.MessDataGr[i]._Messstelle;
	// 		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== mst);
	// 		array=[];
	// 		if (messgroup.length!=0){
	// 			for (let a = 0, le = messgroup.length; a < le; a += 1) {
	// 			array.push({_Nr:a+1,_Messstelle:messgroup[a]._Messstelle,_Probe:messgroup[a]._Probe,_Taxon:messgroup[a]._Taxon, _Form:messgroup[a]._Form, _Messwert:messgroup[a]._Messwert, _Einheit:messgroup[a]._Einheit, _cf:messgroup[a]._cf,MstOK:messgroup[a].MstOK,OK:messgroup[a].MstOK,_AnzahlTaxa:messgroup[a]._AnzahlTaxa});	
	// 			}}
	// 			this.MessDataGr[i].children=array;	
	// }
	
  
	
	// }
	
	length = 100;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];
	// MatPaginator Output
	pageEvent: PageEvent;

	setPageSizeOptions(setPageSizeOptionsInput: string) {
	  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);}

	//displayedColumns2: string[] = ['Nr','Messstelle', 'Taxa', 'Wert', 'Einheit'];
	displayedColumns: string[] = ['Nr','Messstelle', 'AnzahlTaxa', 'Mst_bekannt', 'Fehler'];
	
	dataSource=this.MessDataGr;
	groupNAch(mst:string,mstok:boolean,ok:boolean){
		let MstOK:boolean;let OK:boolean;
		// console.log(mst)
		if (this.MessDataGr.length==0){
			this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,MstOK:mstok,OK:ok});

		}else{
			let messgroup = this.MessDataGr.filter(dd => dd._Messstelle== mst);
			

			if (messgroup.length==0){
			this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,MstOK:mstok,OK:ok});}
			else{
				for (let i = 0, l = this.MessDataGr.length; i < l; i += 1) {
					
				if (this.MessDataGr[i]._Messstelle==mst){
				var _Nr:number=this.MessDataGr[i]._Nr;
				var _Messstelle: string=this.MessDataGr[i]._Messstelle;
				var _AnzahlTaxa: number=this.MessDataGr[i]._AnzahlTaxa+1;
				if (this.MessDataGr[i].MstOK==false || MstOK==false) {MstOK=false;}else {MstOK=true}
				if (this.MessDataGr[i].OK==false || ok==false) {OK=false;}else {OK=true;};

					
				this.MessDataGr.splice(i, 1);//löscht vorhandenen DS
				this.MessDataGr.push({_Nr,_Messstelle,_AnzahlTaxa,MstOK,OK});
				// console.log(this.MessDataGr)
				break;
					}}
			}
	
	}
			
	}

}

	interface messdata{
		_Nr:number;
		_Messstelle: string;
		_Tiefe:string;
		_Probe: string;
		_Taxon: string;
		_Form: string;
		_Messwert: string;
		_Einheit: string;
		_cf: string;
		MstOK:boolean;
		OK:boolean;
		_AnzahlTaxa: number;
	}

	interface Messgroup{
		_Nr:number;
		_Messstelle: string;
		_AnzahlTaxa: number;
		MstOK:boolean;
		OK:boolean;
		
		
	}
	

