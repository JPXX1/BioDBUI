import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { StammdatenService } from '../services/stammdaten.service'; 

import { MstMakrophyten } from 'src/app/interfaces/mst-makrophyten';
import { AnzeigeBewertungMPService } from 'src/app/services/anzeige-bewertung-mp.service';
import { AnzeigenMstUebersichtService } from 'src/app/services/anzeigen-mst-uebersicht.service';
import { WkUebersicht } from 'src/app/interfaces/wk-uebersicht';
import { AnzeigeBewertungService} from 'src/app/services/anzeige-bewertung.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {FarbeBewertungService} from 'src/app/services/farbe-bewertung.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/services/comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { HelpService } from '../services/help.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-daten-export',
  templateUrl: './daten-export.component.html',
  styleUrls: ['./daten-export.component.css']
})
export class DatenExportComponent implements OnInit,AfterViewInit  {
  items = [];
  public props: any[]=[];
  BewertungwkUebersicht: WkUebersicht[] = [];
  BewertungwkUebersichtleer:boolean=false;
  WKUebersichtAnzeigen=false;
  BewertungenMstAnzeige=false;
  mstMakrophyten: MstMakrophyten[] = []; // TaxaMP
  ArtenAnzeige = false;
  messstellen = [];
  wasserkorper = [];
  filteredMessstellen = [];
  filteredWasserkorper = [];
  
  allMessstellenSelected = false;
  allWasserkorperSelected = false;
  allKomponentenSelected = false;
  form: FormGroup;
  messstellenFilterControl = new FormControl('');
  wasserkorperFilterControl = new FormControl('');
  isMessstellenOpen = false;
  isWasserkorperOpen = false;
  messstellenTypeControl = new FormControl('fluss'); // Default to Fließgewässer
  waterBodyTypeControl = new FormControl('fluss'); // Default to Fließgewässer
  componentTypeControl = new FormControl([]); // For mat-button-toggle-group
  minstart:number=2005;
  maxstart:number= new Date().getFullYear();
  isHelpActive: boolean = false;
	helpText: string = '';
  itemsAbfrage = [
    { id: 'artabundanz', komponente: 'Artabundanzen' },
    { id: 'messstellenbewertung', komponente: 'Messstellenbewertung' },
    { id: 'wasserkorperbewertung', komponente: 'Wasserkörperbewertung' }
  ];
  constructor( private authService: AuthService,private sanitizer: DomSanitizer,private commentService: CommentService, private snackBar: MatSnackBar,private helpService: HelpService,private router: Router,private farbeBewertungService:FarbeBewertungService,private anzeigeBewertungService:AnzeigeBewertungService,private anzeigenMstUebersichtService:AnzeigenMstUebersichtService,private fb: FormBuilder, private anzeigeBewertungMPService:AnzeigeBewertungMPService,private stammdatenService: StammdatenService) {
    this.form = this.fb.group({
      min: new FormControl(2010),
      max: new FormControl( new Date().getFullYear()),
      selectedComponents: [[]],
      selectedWasserkorper: [[]],
      dropdownSelection: [null],
      selectedItems: [[]],
      messstellenType: this.messstellenTypeControl,
      waterBodyType: this.waterBodyTypeControl,
      componentType: this.componentTypeControl // Initialize the form control for button toggle group
    });

    this.messstellenFilterControl.valueChanges.subscribe(value => this.filterMessstellen(value));
    this.wasserkorperFilterControl.valueChanges.subscribe(value => this.filterWasserkorper(value));
    this.messstellenTypeControl.valueChanges.subscribe(() => this.filterMessstellenType());
    this.waterBodyTypeControl.valueChanges.subscribe(() => this.filterWaterBodies());
    this.componentTypeControl.valueChanges.subscribe(() => this.onToggleChange()); // Subscribe to value changes
  }
	  // löst das mousover für die Hilfe aus
	  ngAfterViewInit() {
	
      const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
      this.helpService.registerMouseoverEvents();}


  async ngOnInit() {
   
    if (!this.authService.isLoggedIn()) {
			this.router.navigate(['/login']);
			
        } else{
		
		this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
      this.loadWasserkorperData();
      this.loadMessstellenData();
      this.loadKomponentenData();
      this.stammdatenService.start(true,true);
      await this.anzeigeBewertungService.ngOnInit();
		//console.log(this.uebersichtImport);
        }
  
  }
  onSelectionChange(event) {
    const selectedItems = event.value;
    // const a=this.form.get('selectedItems')?.
    if (selectedItems.length > 0 ) {
      this.form.get('componentType').setValue(['artabundanz']);
    }
  }
  async loadWasserkorperData() {
    await this.stammdatenService.startwk(false, true);
    this.wasserkorper = this.stammdatenService.wkarray;
    this.sortWasserkorper();
    this.filterWaterBodies();
  }

