import { Component, OnInit,Output ,ViewChild,Injectable} from '@angular/core';
//import {  Injectable} from "@angular/core";
import {PageEvent} from '@angular/material/paginator';
import { FileUploadService } from '../services/file-upload.service';
import * as XLSX from 'xlsx';
import { SortEvent } from 'primeng/api';
import { Messgroup } from '../interfaces/messgroup';
import { Messwerte } from '../interfaces/messwerte';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import {ValExceltabsService} from '../services/val-exceltabs.service';
import { SelectjahrComponent } from '../select/selectjahr/selectjahr.component'; 
import { SelectProbenehmerComponent } from '../select/select-probenehmer/select-probenehmer.component'; 






@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
@Injectable()
export class FileUploadComponent implements OnInit {
	@ViewChild(SelectjahrComponent, {static: false}) child1: SelectjahrComponent;
	@ViewChild(SelectProbenehmerComponent, {static: false}) childPN: SelectProbenehmerComponent;
	InfoBox = 'Start BioDB. Keine Infos!';
	public einheiten:any;
	public mst:any;
	public formen:any;
	public arten:any;
	public tiefen:any;
	public jahr:any;
	public probenehmer:any;
	public importuebersicht:any;
	arrayBuffer:any;
	public mstimptab:boolean=false;
	public Datimptab:boolean=false;
	public newDate: string;


	public MessData:Messwerte[]=[];	public MessDataOrgi:Messwerte[]=[];public MessDataGr:Messgroup[]=[];public MessDataImp:Messwerte[]=[];



	
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor(private fileUploadService: FileUploadService,private xlsxImportPhylibService:XlsxImportPhylibService,private valExceltabsService:ValExceltabsService) { 
	}
	
	ngOnInit() {
		// this.jahrsel.ngOnInit
		// this.jahr=this.jahrsel.Jahr;
	}
	onValueChange($event){
		console.log($event)
		this.newDate=$event;
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


	hole(){
	
	
		if (this.xlsxImportPhylibService.vorhanden===true)
		{this.InfoBox="mist"} else
		{this.InfoBox="allet jut"};
	
	
	}
	
	async pruefeObMesswerteschonVorhanden(){
		if (this.MessDataOrgi.length>0){
		await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr,this.probenehmer);
		
		if (this.xlsxImportPhylibService.vorhanden==true)
		{this.InfoBox="mist"} else
		{this.InfoBox="allet jut"};}else {this.InfoBox="Bitte erst eine Importdatei hochladen."} 

	}
	async	importIntoDB(){
			this.jahr=this.child1.selected;
			this.probenehmer=this.childPN.selectedPN;
			console.log(this.jahr);

			if (!this.jahr){this.InfoBox="Bitte erst das Untersuchungsjahr auswählen.";
			}else{

			if (!this.probenehmer){this.InfoBox="Bitte erst den Probenehmer auswählen.";
			}else 

			if (this.MessDataOrgi.length>0){
				await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr,this.probenehmer);
				await this.xlsxImportPhylibService.pruefeObMessstellenschonVorhanden(this.jahr,this.probenehmer);
				
				if (this.xlsxImportPhylibService.vorhanden===true)
				{this.InfoBox="Es sind bereits Messwerte der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden."} else
				if (this.xlsxImportPhylibService.vorhandenMst===true)
				{this.InfoBox="Es sind bereits abiotische Daten der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden."} else


				{this.InfoBox="Der Import wird durchgeführt.";this.InfoBox=this.xlsxImportPhylibService.importIntoDB(this.jahr,this.probenehmer);};}else {this.InfoBox="Bitte erst eine Importdatei hochladen."} 
		
			}}


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
				if (workbook.SheetNames.length===2){
					if ((workbook.SheetNames[0]=='Messstellen' ||  workbook.SheetNames[0]=='Messstelle') && workbook.SheetNames[1]=='Messwerte') {

						
						//importiert die Daten aus der XLSX in die Interfaces Messwerte und Messgroup
						this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						this.xlsxImportPhylibService.Phylibimport(workbook);
						this.MessDataOrgi=this.xlsxImportPhylibService.MessDataOrgi;
						this.MessDataGr=this.xlsxImportPhylibService.MessDataGr;
						//this.Phylibimport(workbook);
					console.log(this.xlsxImportPhylibService.MessDataGr);
					this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "), Import erfolgt. " + this.xlsxImportPhylibService.MessDataImp.length + " Datensätze in der Importdatei.";
					
					}
					else{this.InfoBox="Fehler beim Import von (" + this.file.name+ "). Die Beschriftung der Exeltabs entspricht nicht dem Standard einer Phyli."}
				}else
				if (workbook.SheetNames.length===1){
					//this.xlsxImportPhylibService.Phylibimport(workbook); 
					
					this.valExceltabsService.ExcelTabsinArray(workbook,0);	
					//this.valExceltabsService.ValExcelTabs();
				}

				else
				
				
				{this.InfoBox="Fehler"}



		  
				 
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
	

}


	

