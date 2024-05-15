import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstUebersicht } from '../interfaces/mst-uebersicht';
import { AnzeigeBewertungService } from './anzeige-bewertung.service';
import { WkUebersicht } from '../interfaces/wk-uebersicht';
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
  public FilterwkUebersicht: WkUebersicht[] = [];
  constructor(private httpClient: HttpClient,anzeigeBewertungService:AnzeigeBewertungService) { }



  async call(filter:string,art:string,min:number,max:number,komp_id:number,repreasent:number) {

 
   await this.callBwUebersicht(komp_id);
  await this.filterMst(filter,art,min,max,repreasent);
   this.uniqueMstSortCall();
   this.uniqueJahrSortCall();
     this.datenUmwandeln();
    this.erzeugeDisplayedColumnNames();
     this.erzeugeDisplayColumnNames();
     console.log(this.mstUebersicht);
     console.log(this.displayColumnNames);
     console.log(this.displayedColumns);
  }

   getBwMSTUebersicht(komp_id:number) {



    // getArtenPhylibMP(parameter :number){ 

      let params = new HttpParams().set('id',komp_id);
      // console.log(params.toString())
      //const params: { id: 1 };
      // return this.httpClient.get('http://localhost:3000/impArten', {params});




     return this.httpClient.get('http://localhost:3000/bwMstUebersicht', {params});
  }
  erzeugeDisplayColumnNames(){
    this.displayColumnNames=[];
    this.displayColumnNames.push('Wasserköper');
    this.displayColumnNames.push('Messstelle');
    for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
      this.displayColumnNames.push(this.uniqueJahr[a])  

  }}

  async filterMst(filter:string,art:string,min:number,max:number,repreasent:number){
   
    let temp: any = this.dbMPUebersichtMst;

    this.dbMPUebersichtMst = [];

    await Promise.all(
      temp.map(async (f) => {
                
          if (!filter){
            if ((Number(f.jahr)>=min && Number(f.jahr)<=max)){
              if(repreasent===2){
                if(f.repraesent===true){
              this.dbMPUebersichtMst.push(f);}
          } else {this.dbMPUebersichtMst.push(f);}}}
         else {
          if (f.ms.includes(filter) && (Number(f.jahr)>=min && Number(f.jahr)<=max)){
         
            if(repreasent===2){
              if(f.repraesent===true){
            this.dbMPUebersichtMst.push(f);}
        } else {this.dbMPUebersichtMst.push(f);}}
          // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
      }})
  )
   console.log (this.dbMPUebersichtMst);
   
  }
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
  async callBwUebersicht(komp_id:number) {

    await this.getBwMSTUebersicht(komp_id).forEach(formen_ => {
      this.dbMPUebersichtMst = formen_;
     // console.log(formen_);
    });
  }
  // compareMst(a, b) {
  //   if (a.namemst < b.namemst) {
  //     return -1;
  //   }
  //   if (a.namemst > b.namemst) {
  //     return 1;
  //   }
  //   return 0;
  // }
  // compareJahr(a, b) {
  //   if (a.jahr > b.jahr) {
  //     return -1;
  //   }
  //   if (a.jahr < b.jahr) {
  //     return 1;
  //   }
  //   return 0;
  // }
  uniqueMstSortCall(){

    let array:string[]=[];
    for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {

      array.push(this.dbMPUebersichtMst[i].namemst)
     
           
    } 



    const temp =  [...new Set(array)] ;
    this.uniqueMst=temp.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

    uniqueJahrSortCall(){

      let array:string[]=[];
      for (let i = 0, l = this.dbMPUebersichtMst.length; i < l; i += 1) {
  
        array.push(this.dbMPUebersichtMst[i].jahr);
  
           
      }
      
      let temp =  [...new Set(array)] ;
      this.uniqueJahr =temp

      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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



      mstUebersichtFiltern(){
        for (let a = 0, l = this.mstUebersicht.length; a < l; a += 1) {

          
        let tempFilterwkUebersicht: any = this.FilterwkUebersicht.filter(excelspalten => excelspalten.WKname === this.mstUebersicht[a].wk);
         
      if (!tempFilterwkUebersicht){
      }}}
  
      datenUmwandeln(){
 
        this.mstUebersicht=[];

    for (let a = 0, l = this.uniqueMst.length; a < l; a += 1) {
      
      let dbBewertungMSTTemp0: any = this.dbMPUebersichtMst.filter(excelspalten => excelspalten.namemst === this.uniqueMst[a]);
      let dbBewertungMSTTemp: any =dbBewertungMSTTemp0.sort();

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
    }
  }
