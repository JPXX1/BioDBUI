import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstMakrophyten } from '../interfaces/mst-makrophyten';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

//abundanzen Taxa an den Messstellen
export class AnzeigeBewertungMPService {
  public mstMakrophyten: MstMakrophyten[] = [];//gefiltert
  public mstMakrophytenKl: MstMakrophyten; //
  public dbBewertungMst: any;
  displayedColumns: string[] = ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];

   Taxa_MP: MstMakrophyten[] = [];
   Taxa_Dia: MstMakrophyten[] = [];
   Taxa_MZB: MstMakrophyten[] = [];
   Taxa_Phyto: MstMakrophyten[] = [];
  //  Taxa_MP_gefitert: MstMakrophyten[] = [];
  //  Taxa_Dia_gefitert: MstMakrophyten[] = [];
  //  Taxa_MZB_gefitert: MstMakrophyten[] = [];
  //  Taxa_Phyto_gefitert: MstMakrophyten[] = [];
  private apiUrl = environment.apiUrl;
public Artvalue:string;
public value:string;

  constructor(private httpClient: HttpClient) { }

  
  getBwMstTaxa(komp:number) {
    let params = new HttpParams().set('id',komp);
    
    return this.httpClient.get(`${this.apiUrl}/bwMstAbundanzen`, {params});
 }
 async callBwMstTaxa(komp:number) {
 this.dbBewertungMst = [];
  await this.getBwMstTaxa(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;

    console.log(this.dbBewertungMst);
   
  });
this.arrayNeuFuellen(komp);
this.arrayZuweisen(komp);
this.displayedColumnsMP(komp);
}
async callImpMstMP(komp:number) {
 
  await this.bwMstAbundanzenImportID(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;
   
  });
}
bwMstAbundanzenImportID(komp:number) {
  let params = new HttpParams().set('id',komp);
  
  return this.httpClient.get(`${this.apiUrl}/bwMstAbundanzenImportID`, {params});
}
/**
 * Filtert und gibt ein Array von MstMakrophyten basierend auf den angegebenen Parametern zurück.
 *
 * @param {number} komp - Der Komponententyp zum Filtern.
 *                        0: Gibt das ursprüngliche mstMakrophyten-Array zurück.
 *                        1: Filtert mit Taxa_MP.
 *                        2: Filtert mit Taxa_Dia.
 *                        3: Filtert mit Taxa_MZB.
 *                        5: Filtert mit Taxa_Phyto.
 * @param {string} FilterMst - Der anzuwendende Filterstring.
 * @param {string} art - Der Typ der Art zum Filtern.
 * @param {number} min - Der Mindestwert für den Filter.
 * @param {number} max - Der Höchstwert für den Filter.
 * @returns {MstMakrophyten[]} - Das gefilterte Array von MstMakrophyten.
 */
FilterRichtigesArray(komp: number, FilterMst: string, art: string, min: number, max: number): MstMakrophyten[] {
  switch (komp) {
      case 0:
        return this.mstMakrophyten;
      case 1:
          return this.filterTaxadaten(this.Taxa_MP, FilterMst, art, min, max);
      case 2:
          return this.filterTaxadaten(this.Taxa_Dia, FilterMst, art, min, max);
      case 3:
          return this.filterTaxadaten(this.Taxa_MZB, FilterMst, art, min, max);
      case 5:
          return this.filterTaxadaten(this.Taxa_Phyto, FilterMst, art, min, max);
      default:
        return this.mstMakrophyten; // Return an empty array for any other case
  }
}
 
/**
 * Legt die angezeigten Spalten für die MP-Tabelle basierend auf der angegebenen Komponentennummer fest.
 * 
 * @param komp - Die Komponentennummer, die verwendet wird, um den Satz von anzuzeigenden Spalten zu bestimmen.
 *                Wenn `komp` 5 ist, wird ein spezifischer Satz von Spalten angezeigt.
 *                Andernfalls wird ein anderer Satz von Spalten angezeigt.
 */