  async loadKomponentenData() {
    await this.stammdatenService.callKomponenten();
    
    this.items = this.stammdatenService.komponenten.filter(m => m.id!=6);
  }

  async loadMessstellenData() {
    await this.stammdatenService.start(false, true);
    this.messstellen = this.stammdatenService.messstellenarray;
    this.sortMessstellen();
    this.filterMessstellenType();
  }

  sortWasserkorper() {
    this.wasserkorper.sort((a, b) => a.wk_name.localeCompare(b.wk_name));
  }

  sortMessstellen() {
    this.messstellen.sort((a, b) => a.namemst.localeCompare(b.namemst));
  }

  onMessstellenOpen() {
    this.isMessstellenOpen = true;
  }

  onMessstellenClose() {
    this.isMessstellenOpen = false;
  }

  onWasserkorperOpen() {
    this.isWasserkorperOpen = true;
  }

  onWasserkorperClose() {
    this.isWasserkorperOpen = false;
  }

  filterMessstellen(filterValue: string) {
    const selectedMessstellenIds = this.form.get('selectedComponents')?.value || [];
    const selectedMessstellen = this.filteredMessstellen.filter(m => selectedMessstellenIds.includes(m.id_mst));

    const filteredMessstellen = this.messstellen.filter(m =>
      m.namemst.includes(filterValue)
    );

    if (!filterValue) {
      this.filteredMessstellen = [... this.messstellen];
    } else {
      this.filteredMessstellen = Array.from(new Set([...selectedMessstellen, ...filteredMessstellen]));
    }
  }

  filterWasserkorper(filterValue: string) {
    const selectedWasserkorperIds = this.form.get('selectedWasserkorper')?.value || [];
    const selectedWasserkorper = this.filteredWasserkorper.filter(w => selectedWasserkorperIds.includes(w.id));

    const filteredWasserkorper = this.wasserkorper.filter(w =>
      w.wk_name.includes(filterValue)
    );

    if (!filterValue) {
      this.filteredWasserkorper = [...this.filteredWasserkorper];
    } else {
      this.filteredWasserkorper = Array.from(new Set([...selectedWasserkorper, ...filteredWasserkorper]));
    }
  }

  filterWaterBodies() {
    const waterBodyType = this.waterBodyTypeControl.value;
    if (waterBodyType === 'fluss') {
      this.filteredWasserkorper = this.wasserkorper.filter(w => !w.see);
    } else {
      this.filteredWasserkorper = this.wasserkorper.filter(w => w.see);
    }
    this.filterWasserkorper(this.wasserkorperFilterControl.value);
  }

  filterMessstellenType() {
    const messstellenType = this.messstellenTypeControl.value;
    if (messstellenType === 'fluss') {
      this.filteredMessstellen = this.messstellen.filter(m => !m.see);
    } else {
      this.filteredMessstellen = this.messstellen.filter(m => m.see);
    }
    this.filterMessstellen(this.messstellenFilterControl.value);
  }

  toggleAllMessstellen(isChecked: boolean): void {
    this.allMessstellenSelected = isChecked;
    this.form.get('selectedComponents').setValue(
      isChecked ? this.filteredMessstellen.map(m => m.id_mst) : []
    );
  }
  toggleAllKomponenten(isChecked: boolean): void {
    if (isChecked) {
      this.form.get('selectedItems').setValue(this.items.map(item => item.id));
      this.form.get('componentType').setValue(['artabundanz']); // Initialisieren mit "Artabundanz"
    } else {
      this.form.get('selectedItems').setValue([]);
      this.form.get('componentType').setValue([]);
    }
    this.allKomponentenSelected = isChecked;
  
  }
  toggleAllWasserkorper(isChecked: boolean): void {
    this.allWasserkorperSelected = isChecked;
    this.form.get('selectedWasserkorper').setValue(
      isChecked ? this.filteredWasserkorper.map(w => w.id) : []
    );
  }
  
  

  
  // Hilfsmethode zum Konvertieren von RGB zu HEX
  rgbToHex(rgb: string): string {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase();
  }
 
