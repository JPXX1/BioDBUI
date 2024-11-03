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
 
  await this.getBwMstTaxa(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;
   
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
 
displayedColumnsMP(komp: number) {
if (komp === 5) {
  this.displayedColumns= ['mst', 'gewaessername','datum', 'taxon', 'wert', 'einheit', 'taxonzusatz',  'letzteAenderung'];
}else {


this.displayedColumns= ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];
}}
filterTaxadaten(arr :MstMakrophyten[],FilterMst: string, art: string, min: number, max: number): MstMakrophyten[] {
  return arr.filter(item => 
      item.jahr >= min && 
      item.jahr <= max && 
      item.taxon.toUpperCase().includes(art.toUpperCase()) && 
      (item.mst.toUpperCase().includes(FilterMst.toUpperCase()) ||
      item.gewaessername.toUpperCase().includes(FilterMst.toUpperCase()
  )));
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
  this.mstMakrophyten.sort((a, b) => b.jahr - a.jahr || a.mst.localeCompare(b.mst) || a.tiefe_m.localeCompare(b.tiefe_m) || a.taxon.localeCompare(b.taxon));}
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