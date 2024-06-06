import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstMakrophyten } from '../interfaces/mst-makrophyten';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnzeigeBewertungMPService {
  public mstMakrophyten: MstMakrophyten[] = [];
  public mstMakrophytenKl: MstMakrophyten;
  public dbBewertungMst: any;
  private apiUrl = environment.apiUrl;


  constructor(private httpClient: HttpClient) { }

  
  getBwMstMP(komp:number) {
    let params = new HttpParams().set('id',komp);
    
    return this.httpClient.get(`${this.apiUrl}/bwMstAbundanzen`, {params});
 }
 async callBwMstMP(komp:number) {
 
  await this.getBwMstMP(komp).forEach(formen_ => {
    this.dbBewertungMst = formen_;
   
  });
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
datenUmwandeln(FilterMst:string,art:string,min:number,max:number){
  this.mstMakrophyten=[];
  
  
  for (let i = 0, l = this.dbBewertungMst.length; i < l; i += 1) {

    this.mstMakrophytenKl= {} as MstMakrophyten;
   let wk:string=this.dbBewertungMst[i].namemst;
    this.mstMakrophytenKl.mst=this.dbBewertungMst[i].namemst;
    this.mstMakrophytenKl.jahr=this.dbBewertungMst[i].jahr;
    this.mstMakrophytenKl.roteListeD=this.dbBewertungMst[i].rld;
    this.mstMakrophytenKl.cf=this.dbBewertungMst[i].cf;
    this.mstMakrophytenKl.einheit=this.dbBewertungMst[i].einheit;
   this.mstMakrophytenKl.firma=this.dbBewertungMst[i].firma;
   this.mstMakrophytenKl.taxonzusatz=this.dbBewertungMst[i].taxonzusatz;
   this.mstMakrophytenKl.taxon=this.dbBewertungMst[i].taxon + " ("+this.dbBewertungMst[i].dvnr+")";
   this.mstMakrophytenKl.wert=this.dbBewertungMst[i].wert;
   this.mstMakrophytenKl.tiefe_m=this.dbBewertungMst[i].tiefe_m;
   this.mstMakrophytenKl.letzte_aenderung=this.dbBewertungMst[i].letzte_aenderung;
   this.mstMakrophytenKl.dvnr=this.dbBewertungMst[i].dvnr;
//Filtern MSt
if (!FilterMst && !art )

   {if ((Number(this.mstMakrophytenKl.jahr)>=min && Number(this.mstMakrophytenKl.jahr)<=max)){ 
    this.mstMakrophyten.push(this.mstMakrophytenKl);}}
    
    
    
    else if (!art) {
    if ( wk.includes(FilterMst) && (Number(this.mstMakrophytenKl.jahr)>=min && Number(this.mstMakrophytenKl.jahr)<=max)){
      this.mstMakrophyten.push(this.mstMakrophytenKl);}}
    else if (!FilterMst){

      if ( this.mstMakrophytenKl.taxon.includes(art) && (Number(this.mstMakrophytenKl.jahr)>=min && Number(this.mstMakrophytenKl.jahr)<=max)){
        this.mstMakrophyten.push(this.mstMakrophytenKl);}

    }else{

      if ( wk.includes(FilterMst) &&this.mstMakrophytenKl.taxon.includes(art) && (Number(this.mstMakrophytenKl.jahr)>=min && Number(this.mstMakrophytenKl.jahr)<=max)){
        this.mstMakrophyten.push(this.mstMakrophytenKl);}
    }
      
}
this.mstMakrophyten.sort((a, b) => b.jahr - a.jahr || a.mst.localeCompare(b.mst) ||  a.tiefe_m.localeCompare(b.tiefe_m) ||  a.taxon.localeCompare(b.taxon));
}


}