  exportToExcel(event: Event): void {
    event.preventDefault();
  
const formattedDate = formatDate(new Date());
    // Create a new workbook
const wb: XLSX.WorkBook = XLSX.utils.book_new();
// Bewertung Wasserkörper=>Excel
if (this.BewertungwkUebersicht.length > 0) {
  const worksheetData = this.BewertungwkUebersicht.map(item => Object.values(item));
  const headers = Object.keys(this.BewertungwkUebersicht[0]);
  const exportData = [headers, ...worksheetData];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

  const colWidths = exportData[0].map((_, colIndex) => {
    return {
      wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
    };
  });
  ws['!cols'] = colWidths;

  const columnsToIterate = ['OKZ_QK_P', 'OKZ_TK_MP', 'OKZ_TK_Dia', 'OKZ_QK_MZB', 'OKZ_QK_F', 'OKZ'];
  const columnIndexes = columnsToIterate.map(header => headers.indexOf(header));

  for (let R = 1; R <= worksheetData.length; ++R) {
    for (let C of columnIndexes) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      let cell = ws[cellAddress];

      if (!cell) {
        // Initialize cell if it doesn't exist
        cell = { t: 's', v: '' };
        ws[cellAddress] = cell;
      }
      const value = cell.v;
      let bgColor = '';

      // Change the background color based on the value
      if (headers[C] === 'OKZ_QK_P' || headers[C] === 'OKZ_TK_MP' || headers[C] === 'OKZ_TK_Dia' || headers[C] === 'OKZ_QK_MZB' || headers[C] === 'OKZ_QK_F' || headers[C] === 'OKZ') {
        bgColor = this.farbeBewertungService.getColor(value);
      }

      if (bgColor) {
        const [r, g, b] = bgColor.match(/\d+/g).map(Number); // Extract RGB values
        const hexColor = ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase(); // Convert to hex
        cell.s = {
          fill: {
            fgColor: { rgb: hexColor }
          }
        };
      }
    }
  }
  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Wasserkörperbewertung');


}
//MstBewertung =>Excel

if (this.anzeigenMstUebersichtService.dbMPUebersichtMst != null){ 
  if (this.anzeigenMstUebersichtService.dbMPUebersichtMst.length>0){  
    // Map data to array of arrays for xlsx
    const worksheetData = this.anzeigenMstUebersichtService.dbMPUebersichtMst.map(item => [
      
      item.wkName,
      item.namemst,
      item.komponente,
      item.parameter,
      item.jahr,
      item.wert,
      item.expertenurteil

    ]);   // Add headers
    const headers = [
        'Wasserkörper',
        'Messstelle',
        'Komponente',
        'Parameter',
        'Untersuchungsjahr',
        'Wert',
        'Expertenurteil',
          
    ];
    
 
    // Combine headers and data
    const exportData = [headers, ...worksheetData];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths to fit content
    const colWidths = exportData[0].map((_, colIndex) => {
        return {
            wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
        };
    });
    ws['!cols'] = colWidths;

    // Create a new workbook
   

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Messstellenbewertung');

  
}}
//Abundanzen=> Excel
if (this.mstMakrophyten.length>0){
    // Map data to array of arrays for xlsx
    const worksheetData = this.mstMakrophyten.map(item => [
        item.gewaessername,
        item.mst,
        item.jahr,
        item.taxon,
        item.dvnr,
        item.wert,
        item.taxonzusatz,
        item.firma,
        item.roteListeD,
        item.cf,
        item.tiefe_m,
        item.einheit,
        item.komponente
        
    ]);

    // Add headers
    const headers = [
        'Gewässername',
        'Messstelle',
        'Untersuchungsjahr',
        'Taxon (DVNr)',
        'DVNR',
        'Wert',
        'Taxonzusatz',
        'Probenehmer',
        'Rote Liste D',
        'CF',
        'Tiefe (m)',
        'Einheit',
        'Komponente',
        
    ];

    // Combine headers and data
    const exportData = [headers, ...worksheetData];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
  // Set column widths to fit content
  const colWidths = exportData[0].map((_, colIndex) => {
    return {
        wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
    };
});
ws['!cols'] = colWidths;


    

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Messwerte');

    // Write workbook to binary string
  
  }

//Stammdaten Messstellen exportieren

if (this.mstMakrophyten.length>0 || this.anzeigenMstUebersichtService.dbMPUebersichtMst!=null ){

  const selectedComponents = this.form.get('selectedComponents')?.value;
  // const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
  //   selectedComponents.some(criteria => criteria === item.id_mst)
  // );
  const worksheetData = this.stammdatenService.messstellenarray.filter(item => 
    selectedComponents.some(criteria => criteria === item.id_mst)).map(item => [
    item.gewaessername,
    item.namemst,
    item.hw_etrs,
    item.rw_etrs,
    item.see ? 1 : 0 // Wenn item.see true ist, setze 1, sonst 0
    
]);

// Add headers
const headers = [
    'Gewässername',
    'Messstelle',
    'Hochwert (etrs)',
    'Rechtswert (etrs)',
    'See (1) oder Fließgewässer (0)',
    
];

// Combine headers and data
const exportData = [headers, ...worksheetData];

// Convert data to worksheet
const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
// Set column widths to fit content
const colWidths = exportData[0].map((_, colIndex) => {
return {
    wch: Math.max(...exportData.map(row => (row[colIndex] ? row[colIndex].toString().length : 10))) + 2
};
});
ws['!cols'] = colWidths;




// Append worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Stammdaten_Messstellen');

// Write workbook to binary string
}

if (this.mstMakrophyten.length>0 || this.anzeigenMstUebersichtService.dbMPUebersichtMst!=null  || this.BewertungwkUebersicht!=null )
  {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary string
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Use FileSaver to save the file
    saveAs(blob, 'DatenBioLims' + formattedDate +'.xlsx');}
}

