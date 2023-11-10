import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';
import { WorkBook, read, utils, write, readFile } from 'xlsx';
import { ImpPhylibServ } from './services/impformenphylib.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
@Injectable({
	providedIn: 'root'
  })
export class FileUploadComponent implements OnInit {

	
	displayedColumns: string[] = ['mst', 'probe', 'taxon', 'form', 'wert', 'einheit'];
	public MessData:Observable<messdata[]>;
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

		

	  }
	  getFormenPhylib(){
		var data;

			this.impPhylibServ.getFormen().subscribe(formen_ => { 
				data =formen_; 
				console.log(data);
				//return formen;
			 });
	
		return data;
		  }
		  getEinheitenPhylib(){
			let einheiten

			this.impPhylibServ.getEinheiten().subscribe(einheiten_ => { 
				 einheiten=einheiten_;
				console.log(einheiten);
				//return einheiten;
			 });
	
		return einheiten;
		  }
	  

	// On file Select 
	onChange(event) {
		this.file=event.target.files[0];
	}





	// OnClick of button Upload 
	onUpload() {
		this.loading = !this.loading;
		//console.log(this.file); 
		this.convertExcelToJson(this.file);
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
	//listUsers = []


	convertExcelToJson(file) {
		const array: messdata[]=[];
		let reader = new FileReader();
		let workbookkk;
		var sheets;
		var Messstelle:string;var Probe:string;var Taxon;var Form:string;var Messwert;var Einheit;var cf;
		var Oekoregion;var Makrophytenveroedung;var Begruendung;var Helophytendominanz;var Diatomeentyp;var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
		
		let XL_row_object;
		let json_Messstelle;


		//############
		let einheiten

		this.impPhylibServ.getEinheiten().subscribe(einheiten_ => { 
			 einheiten=einheiten_;
			console.log(einheiten);
			//return einheiten;
		 });

		 var formen;

			this.impPhylibServ.getFormen().subscribe(formen_ => { 
				formen =formen_; 
				console.log(formen);
				//return formen;
			 });

		var messstellen;

			 this.impPhylibServ.getMst().subscribe(messstellen_ => { 
				messstellen =messstellen_; 
				 console.log(messstellen);
				 //return formen;
			  });
		//let phylibeinh=einheiten; 
		//let phylibform=this.getFormenPhylib();
		// let p:any=this.getFormenPhylib();
		 

		//##########
		reader.readAsBinaryString(file);
		return new Promise((resolve, reject) => {
			reader.onload = function () {
				//  alert(reader.result);
				let data = reader.result;
				workbookkk = read(data, { type: 'binary' });
				//console.log(workbookkk);
				// workbookkk.SheetNames.forEach(function(sheetName) {

				
				//sheets = workbookkk.SheetNames;

				for (let i = 0, l = workbookkk.SheetNames.length; i < l; i += 1) {


					
					console.log(workbookkk.SheetNames[i]);
					XL_row_object = utils.sheet_to_json(workbookkk.Sheets[workbookkk.SheetNames[i]]);
					json_Messstelle = JSON.stringify(XL_row_object);
					const obj = JSON.parse(json_Messstelle);
					if (workbookkk.SheetNames[i] == 'Messstelle') {
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
					if (workbookkk.SheetNames[i] == 'Messwerte') {
						// Here is your object
						let o:number=1;
						obj.forEach((val, index) => {
							if (obj[index] !== null) {
								for (var i in obj[index]) {
									//console.log(val + " / " + obj[index][i] + ": " + i);

									o=o+1;

									
									if (i == 'Messstelle') {
										if (index > 0) { console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); }
										array.push({_Nr:o,_Messstelle:Messstelle,_Probe:Probe,_Taxon:Taxon, _Form:Form, _Messwert:Messwert, _Einheit:Einheit, _cf:cf});
										
										let mst:string = obj[index][i];
										
										//taxonzus=new Taxonzus();
										let mstee = messstellen.filter(messstellen => messstellen.namemst== mst);

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
										console.log(formen);
										//taxonzus=new Taxonzus();
										let taxonzus = formen.filter(formen => formen.importname== employeeName);

										//console.log(id_taxonzus);
										
										 if (taxonzus !== null) {Form=taxonzus[0].id_taxonzus;}
										 console.log('Form:'+Form);}
									if (i == 'Messwert') {
										Messwert = obj[index][i];

									}
									if (i == 'Einheit') {

										var EinheitName:string = obj[index][i];
										let einh= einheiten.filter((einheit) => einheit.importname== EinheitName);
										if (einh !== null) {
											Einheit = einh[0].id;
											console.log('Einheit:'+Einheit);}


									}
									if (i == 'cf') {

										cf = true;


									} else { cf = false }
								}
							}
						})
						resolve(XL_row_object);console.log(array);
						 of(array);}
				}
			}
		});
	};
	
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








