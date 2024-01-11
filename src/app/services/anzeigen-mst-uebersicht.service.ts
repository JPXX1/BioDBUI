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
  public displayColumnNames:string[]=[];
  public displayedColumns:string[]=[];
  constructor(private httpClient: HttpClient,anzeigeBewertungService:AnzeigeBewertungService) { }



  async call() {

 
   await this.callBwUebersicht();
   this.uniqueMstSortCall();
   this.uniqueJahrSortCall();
     this.datenUmwandeln();
    this.erzeugeDisplayedColumnNames();
     this.erzeugeDisplayColumnNames();
     console.log(this.mstUebersicht);
     console.log(this.displayColumnNames);
     console.log(this.displayedColumns);
  }

   getBwMSTUebersicht() {
     return this.httpClient.get('http://localhost:3000/bwMstUebersicht');
  }
  erzeugeDisplayColumnNames(){
    this.displayColumnNames=[];
    this.displayColumnNames.push('Wasserköper');
    this.displayColumnNames.push('Messstelle');
    for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
      this.displayColumnNames.push(this.uniqueJahr[a])  

  }}
  erzeugeDisplayedColumnNames(){
  this.displayedColumns=[];
  this.displayedColumns.push('wk');
  this.displayedColumns.push('mst');


  switch (this.uniqueJahr.length){

    case 1: {
      this.displayedColumns.push('sp1');
      break;
    }
    case 2: {
      this.displayedColumns.push('sp1','sp2');
      break;
    }
    case 3: {
      this.displayedColumns.push('sp1','sp2','sp3');
      break;
    }
    case 4: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4');
      break;
    }
    case 5: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5');
      break;
    }
    case 6: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6');
      break;
    }
    case 7: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7');
      break;
    }
    case 8: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8');
      break;
    }
    case 9: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9');
      break;
    }
    case 10: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10');
      break;
    }
    case 11: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11');
      break;
    }
    case 12: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12');
      break;
    }
    case 13: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13');
      break;
    }
    case 14: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','sp14');
      break;
    }
    case 15: {
      this.displayedColumns.push('sp1','sp2','sp3','sp4','sp5','sp6','sp7','sp8','sp9','sp10','sp11','sp12','sp13','sp14','sp15');
      break;
    }
    
  
}
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
    if (a.jahr > b.jahr) {
      return -1;
    }
    if (a.jahr < b.jahr) {
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
  
        array.push(this.dbMPUebersichtMst[i].jahr);
  
           
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

      let dbBewertungMSTTemp0: any = this.dbMPUebersichtMst.filter(excelspalten => excelspalten.namemst === this.uniqueMst[a]);
      let dbBewertungMSTTemp: any =dbBewertungMSTTemp0.sort(this.compareJahr);

      this.mstUebersichtKl = {} as MstUebersicht;
      if (dbBewertungMSTTemp.length>0){
        
        this.mstUebersichtKl.wk=dbBewertungMSTTemp[0].wk_name;
        this.mstUebersichtKl.mst=dbBewertungMSTTemp[0].namemst;

        for (let i = 0, l = dbBewertungMSTTemp.length; i < l; i += 1) {
         
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
