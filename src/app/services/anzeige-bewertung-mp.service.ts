import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstMakrophyten } from '../interfaces/mst-makrophyten';
import { WkUebersicht } from '../interfaces/wk-uebersicht';

@Injectable({
  providedIn: 'root'
})
export class AnzeigeBewertungMPService {
  public mstMakrophyten: MstMakrophyten[] = [];
  public mstMakrophytenKl: MstMakrophyten;
  public dbBewertungMst: any;



  constructor(private httpClient: HttpClient) { }


  getBwMstMP() {
    return this.httpClient.get('http://localhost:3000/bwMstAbundanzen');
 }
 async callBwMstMP() {

  await this.getBwMstMP().forEach(formen_ => {
    this.dbBewertungMst = formen_;
   
  });
}
datenUmwandeln(){
  this.mstMakrophyten=[];

  
  for (let i = 0, l = this.dbBewertungMst.length; i < l; i += 1) {

    this.mstMakrophytenKl= {} as MstMakrophyten;
    this.mstMakrophytenKl.mst=this.dbBewertungMst[i].namemst;
    this.mstMakrophytenKl.jahr=this.dbBewertungMst[i].jahr;
    this.mstMakrophytenKl.cf=this.dbBewertungMst[i].cf;
    this.mstMakrophytenKl.einheit=this.dbBewertungMst[i].einheit;
   this.mstMakrophytenKl.firma=this.dbBewertungMst[i].firma;
   this.mstMakrophytenKl.taxonzusatz=this.dbBewertungMst[i].taxonzusatz;
   this.mstMakrophytenKl.taxon=this.dbBewertungMst[i].taxon;
   this.mstMakrophytenKl.wert=this.dbBewertungMst[i].wert;
   this.mstMakrophytenKl.tiefe_m=this.dbBewertungMst[i].tiefe_m

    this.mstMakrophyten.push(this.mstMakrophytenKl);
      
}

}

}
