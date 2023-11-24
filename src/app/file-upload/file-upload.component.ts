import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import {PageEvent} from '@angular/material/paginator';
import { FileUploadService } from '../services/file-upload.service';
import * as XLSX from 'xlsx';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import { SortEvent } from 'primeng/api';
import { Messgroup } from '../interfaces/messgroup';
import { Messwerte } from '../interfaces/messwerte';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service'





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
	newDate: Date;

	public MessData:Messwerte[]=[];	public MessDataOrgi:Messwerte[]=[];public MessDataGr:Messgroup[]=[];public MessDataImp:Messwerte[]=[];
	//xls:WorkBook11;


	
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor(private fileUploadService: FileUploadService,private xlsxImportPhylibService:XlsxImportPhylibService) { 
	}
	
	ngOnInit() {
		// this.impPhylibServ.getFormen().subscribe(formen_ => { 
		// 	this.formen =formen_; 
		// 	console.log(this.formen);

			

			
		// 		 },(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		
		// 		 this.impPhylibServ.getTiefen().subscribe(tief_ => { 
		// 			this.tiefen=tief_;
		// 		  console.log(tief_);
		// 		   //return einheiten;
		// 		},(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		// this.impPhylibServ.getEinheiten().subscribe(einheiten_ => { 
		// 	this.einheiten=einheiten_;
		//    console.log(this.einheiten);
		//    //return einheiten;
		// },(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		// //
		// this.impPhylibServ.getMst().subscribe(mst_ => { 
		// 	this.mst=mst_;
		//   // console.log(this.mst);
		//    //return einheiten;
		// },(err) =>{this.InfoBox=this.InfoBox+" " + err.message}) ;	
		
	  
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
	
	// group(){
		
	// var temp=this.groupBy(this.MessData,'_Messstelle');
	// for (let i = 0, l = temp.length; i < l; i += 1) {
	// 	//console.log(temp[i]);
	// }
	
	
// }
	// groupBy = (array, key) => {
	// 	// Return the end result
	// 	return array.reduce((result, currentValue) => {
	// 	  // If an array already present for key, push it to the array. Else create an array and push the object
	// 	  ;(result[currentValue[key]] = result[currentValue[key]] || []).push(
	// 		currentValue,
	// 	  )
	// 	  // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
	// 	  return result
	// 	}, {}) // empty object is the initial value for result object
	//   }
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

						
						//importiert die Daten aus der XLSX in die Interfaces Messwerte und Messgroup
						this.xlsxImportPhylibService.Phylibimport(workbook);
						this.MessDataOrgi=this.xlsxImportPhylibService.MessDataOrgi;
						this.MessDataGr=this.xlsxImportPhylibService.MessDataGr;
						//this.Phylibimport(workbook);
					console.log(this.xlsxImportPhylibService.MessDataGr);
					this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "), Import erfolgt. " + this.xlsxImportPhylibService.MessData.length + " Datensätze in der Importdatei.";
					
					}
					else{this.InfoBox="Fehler beim Import von (" + this.file.name+ "). Die Beschriftung der Exeltabs entspricht nicht dem Standard."}
				}else{this.InfoBox="Fehler"}



		  
				 
		}    
	  }  ;
	


	
	 

	handleRowClick(mst:string){
		this.Datimptab=true;
		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== mst);
		this.MessData=messgroup;
		console.log(mst);
	}
	
	
	length = 100;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];
	// MatPaginator Output
	pageEvent: PageEvent;

	setPageSizeOptions(setPageSizeOptionsInput: string) {
	  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);}

	//displayedColumns2: string[] = ['Nr','Messstelle', 'Taxa', 'Wert', 'Einheit'];
	displayedColumns: string[] = ['Nr','Messstelle', 'MPtyp','VegGrenze','AnzahlTaxa', 'Mst_bekannt', 'Fehler'];
	
	dataSource=this.MessDataGr;
	groupNAch(mst:string,_typ:string,_umg:string,mstok:boolean,ok:boolean){
		let MstOK:boolean;let OK:boolean;
		// console.log(mst)
		if (this.MessDataGr.length==0){

			_Typ:String;
		_UMG
			this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,_Typ:_typ,_UMG:_umg,MstOK:mstok,OK:ok});

		}else{
			let messgroup = this.MessDataGr.filter(dd => dd._Messstelle== mst);
			

			if (messgroup.length==0){
			this.MessDataGr.push({_Nr:this.MessDataGr.length+1,_Messstelle:mst,_AnzahlTaxa:0,_Typ:_typ,_UMG:_umg,MstOK:mstok,OK:ok});}
			else{
				for (let i = 0, l = this.MessDataGr.length; i < l; i += 1) {
					
				if (this.MessDataGr[i]._Messstelle==mst){
				var _Nr:number=this.MessDataGr[i]._Nr;
				var _Messstelle: string=this.MessDataGr[i]._Messstelle;
				var _AnzahlTaxa: number=this.MessDataGr[i]._AnzahlTaxa+1;
				var _Typ:string=this.MessDataGr[i]._Typ
				var _UMG:string=this.MessDataGr[i]._UMG
				if (this.MessDataGr[i].MstOK==false || MstOK==false) {MstOK=false;}else {MstOK=true}
				if (this.MessDataGr[i].OK==false || ok==false) {OK=false;}else {OK=true;};

					
				this.MessDataGr.splice(i, 1);//löscht vorhandenen DS
				this.MessDataGr.push({_Nr,_Messstelle,_AnzahlTaxa,_Typ,_UMG,MstOK,OK});
				// console.log(this.MessDataGr)
				break;
					}}
			}
	
	}
			
	}

}


	

