import { Component, OnInit,Output ,ViewChild,Injectable,EventEmitter,AfterViewInit} from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';
import * as XLSX from 'xlsx';
import { HelpService } from '../services/help.service';
import {PerlodesimportService} from '../services/perlodesimport.service';
import { Messwerte } from '../interfaces/messwerte';
import { Uebersicht } from '../interfaces/uebersicht';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import {ValExceltabsService} from '../services/val-exceltabs.service';
import { SelectjahrComponent } from '../select/selectjahr/selectjahr.component'; 
import { SelectProbenehmerComponent } from '../select/select-probenehmer/select-probenehmer.component'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,Sort} from '@angular/material/sort';
import { UebersichtImport } from 'src/app/interfaces/uebersicht-import';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import {UebersichtImportService} from 'src/app/services/uebersicht-import.service';
import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import {ArraybuendelMstaendern} from 'src/app/interfaces/arraybuendel-mstaendern';
import {MessstelleAendernComponent} from 'src/app/file-upload/messstelle-aendern/messstelle-aendern.component'
import { MatDialog } from '@angular/material/dialog';
import {PhytoseeServiceService} from 'src/app/services/phytosee-service.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
@Injectable()
export class FileUploadComponent implements OnInit,AfterViewInit {
	@ViewChild(SelectjahrComponent, {static: false}) child1: SelectjahrComponent;
	@ViewChild(SelectProbenehmerComponent, {static: false}) childPN: SelectProbenehmerComponent;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@Output() newData =new EventEmitter<MessstellenStam>();
	// arraybuendel:ArraybuendelSel;
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
	public uebersichtImport:UebersichtImport[];
	public newuebersichtImport:UebersichtImport;
	
	ImportIntoDB:boolean=true;
	pruefen:boolean=true;
	dataSource: MatTableDataSource<Uebersicht>;
	mstMakrophyten:MstMakrophyten[];
	ImportDatenAnzeige:boolean=true;
	public MessData:Messwerte[]=[];	public MessDataOrgi:Messwerte[]=[];//public MessDataGr:Messgroup[]=[];
	public MessDataImp:Messwerte[]=[];
	displayColumnNames:string[]=['Nr','Messstelle','Anzahl', 'MPtyp'];
	dynamicColumns:string[]=['nr','mst','anzahl','sp3','fehler1','actions'];//,'sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','fehler1','fehler2','fehler3'];//,'_Messstelle', '_TypWRRL','_UMG', '_AnzahlTaxa','MstOK', 'OK'
	isHelpActive: boolean = false;
	helpText: string = '';
	
	// Variable to store shortLink from api response 
	shortLink: string = "";
	loading: boolean = false; // Flag variable 
	file: File = null; // Variable to store file 

	// Inject service 
	
	constructor ( private snackBar: MatSnackBar,private helpService: HelpService,private router: Router,private authService: AuthService,private anzeigeBewertungMPService:AnzeigeBewertungMPService,private uebersichtImportService:UebersichtImportService,private Farbebewertg:FarbeBewertungService,private perlodesimportService:PerlodesimportService,private fileUploadService: FileUploadService,
		private xlsxImportPhylibService:XlsxImportPhylibService,private valExceltabsService:ValExceltabsService,private phytoseeServiceService:PhytoseeServiceService,
		public dialog: MatDialog,private stammdatenService:StammdatenService) { 

		
	}

