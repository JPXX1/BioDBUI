import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstUebersicht } from '../interfaces/mst-uebersicht';
import { AnzeigeBewertungService } from './anzeige-bewertung.service';

@Injectable({
  providedIn: 'root'
})
export class AnzeigenMstUebersichtService {
  public mstUebersicht: MstUebersicht[] = [];
  public mstUebersichtKl: MstUebersicht;
  public dbMPUebersichtMst: any;
  public uniqueJahr:string[]=[];
  public uniqueMst:string[]=[];

  constructor(private httpClient: HttpClient,anzeigeBewertungService:AnzeigeBewertungService) { }



  async call() {

 
   await this.callBwUebersicht();
   this.uniqueMstSortCall();
   this.uniqueJahrSortCall();
     this.datenUmwandeln();
     console.log(this.mstUebersicht);
  }

   getBwMSTUebersicht() {
     return this.httpClient.get('http://localhost:3000/bwMstUebersicht');
  }


  async callBwUebersicht() {

    await this.getBwMSTUebersicht().forEach(formen_ => {
      this.dbMPUebersichtMst = formen_;
     // console.log(formen_);
    });
  }
  compareMst(a, b) {
    if (a.namemst < b.namemst) {
      return -1;
    }
    if (a.namemst > b.namemst) {
      return 1;
    }
    return 0;
  }
  compareJahr(a, b) {
    if (a.jahr < b.jahr) {
      return -1;
    }
    if (a.jahr > b.jahr) {
      return 1;
    }
    return 0;
  }
  uniqueMstSortCall(){

    let array:string[]=[];
    for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {

      array.push(this.dbMPUebersichtMst[i].namemst)
     
           
    } 
    let temp =  [...new Set(array)] ;
    this.uniqueMst=temp.sort(this.compareJahr);
  }

    uniqueJahrSortCall(){

      let array:string[]=[];
      for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {
  
        array.push(this.dbMPUebersichtMst[i].Jahr);
  
           
      }
      
      let temp =  [...new Set(array)] ;
      this.uniqueJahr =temp.sort(this.compareJahr);
    }

      anwelcherStelleStehtdasJahr(temp:string):number{
        let r:number=null;
        for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
          if(this.uniqueJahr[a]===temp){


            r= a;
          }
        }
      return r;
      }
  datenUmwandeln(){
 
   

    for (let a = 0, l = this.uniqueMst.length; a < l; a += 1) {

      let dbBewertungMSTTemp0: any = this.dbMPUebersichtMst.filter(excelspalten => excelspalten.wk_id === this.uniqueMst[a]);
      let dbBewertungMSTTemp: any =dbBewertungMSTTemp0.sort(this.compareJahr);

      this.mstUebersichtKl = {} as MstUebersicht;
      if (dbBewertungMSTTemp.length>0){


        for (let i = 0, l = dbBewertungMSTTemp.length; i < l; i += 1) {
          this.mstUebersichtKl.mst=dbBewertungMSTTemp[i].namemst;
          this.mstUebersichtKl.wk=dbBewertungMSTTemp[i].wk_name;
        switch (this.anwelcherStelleStehtdasJahr(dbBewertungMSTTemp[i].jahr)){

          case 0: {
            this.mstUebersichtKl.sp1 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 1: {
            this.mstUebersichtKl.sp2 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 2: {
            this.mstUebersichtKl.sp3 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 3: {
            this.mstUebersichtKl.sp4 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 4: {
            this.mstUebersichtKl.sp5 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 5: {
            this.mstUebersichtKl.sp6 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 6: {
            this.mstUebersichtKl.sp7 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 7: {
            this.mstUebersichtKl.sp8 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 8: {
            this.mstUebersichtKl.sp9 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 9: {
            this.mstUebersichtKl.sp10 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 10: {
            this.mstUebersichtKl.sp11 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 11: {
            this.mstUebersichtKl.sp12 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 12: {
            this.mstUebersichtKl.sp13 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 13: {
            this.mstUebersichtKl.sp14 = dbBewertungMSTTemp[i].wert;
            break;
          }
          case 14: {
            this.mstUebersichtKl.sp15 = dbBewertungMSTTemp[i].wert;
            break;
          }
          
        }

        if (i+1 === l){this.mstUebersicht.push(this.mstUebersichtKl);} //letzter Wert }}}}

    
  }
}
    }
  }}