//Abfrage Ergebnisse
async onSubmit() {
  const yearFrom = this.form.get('min').value;
  const yearTo = this.form.get('max').value;
  const dropdownSelection = this.form.get('dropdownSelection')?.value;
  const selectedItems = this.form.get('selectedItems')?.value;
  const componentType = this.form.get('componentType')?.value;
  
  let selectedWasserkorper = this.form.get('selectedWasserkorper')?.value;
 let  selectedComponents = this.form.get('selectedComponents')?.value;

  this.resetDisplayFlags();
  this.clearDataStorage();


 if ((!selectedComponents || selectedWasserkorper.length > 0) && dropdownSelection==='wasserkorper') {
    //wenn nur Wasserkörper im Auswahlmenü ausgewählt sind werden hier die zugeordneten Messstellen abgefragt
     selectedComponents = await this.lueckenfuellenWKMst(selectedWasserkorper);
    //  await this.ArtabundanzenAbfragen(selectedComponents,selectedItems, yearFrom, yearTo);
    //  await this.MstBewertungabfragen(selectedComponents,selectedItems, yearFrom, yearTo);
   }


  if (this.componentTypeControl.value.includes("artabundanz")) {
     
      await this.ArtabundanzenAbfragen(selectedComponents,selectedItems, yearFrom, yearTo);
  } 

  if (this.componentTypeControl.value.includes("messstellenbewertung")) {
    selectedComponents = this.form.get('selectedComponents')?.value;
      await this.MstBewertungabfragen(selectedComponents,selectedItems, yearFrom, yearTo);
  }

  if (this.componentTypeControl.value.includes("wasserkorperbewertung")) {
  
    if ((!selectedWasserkorper || selectedWasserkorper.length === 0) && dropdownSelection==='messstellen') {
      selectedComponents = this.form.get('selectedComponents')?.value;
        selectedWasserkorper = await this.lueckenfuellen(selectedComponents);
    }
     selectedComponents = this.form.get('selectedComponents')?.value;
  
    
      await this.WKbewertungabfragen(selectedWasserkorper, yearFrom, yearTo);
  }
}

resetDisplayFlags() {
  this.WKUebersichtAnzeigen = false;
  this.BewertungenMstAnzeige = false;
  this.ArtenAnzeige = false;
}

clearDataStorage() {
  this.mstMakrophyten = [];
  this.props = [];
  this.BewertungwkUebersicht = [];
}