	panelOpenState = false;
	async ngOnInit() {
		if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
			
        } else{
			this.ImportDatenAnzeige=false;
		await this.uebersichtImportService.start();
		this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
		this.uebersichtImport=this.uebersichtImportService.uebersicht;
		//console.log(this.uebersichtImport);
	}}
	onValueChange($event){
		console.log($event)
		this.newDate=$event;
	  }
	close(){
		this.ImportDatenAnzeige=false;
	}
	async openexpand(){
		this.ImportDatenAnzeige=true;
		// console.log();
	await this.uebersichtImportService.handle();
	}  
	// On file Select 
	onChange(event) {
		this.ImportDatenAnzeige=false;
		this.file=event.target.files[0];
		this.pruefen=true;this.ImportIntoDB=true;
		this.InfoBox="";
		this.dataSource=new MatTableDataSource();
		this.mstimptab=false;  this.Datimptab=false;
		this.newuebersichtImport= {} as UebersichtImport;
		this.newuebersichtImport.dateiname=this.file.name;
	}
	onDeleteClick(){}

	async handleData(result){

		this.mstMakrophyten=[];
		
		// this.MakrophytenAnzeige=true;
//   this.MakrophytenMstAnzeige=false;
  //await 
  if (result.import_export===true){
  await this.anzeigeBewertungMPService.callImpMstMP(result.id_imp);
  this.anzeigeBewertungMPService.datenUmwandeln("","",2004,2050);

  this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;

  console.log( this.mstMakrophyten);

  }
 
	  }

	  // löst das mousover für die Hilfe aus
	  ngAfterViewInit() {
	
	//	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
		this.helpService.registerMouseoverEvents();}


	
	// OnClick of button Upload 
	onUpload() {
		this.loading = !this.loading;
		this.mstimptab=true;  
		

		this.shortLink='FF';
		
		this.fileUploadService.upload(this.file).subscribe(
			(event: any) => {
				if (typeof (event) === 'object') {

					

					this.loading = false; // Flag variable 
				}
			}
		);

		//name uploaddatei in UeberesichtImport;
		
	
	}


	hole(){
	
	
		if (this.xlsxImportPhylibService.vorhanden===true)
		{this.InfoBox="mist"} else
		{this.InfoBox="allet jut"};
	
	
	}
	
	async pruefeObMesswerteschonVorhanden(){
		this.jahr = this.child1.selected; this.probenehmer = this.childPN.selectedPN;

		if (!this.jahr) {
			this.InfoBox = "Bitte erst das Untersuchungsjahr auswählen.";
		} else {

			if (!this.probenehmer) {
				this.InfoBox = "Bitte erst den Probenehmer auswählen.";
			} else {
				console.log(this.MessDataOrgi.length)
				console.log(this.valExceltabsService.NrVerfahren)
				console.log(this.xlsxImportPhylibService.messstellenImp)
				if ((this.MessDataOrgi.length > 0 && (this.valExceltabsService.NrVerfahren === 1 || this.valExceltabsService.NrVerfahren === 3)) || this.xlsxImportPhylibService.messstellenImp.length > 0) {
					if (this.valExceltabsService.NrVerfahren!==5){await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr, this.probenehmer);}
					else {await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhandenmitJahr( this.probenehmer);}

					if (this.xlsxImportPhylibService.vorhanden == true) { this.InfoBox = "Daten lassen sich nicht oder nur teilweise importieren." ;} else { 
						if (this.xlsxImportPhylibService.doppelteMesswerte()===true)
						{this.InfoBox="Die Importdatei enthält mind. einen doppelten Messwert:" + this.xlsxImportPhylibService.MstDoppelteDS+ ". Der Import wird abgebrochen.";
						console.log(this.InfoBox)} else 
						{this.InfoBox = "Daten sind zum import bereit."; this.ImportIntoDB = false; }};
				} else {
					this.InfoBox = "Bitte erst eine Importdatei hochladen."
				}

			}
		}
	}

			archivImportErzeugen(){

				this.newuebersichtImport.id_imp=this.uebersichtImportService.neueImportid(this.uebersichtImport);
				this.newuebersichtImport.id_pn=this.probenehmer;
				this.newuebersichtImport.jahr=this.jahr;
				this.newuebersichtImport.anzahlmst=0;
				this.newuebersichtImport.anzahlwerte=0;
				this.newuebersichtImport.bemerkung="";
				
				this.uebersichtImportService.archiviereNeueImportUebersicht(this.newuebersichtImport);
				this.xlsxImportPhylibService.uebersichtImport=this.newuebersichtImport;
			}
	async	importIntoDB(){
			this.jahr=this.child1.selected;
			this.probenehmer=this.childPN.selectedPN;
			console.log(this.jahr);

			if (!this.jahr){this.InfoBox="Bitte erst das Untersuchungsjahr auswählen.";
			}else{

			if (!this.probenehmer){this.InfoBox="Bitte erst den Probenehmer auswählen.";
			}else 
			
			{
			
			if (this.valExceltabsService.NrVerfahren===1 || this.valExceltabsService.NrVerfahren===3){
			if (this.MessDataOrgi.length>0 ){
				// await this.xlsxImportPhylibService.pruefeObMesswerteschonVorhanden(this.jahr,this.probenehmer);
				// await this.xlsxImportPhylibService.pruefeObMessstellenschonVorhanden(this.jahr,this.probenehmer);
				
			
				
				this.InfoBox="Der Import wird durchgeführt.";

				//neue importID,Jahr und Probenehmer erzeugen/anfuegen
				
				this.archivImportErzeugen();
				
				 this.InfoBox=await this.xlsxImportPhylibService.importIntoDB(this.jahr,this.probenehmer);
				 return;
				await this.uebersichtImportService.start();
				this.uebersichtImport=this.uebersichtImportService.uebersicht;};}
				else 
				
				console.log(this.valExceltabsService.NrVerfahren);
				if (this.valExceltabsService.NrVerfahren===2 || this.valExceltabsService.NrVerfahren===4 || this.valExceltabsService.NrVerfahren===5){
					if (this.xlsxImportPhylibService.vorhanden===true)
				{this.InfoBox="Es sind bereits Messwerte der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden."} else
				if (this.xlsxImportPhylibService.vorhandenMst===true)
				{this.InfoBox="Es sind bereits abiotische Daten der Importdatei in der Datenbank vorhanden. Der Import kann nicht ausgeführt werden."} else

				

				{this.InfoBox="Der Import wird durchgeführt.";
					if (this.valExceltabsService.NrVerfahren===5){	this.newuebersichtImport.id_komp=5;}
				
					//neue importID,Jahr und Probenehmer erzeugen/anfuegen
				
				
				this.archivImportErzeugen();
				this.xlsxImportPhylibService.holeMst();
				this.InfoBox=this.xlsxImportPhylibService.importBewertungIntoDB(this.jahr,this.probenehmer);
				return;
				await this.uebersichtImportService.start();
				this.uebersichtImport=this.uebersichtImportService.uebersicht;
				
			};}
				else 
				{this.InfoBox="Bitte erst eine Importdatei hochladen."}
				}}
			}
			sortData2(){


			}
			//sortiert Importübersicht 	
	sortData(sort: Sort) {
		const data = this.uebersichtImport.slice();
		if (!sort.active || sort.direction === '') {
			this.uebersichtImport = data;
			return;
		} this.uebersichtImport = [];
		this.uebersichtImport = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'probenehmer':
					return compare(a.probenehmer, b.probenehmer, isAsc);
				case 'dateiname':
					var upperA = a.dateiname.toUpperCase();
    				var upperB = b.dateiname.toUpperCase();
					return compare(upperA, upperB, isAsc);
				case 'verfahren':
					return compare(a.verfahren, b.verfahren, isAsc);
				case 'komponente':
					return compare(a.komponente, b.komponente, isAsc);
				case 'jahr':
					return compare(a.jahr, b.jahr, isAsc);
				case 'importiert':

					const importiertA = Date.parse(b.importiert);
					const importiertB = Date.parse(a.importiert);
					return compare(importiertA, importiertB, isAsc);

				case 'bemerkung':
					return compare(a.bemerkung, b.bemerkung, isAsc);

				default:
					return 0;
			}
		});
	}

	
			async addfile()     
		{  this.ImportDatenAnzeige=false;
			
			this.pruefen=true;
			this.mstimptab=true; this.Datimptab=false;  this.ImportIntoDB=true;
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

			//importUebrsicht ID verfahren festlegen
			
			
			
			console.log(this.valExceltabsService.NrVerfahren);
			this.xlsxImportPhylibService.uebersicht=[];
			this.newuebersichtImport.id_verfahren=this.valExceltabsService.NrVerfahren;
				switch(this.valExceltabsService.NrVerfahren) {
					
				  case 1:
						//importiert die Daten aus der XLSX in die Interfaces Messwerte und Messgroup
						this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						
						await this.xlsxImportPhylibService.Phylibimport(workbook,this.valExceltabsService.valspalten,0,1,this.valExceltabsService.NrVerfahren);
						// Phylibimport(workbook,valspalten: any, tabMST: number,tabMW: number,verfahrennr : number)
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						this.newuebersichtImport.id_komp=1;
					
						this.displayableColumns(1);
						
						
						this.InfoBox="Phylib-Importdatei erkannt (" + this.file.name+ "). " + this.xlsxImportPhylibService.MessDataOrgi.length + " Datensätze in der Importdatei.";
						this.Datimptab=false;
						this.pruefen=false;
						// this.dataSource.sort = this.sort;
					break;
				  case 2:
					this.newuebersichtImport.id_komp=1;
					this.InfoBox="Phylib-Bewertungen erkannt (" + this.file.name+ "). ";
					this.xlsxImportPhylibService.callarten();
						this.xlsxImportPhylibService.ngOnInit();
						// this.xlsxImportPhylibService.uebersicht=[];
						await  this.xlsxImportPhylibService.PhylibBewertungimport(workbook,this.valExceltabsService.valspalten,1,this.valExceltabsService.NrVerfahren );
						
						this.pruefen=false;
						this.displayableColumns(2);
						// this.dataSource.sort=this.sort;
						this.Datimptab=false;
						break;
					case 3:
						this.newuebersichtImport.id_komp=3;
						// this.xlsxImportPhylibService.uebersicht=[];
						this.xlsxImportPhylibService.MessDataOrgi=[];
						await this.perlodesimportService.startimport(workbook);
						this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
						this.InfoBox="Perlodes-Importdatei erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.MessDataOrgi.length + " Datensätze in der Importdatei.";
						// this.xlsxImportPhylibService.uebersicht.sort
					this.displayableColumns(3);
					// this.dataSource.sort=this.sort;
					this.Datimptab=false;
					this.pruefen=false;
					break;
					case 4://MZB export
					// this.xlsxImportPhylibService.uebersicht=[];
					this.newuebersichtImport.id_komp=3;
					await this.perlodesimportService.Perlodesexport(workbook, this.valExceltabsService.valspalten,3,this.valExceltabsService.NrVerfahren );
					// this.xlsxImportPhylibService.uebersicht=[];
					this.InfoBox="Perlodes-Bewertungen erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.";
					this.MessDataOrgi = this.xlsxImportPhylibService.MessDataOrgi;
					this.Datimptab=false;
					this.displayableColumns(4);
					// this.dataSource.sort=this.sort;
					this.pruefen=false;
					break;
					case 5: //PhytoseeExport
					// code block
					await this.phytoseeServiceService.Phytoseeexport(workbook, this.valExceltabsService.valspalten,3,this.valExceltabsService.NrVerfahren);
					this.InfoBox="Phytosee-Export erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.";
					this.Datimptab=false;
					this.displayableColumns(5);
					// this.dataSource.sort=this.sort;
					
					this.pruefen=false;
					break;
					case 6://LLBB_Ilat Import
					await this.phytoseeServiceService.PhytoseeLLBBimport(workbook, this.valExceltabsService.valspalten,1,this.valExceltabsService.NrVerfahren,  this.valExceltabsService.loescheErste5Zeilen);
					
					this.InfoBox="LLBB-Phytoplankton-Import erkannt (" + this.file.name+ ")." + this.xlsxImportPhylibService.uebersicht.length + " Datensätze in der Importdatei.";
					this.Datimptab=false;
					this.displayableColumns(6);
					break;
				  default:
					this.InfoBox="Keine Importdatei."
				}
				 this.dataSource.sort=this.sort;
			}    
	};

	async edit(person: Uebersicht) {
		let mst_id_alt
		// console.log(this.xlsxImportPhylibService.MessDataImp)
		// let mststam1:MessstellenStam[]=this.stammdatenService.messstellenarray;
		
		
		await this.stammdatenService.callBwUebersicht();
		await this.stammdatenService.filterMst(true,false);
	
	  //console.log(this.stammdatenService.wk)
	  let name_alt:string=person.mst;
		
		let aMst = this.stammdatenService.messstellenarray.find(i => i.namemst === name_alt);
		if (aMst)
		{ mst_id_alt=aMst.id_mst;}
	
		let temp:ArraybuendelMstaendern;
		temp=({mststam:this.stammdatenService.messstellenarray,namemst:person.mst});
		
	
		// person.wknamen=(this.stammdatenService.wk);
		const dialogRef = this.dialog.open(MessstelleAendernComponent, {
		  width: '800px',height: '800px',
		  data: temp
		  });
	 
	  
		dialogRef.afterClosed().subscribe(result => {
		  if (result) {
			let mst_id_neu=result.id_mst;
			// let Uebersicht =this.xlsxImportPhylibService.uebersicht.filter(dd=>dd.mst===person.mst)
			let a = this.xlsxImportPhylibService.uebersicht.findIndex(i => i.mst === person.mst);
			this.xlsxImportPhylibService.uebersicht[a].mst=result.namemst
			this.xlsxImportPhylibService.uebersicht[a].fehler1=''; 
			if (this.xlsxImportPhylibService.uebersicht[a].fehler2!=="checked" && this.xlsxImportPhylibService.uebersicht[a].fehler3!=="checked")
				{this.xlsxImportPhylibService.uebersicht[a].import1="checked";}
			
			//let b=this.MessData.findIndex(i => i._Messstelle === person.mst);

			for (let i = 0, l = this.MessDataOrgi.length; i < l; i += 1) {
		console.log(this.MessDataOrgi[i]._Messstelle)
				if (this.MessDataOrgi[i]._Messstelle===name_alt){

					this.MessDataOrgi[i]._Messstelle=result.namemst;
				}
				
			}

			for (let b = 0, l = this.xlsxImportPhylibService.messstellenImp.length; b < l; b += 1) {
				
				
				
				
				if (this.xlsxImportPhylibService.messstellenImp[b].uebersicht.mst===name_alt){

					this.xlsxImportPhylibService.messstellenImp[b].id_mst=result.id_mst;
				}
			}

			console.log(this.xlsxImportPhylibService.MessDataImp)
			for (let c = 0, l = this.xlsxImportPhylibService.MessDataImp.length;c < l; c += 1) {

				
				if (Number(this.xlsxImportPhylibService.MessDataImp[c]._Messstelle)===mst_id_alt){

					this.xlsxImportPhylibService.MessDataImp[c]._Messstelle=mst_id_neu;
				}
			}
			
	
		}});
	  }

