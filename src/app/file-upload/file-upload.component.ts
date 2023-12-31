import { Component, OnInit,Output ,ViewChild,Injectable} from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';
import * as XLSX from 'xlsx';


import { Messwerte } from '../interfaces/messwerte';
import { Uebersicht } from '../interfaces/uebersicht';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import {ValExceltabsService} from '../services/val-exceltabs.service';
import { SelectjahrComponent } from '../select/selectjahr/selectjahr.component'; 
import { SelectProbenehmerComponent } from '../select/select-probenehmer/select-probenehmer.component'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';





@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
@Injectable()
export class FileUploadComponent implements OnInit {
	@ViewChild(SelectjahrComponent, {static: false}) child1: SelectjahrComponent;
	@ViewChild(SelectProbenehmerComponent, {static: false}) childPN: SelectProbenehmerComponent;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

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
	public uebersicht:Uebersicht[]=[];
	
	dataSource: MatTableDataSource<Uebersicht>;
	

	public MessData:Messwerte[]=[];	public MessDataOrgi:Messwerte[]=[];//public MessDataGr:Messgroup[]=[];
	public MessDataImp:Messwerte[]=[];
	displayColumnNames:string[]=['Nr','Messstelle','Anzahl', 'MPtyp'];
	dynamicColumns:string[]=['nr','mst','anzahl','sp3','actions'];//,'sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','fehler1','fehler2','fehler3'];//,'_Messstelle', '_TypWRRL','_UMG', '_AnzahlTaxa','MstOK', 'OK'
	
	
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor(private fileUploadService: FileUploadService,private xlsxImportPhylibService:XlsxImportPhylibService,private valExceltabsService:ValExceltabsService) { 
	}
	panelOpenState = false;
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




	// customSort(event: SortEvent) {
    //     event.data.sort((data1, data2) => {
    //         let value1 = data1[event.field];
    //         let value2 = data2[event.field];
    //         let result = null;

    //         if (value1 == null && value2 != null) result = -1;
    //         else if (value1 != null && value2 == null) result = 1;
    //         else if (value1 == null && value2 == null) result = 0;
    //         else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
    //         else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

    //         return event.order * result;
    //     });}
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


			async addfile()     
		{  
			this.mstimptab=true; this.Datimptab=false;  
	//	this.file= event.target.files[0];     
		let fileReader = new FileReader();    
		fileReader.readAsArrayBuffer(this.file);     
		 fileReader.onload = async (e) => {    
			this.arrayBuffer = fileReader.result;    
			var data = new Uint8Array(this.arrayBuffer);    
			var arr = new Array();    
			for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
			var bstr = arr.join("");    
			var workbook = XLSX.read(bstr, {type:"binary"}); 
			//Tab1 Inhalte löschen
			//this.MessDataGr=[];
			
			//Exceltabs auslesen und VErfahren auswählen
			await this.valExceltabsService.ExcelTabsinArray(workbook);	
			let valexcelspalten: any=this.valExceltabsService.valspalten

			console.log(this.valExceltabsService.NrVerfahren);
				switch(this.valExceltabsService.NrVerfahren) {
					
				  case 1:
						//importiert die Daten aus der XLSX in die Interfaces Messwerte und Messgroup
						this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						await this.xlsxImportPhylibService.Phylibimport(workbook,this.valExceltabsService.valspalten,0,1,this.valExceltabsService.NrVerfahren);
						// Phylibimport(workbook,valspalten: any, tabMST: number,tabMW: number,verfahrennr : number)
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						
					
						this.displayableColumns(1);
						
						
						this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "). " + this.xlsxImportPhylibService.MessDataOrgi.length + " Datensätze in der Importdatei.";
						
		this.dataSource.sort = this.sort;
					break;
				  case 2:
					this.InfoBox="Phylib-Bewertungen erkannt (" + this.file.name+ "). ";
					this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						await  this.xlsxImportPhylibService.PhylibBewertungimport(workbook,this.valExceltabsService.valspalten,1,this.valExceltabsService.NrVerfahren );
						
						
						this.displayableColumns(2);
						
						break;
					case 3:
					// code block
					break;
					case 4:
					// code block
					break;
					case 5:
					// code block
					break;
				  default:
					// code block
				} 

			



		  
				 
		}    
		
	
	};
displayableColumns(idverfahren:number){
	// if (idverfahren===1){
	this.xlsxImportPhylibService.waehleSpaltenUebersicht(idverfahren,this.valExceltabsService.valspalten,0);
	this.displayColumnNames=this.xlsxImportPhylibService.displayColumnNames;
	this.dynamicColumns=this.xlsxImportPhylibService.dynamicColumns;//}

	this.uebersicht = this.xlsxImportPhylibService.uebersicht;
	this.dataSource = new MatTableDataSource(this.xlsxImportPhylibService.uebersicht);
	this.dataSource.paginator = this.paginator;
}
	handleRowClick(row){
		
		
		
		// event.currentTarget.
		this.Datimptab=true;
		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== row.mst);
		this.MessData=messgroup;
		console.log(row);
	}
	
	
	// length = 100;
	// pageSize = 10;
	// pageSizeOptions: number[] = [5, 10, 25];
	// // MatPaginator Output
	// pageEvent: PageEvent;

	// setPageSizeOptions(setPageSizeOptionsInput: string) {
	//   this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);}

	//displayedColumns2: string[] = ['Nr','Messstelle', 'Taxa', 'Wert', 'Einheit'];
	// displayedColumns: string[] = ['Nr','Messstelle', 'MPtyp','VegGrenze','AnzahlTaxa', 'Mst_bekannt', 'Fehler'];
	
	//dataSource=[{nr:1,mst:'mst',anzahl:1,sp3:'1',sp4:'1',sp5:'1',sp6:'1',sp7:'1',sp8:'1',sp9:'1',sp10:'1',sp11:'1',sp12:'1',sp13:'1'}];//,'_Messstelle', '_TypWRRL','_UMG', '_AnzahlTaxa','MstOK', 'OK'
	//dataSoure=this.uebersicht;
	
	//this.uebersicht;//this.MessDataGr;
	

}


	