displayedColumnsMP(komp: number) {
if (komp === 5) {
  this.displayedColumns= ['mst', 'gewaessername','datum', 'taxon', 'wert', 'einheit', 'taxonzusatz',  'letzteAenderung'];
}else {


this.displayedColumns= ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];
}}
/**
 * Filtert ein Array von MstMakrophyten-Objekten basierend auf den angegebenen Kriterien.
 *
 * @param arr - Das zu filternde Array von MstMakrophyten-Objekten.
 * @param FilterMst - Der Filterstring für die Eigenschaften 'mst' oder 'gewaessername'.
 * @param art - Der Filterstring für die Eigenschaft 'taxon'.
 * @param min - Das Mindestjahr für die Eigenschaft 'jahr'.
 * @param max - Das Höchstjahr für die Eigenschaft 'jahr'.
 * @returns Ein Array von MstMakrophyten-Objekten, die den Filterkriterien entsprechen.
 */
filterTaxadaten(arr: MstMakrophyten[], FilterMst: string, art: string, min: number, max: number): MstMakrophyten[] {
  return arr.filter(item => 
      item.jahr >= min && 
      item.jahr <= max && 
      (art === '' || item.taxon.toUpperCase().includes(art.toUpperCase())) && 
      (FilterMst === '' || item.mst.toUpperCase().includes(FilterMst.toUpperCase()) ||
      item.gewaessername.toUpperCase().includes(FilterMst.toUpperCase()))
  );
}
arrayNeuFuellen(komp: number) {
  this.mstMakrophyten = [];
  for (let i = 0, l = this.dbBewertungMst.length; i < l; i += 1) {
    this.mstMakrophytenKl = {} as MstMakrophyten;
    // let wk: string = this.dbBewertungMst[i].namemst;
    
    this.mstMakrophytenKl.mst = this.dbBewertungMst[i].namemst;
    this.mstMakrophytenKl.gewaessername=this.dbBewertungMst[i].gewaessername;
    if (komp === 5) { this.mstMakrophytenKl.datum = this.dbBewertungMst[i].datumpn} 
   
    this.mstMakrophytenKl.jahr = this.dbBewertungMst[i].jahr;
    this.mstMakrophytenKl.roteListeD = this.dbBewertungMst[i].rld;
    this.mstMakrophytenKl.cf = this.dbBewertungMst[i].cf;
    this.mstMakrophytenKl.einheit = this.dbBewertungMst[i].einheit;
    this.mstMakrophytenKl.firma = this.dbBewertungMst[i].firma;
    this.mstMakrophytenKl.taxonzusatz = this.dbBewertungMst[i].taxonzusatz;
    this.mstMakrophytenKl.taxon = `${this.dbBewertungMst[i].taxon} (${this.dbBewertungMst[i].dvnr})`;
    

      this.mstMakrophytenKl.wert = this.dbBewertungMst[i].wert;
    
   
    this.mstMakrophytenKl.tiefe_m = this.dbBewertungMst[i].tiefe_m;
    this.mstMakrophytenKl.letzte_aenderung = this.dbBewertungMst[i].letzte_aenderung;
    this.mstMakrophytenKl.dvnr = this.dbBewertungMst[i].dvnr;
    this.mstMakrophyten.push(this.mstMakrophytenKl);

  }
  this.mstMakrophyten.sort((a, b) => b.jahr - a.jahr || a.mst.localeCompare(b.mst) || a.tiefe_m.localeCompare(b.tiefe_m) || a.taxon.localeCompare(b.taxon));

}
  /**
   * Assigns an array to a class property based on the provided component index.
   *
   * @param komp - The index of the component to determine which array to assign.
   * 
   * The method assigns the following arrays based on the value of `komp`:
   * - 0: Assigns `mstMakrophyten` to `Taxa_MP`.
   * - 1: Assigns `mstMakrophyten` to `Taxa_MP`.
   * - 2: Assigns `mstMakrophyten` to `Taxa_Dia`.
   * - 3: Assigns `mstMakrophyten` to `Taxa_MZB`.
   * - 5: Assigns `mstMakrophyten` to `Taxa_Phyto`.
   * 
   * If `komp` does not match any of the specified cases, no assignment is made.
   */
  arrayZuweisen(komp: number) {
    switch (komp) {
        case 0:
          this.Taxa_MP = this.mstMakrophyten;
          break;
        case 1:
          this.Taxa_MP = this.mstMakrophyten;
          break;
        case 2:
          this.Taxa_Dia = this.mstMakrophyten;
          break;
        case 3:
          this.Taxa_MZB = this.mstMakrophyten;
          break;
          case 5:
          this.Taxa_Phyto = this.mstMakrophyten;
          break;
        default:
          break;
    }
  }

}