//von Messstellen->Wasserkörper
  async lueckenfuellen(selectedItems:any[]) {
    let selectedWasserkorper1 = [];

    if (selectedItems.length > 0 && this.BewertungwkUebersicht.length === 0) {
        const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
          selectedItems.some(criteria => criteria === item.id_mst)
        );

        // Extrahieren der 'id_wk' direkt mit 'map'
        selectedWasserkorper1 = messstellenStam.map(item => item.id_wk);
    }
    const uniqueArray = [...new Set(selectedWasserkorper1)];
    return uniqueArray;
}
//von Messstellen->Wasserkörper
async lueckenfuellenWKMst(selectedWasserkorper1:any[]) {
  let selectedItems = [];


      const messstellenStam = this.stammdatenService.messstellenarray.filter(item => 
        selectedWasserkorper1.some(criteria => criteria === item.id_wk)
      );

      // Extrahieren der 'id_wk' direkt mit 'map'
      selectedItems = messstellenStam.map(item => item.id_mst);
  

  const uniqueArray = [...new Set(selectedItems)];
  return uniqueArray;
}
async ArtabundanzenAbfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
  this.anzeigeBewertungMPService.mstMakrophyten=[];
  // 
 await this.stammdatenService.queryArten('messstellen', selectedComponents, Number(yearFrom), Number(yearTo), selectedItems).forEach(
    data => {
         
      // Assign data to the service property
      this.anzeigeBewertungMPService.dbBewertungMst = data;
    });
  
this.anzeigeBewertungMPService.arrayNeuFuellen(0);
    this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;
    this.ArtenAnzeige=true;

}



async MstBewertungabfragen(selectedComponents,selectedItems,yearFrom:string,yearTo:string){
  this.anzeigenMstUebersichtService.value='' ;this.anzeigenMstUebersichtService.Artvalue='';
      
  this.BewertungenMstAnzeige=true;
  // importiert MstBewertungen aller ausgewählter komponenten
  
    await this.anzeigenMstUebersichtService.callBwUebersichtExp(selectedItems);
  
console.log(this.anzeigenMstUebersichtService.dbMPUebersichtMst)
  // const selectedComponents = this.form.get('selectedComponents')?.value;
  // filtert den Array auf ausgewählte Messstellen
 
  
  const filteredArray = this.anzeigenMstUebersichtService.dbMPUebersichtMst.filter(item => {
    const match = selectedComponents.some(selected => Number(selected) === Number(item.idMst));
    if (!match) {
        console.log(`No match for item id_mst: ${item.idMst}`);
    }
    return match;
});

console.log('Filtered Array:', filteredArray);

// Setze das gefilterte Array zurück
this.anzeigenMstUebersichtService.dbMPUebersichtMst = filteredArray;


   await this.anzeigenMstUebersichtService.filterMst('','',Number(yearFrom),Number(yearTo));
  
     this.anzeigenMstUebersichtService.uniqueMstSortCall();
     this.anzeigenMstUebersichtService.uniqueJahrSortCall();
       this.anzeigenMstUebersichtService.datenUmwandeln();
      this.anzeigenMstUebersichtService.erzeugeDisplayedColumnNames(true);
       this.anzeigenMstUebersichtService.erzeugeDisplayColumnNames(true);
  
  
  this.props.push(this.anzeigenMstUebersichtService.mstUebersicht) ;
  this.props.push(this.anzeigenMstUebersichtService.displayColumnNames);
  this.props.push(this.anzeigenMstUebersichtService.displayedColumns);
}


   WKbewertungabfragen(selectedWasserkorper: any[],yearFrom:string,yearTo:string) {
    let filteredArray: any[] = [];
    this.BewertungwkUebersicht = [];
    this.BewertungwkUebersichtleer=false;
    if (selectedWasserkorper.length > 0) {
        if ((selectedWasserkorper.length === 1 && selectedWasserkorper[0] !== 17) || selectedWasserkorper.length > 1) {

          filteredArray =  this.anzeigeBewertungService.wkUebersicht.filter(item => 
            selectedWasserkorper.some(criteria => criteria === item.idwk)
          );
          this.BewertungwkUebersicht = filteredArray.filter(item => item.Jahr >= Number(yearFrom) && item.Jahr <= Number(yearTo));
          // this.BewertungwkUebersicht = filteredArray;
        }
    }

    // Setze das gefilterte Array zurück
    if (filteredArray.length>0){ this.BewertungwkUebersichtleer=true;}else{this.BewertungwkUebersichtleer=false;}
    this.WKUebersichtAnzeigen = true;
}

  onToggleChange() {
   
    if (this.componentTypeControl.value.includes("artabundanz")===true){
      console.log('Toggle changed', this.componentTypeControl.value);
    }
    // Implement additional logic here
  }
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}