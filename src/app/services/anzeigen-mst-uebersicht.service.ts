import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MstUebersicht } from '../interfaces/mst-uebersicht';
import { AnzeigeBewertungService } from './anzeige-bewertung.service';
import { WkUebersicht } from '../interfaces/wk-uebersicht';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

//Artdaten
export class AnzeigenMstUebersichtService {
  public mstUebersicht: MstUebersicht[] = [];
  public mstUebersichtKl: MstUebersicht;
  public dbMPUebersichtMst: any;
  public uniqueJahr:string[]=[];
  public uniqueMst:string[]=[];
  public displayColumnNames:string[]=[];
  public displayedColumns:string[]=[];
  public FilterwkUebersicht: WkUebersicht[] = [];
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient,anzeigeBewertungService:AnzeigeBewertungService) { }
public Artvalue:string;
public value:string;

  async call(filter:string,art:string,min:number,max:number,komp_id:number) {

 
  await this.callBwUebersichtExp(komp_id);
  await this.filterMst(filter,art,min,max);
   this.uniqueMstSortCall();
   this.uniqueJahrSortCall();
     this.datenUmwandeln();
    this.erzeugeDisplayedColumnNames(false);
     this.erzeugeDisplayColumnNames(false);
    
  }
 
  erzeugeDisplayColumnNames(komponente:boolean){
    this.displayColumnNames=[];
    this.displayColumnNames.push('Wasserköper');
    this.displayColumnNames.push('Messstelle');
    if (komponente===true){ this.displayColumnNames.push('Komponente');}
    for (let a = 0, l = this.uniqueJahr.length; a < l; a += 1) {
      this.displayColumnNames.push(this.uniqueJahr[a])  

  }}

  async filterMst(filter:string,art:string,min:number,max:number){
   
    let temp: any = this.dbMPUebersichtMst;

    this.dbMPUebersichtMst = [];

    await Promise.all(
      temp.map(async (f) => {
                
          if (!filter){
            if ((Number(f.jahr)>=min && Number(f.jahr)<=max)){
              {this.dbMPUebersichtMst.push(f);}}}
         else {
          if (f.namemst.includes(filter) && (Number(f.jahr)>=min && Number(f.jahr)<=max)){
         
             {this.dbMPUebersichtMst.push(f);}}
          // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
      }})
  )
   console.log (this.dbMPUebersichtMst);
   
  }
  erzeugeDisplayedColumnNames(komponente:boolean){
  this.displayedColumns=[];
  this.displayedColumns.push('wk');
  this.displayedColumns.push('mst');
if (komponente===true){ this.displayedColumns.push('komponente');}

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
  async getBwWKUebersicht(selectedItems: number): Promise<any[]> {
    const response = await this.httpClient.post(`${this.apiUrl}/bwWKUebersicht`, selectedItems).toPromise();
    
    // Hier sicherstellen, dass die API ein Array zurückgibt
    if (!Array.isArray(response)) {
      throw new Error('Die Antwort ist kein Array');
    }
    
    return response;
  }

 
  async getBwMSTUebersicht(selectedItems: number[]): Promise<any[]> {
    const response = await this.httpClient.post(`${this.apiUrl}/bwMstUebersicht`, { selectedItems }).toPromise();
    
    // Hier sicherstellen, dass die API ein Array zurückgibt
    if (!Array.isArray(response)) {
      throw new Error('Die Antwort ist kein Array');
    }
    
    return response;
  }

  

  async callBwUebersicht(komp_id: number) {
    let selectedItems: number[] = [];
    selectedItems.push(komp_id);
  
    try {
      const formen_ = await this.getBwMSTUebersicht(selectedItems);
  
      // Falls kein Array, konvertiere es zu einem Array
      const dataArray = Array.isArray(formen_) ? formen_ : [formen_];
  
      // Mapping der Daten
      this.dbMPUebersichtMst = dataArray.map(form => ({
        wkName: form.wk_name,
        id: form.id,
        parameter: form.parameter,
        idMst: form.id_mst,
        namemst: form.namemst,
        repraesent: form.repraesent,
        idKomp: form.id_komp,
        komponente: form.komponente,
        idImport: form.id_import,
        jahr: form.jahr,
        letzteAenderung: form.letzte_aenderung,
        idEinh: form.id_einh,
        firma: form.firma,
        wert: form.wert,
        expertenurteil: form.expertenurteil,
        begruendung: form.begruendung,
        expertenurteilChanged: new Date(form.expertenurteil_changed),
        idNu: form.id_nu,
        ausblenden:form.ausblenden
      }));
  
     // console.log('Verarbeitete Daten: ', this.dbMPUebersichtMst);
    } catch (error) {
      console.error('Fehler beim Abrufen der Übersicht:', error);
    }
  }
  
  //Bewertung ersetzt um Expertenurteil
  async callBwUebersichtExp(komp_id: number) {
    let selectedItems: number[] = [];
    selectedItems.push(komp_id);
  
    try {
      const formen_ = await this.getBwMSTUebersicht(selectedItems);
  
      // Falls kein Array, konvertiere es zu einem Array
      const dataArray = Array.isArray(formen_) ? formen_ : [formen_];
  
      // Mapping der Daten
      this.dbMPUebersichtMst = dataArray 
      .filter(form => !form.ausblenden) // Filtere Datensätze aus, bei denen 'ausblenden' true ist

      .map(form => ({
        wkName: form.wk_name,
        id: form.id,
        parameter: form.parameter,
        idMst: form.id_mst,
        namemst: form.namemst,
        repraesent: form.repraesent,
        idKomp: form.id_komp,
        komponente: form.komponente,
        idImport: form.id_import,
        jahr: form.jahr,
        letzteAenderung: form.letzte_aenderung,
        idEinh: form.id_einh,
        firma: form.firma,
        // Setze wert auf form.expertenurteil, wenn vorhanden, sonst form.wert
        wert: ['1', '2', '3', '4', '5'].includes(form.expertenurteil) ?  `${form.expertenurteil} *` : form.wert,
        expertenurteil: form.expertenurteil,
        begruendung: form.begruendung,
        expertenurteilChanged: new Date(form.expertenurteil_changed),
        idNu: form.id_nu
      }));
  
      // console.log('Verarbeitete Daten: ', this.dbMPUebersichtMst);
    } catch (error) {
      console.error('Fehler beim Abrufen der Übersicht:', error);
    }
  }
  
  
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
        
        this.mstUebersichtKl.wk=dbBewertungMSTTemp[0].wkName;
        this.mstUebersichtKl.mst=dbBewertungMSTTemp[0].namemst;
        this.mstUebersichtKl.komponente=dbBewertungMSTTemp[0].komponente;
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
