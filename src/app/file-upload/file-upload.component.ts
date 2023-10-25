import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { WorkBook, read, utils, write, readFile } from 'xlsx';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	constructor(private fileUploadService: FileUploadService) { }

	ngOnInit(): void {
	}

	// On file Select 
	onChange(event) {
		this.file = event.target.files[0];
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
	listUsers = []


	convertExcelToJson(file) {
		let reader = new FileReader();
		let workbookkk;
		var sheets;
		var Messstelle;var Probe;var Taxon;var Form;var Messwert;var Einheit;var cf;
		var Oekoregion;var Makrophytenveroedung;var Begruendung;var Helophytendominanz;var Diatomeentyp;var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
		//var=sheet;
		let XL_row_object;
		let json_Messstelle;
		reader.readAsBinaryString(file);
		return new Promise((resolve, reject) => {
			reader.onload = function () {
				//  alert(reader.result);
				let data = reader.result;
				workbookkk = read(data, { type: 'binary' });
				//console.log(workbookkk);
				// workbookkk.SheetNames.forEach(function(sheetName) {


				sheets = workbookkk.SheetNames;

				for (let i = 0, l = workbookkk.SheetNames.length; i < l; i += 1) {



					console.log(workbookkk.SheetNames[i]);
					XL_row_object = utils.sheet_to_json(workbookkk.Sheets[workbookkk.SheetNames[i]]);
					json_Messstelle = JSON.stringify(XL_row_object);
					const obj = JSON.parse(json_Messstelle);
					if (workbookkk.SheetNames[i] == 'Messstellen') {
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
						
						obj.forEach((val, index) => {
							if (obj[index] !== null) {
								for (var i in obj[index]) {
									//console.log(val + " / " + obj[index][i] + ": " + i);

									if (i == 'Messstelle') {
										if (index > 0) { console.log("Insert into daten (Messstelle, Probe, Taxon, Form,Messwert,Einheit,cf) values ('" + Messstelle + "','" + Probe + "','" + Taxon + "','" + Form + "','" + Messwert + "','" + Einheit + "'," + cf + ");"); }
										Messstelle = obj[index][i];
										}
									if (i == 'Probe') {
										Probe = obj[index][i];
									}
									if (i == 'Taxon') {
										Taxon = obj[index][i];
									}
									if (i == 'Form') {
										Form = obj[index][i];

									}
									if (i == 'Messwert') {
										Messwert = obj[index][i];

									}
									if (i == 'Einheit') {
										Einheit = obj[index][i];


									}
									if (i == 'cf') {

										cf = true;


									} else { cf = false }
								}
							}
						})
						resolve(XL_row_object);
					}
				}
			}
		});
	};

}