displayableColumns(idverfahren:number){
	let tab:number;
	if (idverfahren===4 || idverfahren===5) {tab=2;} else {tab=0;}
	
	this.xlsxImportPhylibService.waehleSpaltenUebersicht(idverfahren,this.valExceltabsService.valspalten,tab);
	this.displayColumnNames=this.xlsxImportPhylibService.displayColumnNames;
	this.dynamicColumns=this.xlsxImportPhylibService.dynamicColumns;//}

	
	//if (idverfahren===1 || idverfahren===2){
		this.uebersicht = this.xlsxImportPhylibService.uebersicht;
	this.dataSource = new MatTableDataSource(this.xlsxImportPhylibService.uebersicht);
	// }else if (idverfahren===3) {
	//	this.uebersicht = this.perlodesimportService.uebersicht;
	//	this.dataSource = new MatTableDataSource(this.perlodesimportService.uebersicht);

	// }
	this.dataSource.paginator = this.paginator;
	this.paginator._intl.itemsPerPageLabel="Zeilen pro Seite";
	}
	handleRowClick(row){
		
		
		
		// event.currentTarget.
		this.Datimptab=true;
		let messgroup = this.MessDataOrgi.filter(dd => dd._Messstelle== row.mst);
		this.MessData=messgroup;
		console.log(row);
	}
	
	getColorFehler(Wert1:boolean,Wert2:boolean){

		return this.Farbebewertg.getColorFehler(Wert1,Wert2);
	  }
	 
	
	
}

function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
	
//   function compare(a, b, isAsc) {
//     if (a < b) {
//         return isAsc ? -1 : 1;
//     }
//     if (a > b) {
//         return isAsc ? 1 : -1;
//     }
//     return 0;
// }

