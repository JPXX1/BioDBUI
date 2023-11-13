import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';
import * as XLSX from 'xlsx';
import { ImpPhylibServ } from './services/impformenphylib.service';

 

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
	InfoBox = 'Start BioDB. Keine Infos!';
	public einheiten:any;
	public mst:any;
	public formen:any;
	arrayBuffer:any;
	public MessData:messdata[];	public MessDataGr:messdata[];
	//xls:WorkBook;

	//formen: Taxonzus[] = [];
	//einheiten:Einheiten[]=[];
	
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor(private fileUploadService: FileUploadService,private impPhylibServ: ImpPhylibServ) { 
	}
	
	ngOnInit() {
		this.getMStPhylib;
		this.getEinheitenPhylib;
		this.getFormenPhylib();
		
		//

	  }
	  getFormenPhylib(){
		

			this.impPhylibServ.getFormen().subscribe(formen_ => { 
				this.formen =formen_; 
				console.log(this.formen);

				//return formen;
			 });
	
		//return data;
		  }
		  getEinheitenPhylib(){
			

			this.impPhylibServ.getEinheiten().subscribe(einheiten_ => { 
				 this.einheiten=einheiten_;
				console.log(this.einheiten);
				//return einheiten;
			 });
	
		//return einheiten;
		  }
	  
		  getMStPhylib(){
			

			this.impPhylibServ.getMst().subscribe(mst_ => { 
				 this.mst=mst_;
				console.log(this.mst);
				//return einheiten;
			 });
	
		//return einheiten;
		  }
	// On file Select 
	onChange(event) {
		this.file=event.target.files[0];
	}





	// OnClick of button Upload 
	onUpload() {
		this.loading = !this.loading;
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
	
	console.log(temp);
	
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
					if (workbook.SheetNames[0]=='Messstellen' && workbook.SheetNames[1]=='Messwerte') {
					this.Phylibimport(workbook);this.group();
					this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "), Import erfolgt. " + this.MessData.length + " Datensätze in der Importdatei.";
					
					}
					else{this.InfoBox="Fehler beim Import von (" + this.file.name+ "). Die Beschriftung der Exeltabs entspricht nicht dem Standard."}
				}else{this.InfoBox="Fehler"}





				 






			//var first_sheet_name = workbook.SheetNames[1];    
			//var worksheet = workbook.Sheets[first_sheet_name];    
			//console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
			//  var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
			//	  //this.filelist = [];    
			//	  console.log(arraylist)  ; 
			//	  this.getFormenPhylib();
				  
				 
		}    
	  }  ;
	


	
	  Phylibimport(workbook){
		let array: messdata[]=[];
		//let reader = new FileReader();
		
		var sheets;
		var Messstelle:string;var Probe:string;var Taxon;var Form:string;var Messwert;var Einheit;var cf;
		let aMessstelle:string;let aProbe:string;let aTaxon;let aForm:string;let aMesswert;let aEinheit;let acf;
		var Oekoregion;var Makrophytenveroedung;var Begruendung;var Helophytendominanz;var Diatomeentyp;var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
		
		let XL_row_object;
		let json_Messstelle;
	
	
		//############
		
	
		
		//let phylibeinh=einheiten; 
		//let phylibform=this.getFormenPhylib();
		// let p:any=this.getFormenPhylib();
		 
	
		//##########
		
		
			
				//  alert(reader.result);
				//let data = reader.result;
			
				//console.log(workbookkk);
				// workbookkk.SheetNames.forEach(function(sheetName) {
	
				
				//sheets = workbookkk.SheetNames;
	
				for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {
	
	
					
					console.log(workbook.SheetNames[i]);
					XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
					json_Messstelle = JSON.stringify(XL_row_object);
					const obj = JSON.parse(json_Messstelle);
					if (workbook.SheetNames[i] == 'Messstelle') {
						obj.forEach((val, index) => {
							if (obj[index] !== null) {
								for (var i in obj[index]) {
									//var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
	
										
									if (i == 'Messstelle') {
										if (index > 0) { console.log("Insert into Messstellen (Messstelle, Oekoregion, Makrophytenveroedung, Begruendung,Helophytendominanz,Diatomeentyp,Phytobenthostyp,Makrophytentyp,WRRLTyp,Gesamtdeckungsgrad) values ('" + Messstelle + "','" + Oekoregion + "','" + Makrophytenveroedung + "','" + Begruendung + "','" + Helophytendominanz + "','" + Diatomeentyp + "','" + Phytobenthostyp + "','" + Makrophytentyp + "','" + WRRLTyp + "','" + Gesamtdeckungsgrad + "');"); }
										Messstelle = obj[index][i];
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
										if (index > 0) { console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
										array.push({_Nr:o,_Messstelle:aMessstelle,_Probe:Probe,_Taxon:Taxon, _Form:aForm, _Messwert:Messwert, _Einheit:aEinheit, _cf:cf});}
										
										let mst:string = obj[index][i];
										aMessstelle=mst;
										//taxonzus=new Taxonzus();
										let mstee = this.mst.filter(messstellen => messstellen.namemst== mst);
	
										console.log(mst);
										
										 if (mstee !== null) {Messstelle=mstee[0].id_mst;}
										
										//Messstelle = obj[index][i];
										}
									if (i == 'Probe') {
										Probe = obj[index][i];
									}
									if (i == 'Taxon') {
										Taxon = obj[index][i];
									}
									if (i == 'Form') {
										Form;
										
										var employeeName:string = obj[index][i];

										console.log(this.formen);
										//taxonzus=new Taxonzus();
										let taxonzus = this.formen.filter(formen => formen.importname== employeeName);
	
										//console.log(id_taxonzus);
										
										 if (taxonzus !== null) {Form=taxonzus[0].id_taxonzus;aForm=employeeName;}
										 //console.log('Form:'+Form);
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
										}
	
	
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
				this.MessData=array;
					
		
	}

	displayedColumns: string[] = ['mst', 'probe', 'taxon', 'form', 'wert', 'einheit'];
	
		
	}



	interface messdata{
		_Nr:number;
		_Messstelle: string;
		_Probe: string;
		_Taxon: string;
		_Form: string;
		_Messwert: string;
		_Einheit: string;
		_cf: string;
	}

	interface Messgroup{
		_Nr:number;
		_Messstelle: string;
		_Probe: string;
		_AnzahlTaxa: number;
		
	}


