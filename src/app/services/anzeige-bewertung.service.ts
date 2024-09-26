import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WkUebersicht } from '../interfaces/wk-uebersicht';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnzeigeBewertungService {
  public dbBewertungWk: any;
  public filtertxt:string;
  public dbStamWk: any;
  public InfoBox: string = "";
  public wkUebersicht: WkUebersicht[] = [];
  private apiUrl = environment.apiUrl;
  //public FilterwkUebersicht: WkUebersicht[] = [];
  public _uebersicht: WkUebersicht;
  constructor(private httpClient: HttpClient) { }

  public value:string = '';
   public valueJahr:string = '';
   public Artvalue:string = '';
  min:number=2016;
  max:number=2026; 

  async ngOnInit() {

    await this.callStamWK();
   await this.callBwUebersicht();
     this.datenUmwandeln();
     //this.filterdaten();
     //console.log(this.wkUebersicht);
  }

   getBwWKUebersicht() {
     return this.httpClient.get(`${this.apiUrl}/bwWasserkoerper`);
  }

   getStamWasserkoerper() {
    return this.httpClient.get(`${this.apiUrl}/stamWasserkoerper`);
  }

  async callStamWK() {
		// this.workbookInit(datum,Probenehmer)
		await this.getStamWasserkoerper().forEach(formen_ => {
      this.dbStamWk = formen_;
			//console.log(  formen_);
		});
	}
 
  async callBwUebersicht() {

    await this.getBwWKUebersicht().forEach(formen_ => {
      this.dbBewertungWk = formen_;
     // console.log(formen_);
    });
  }

  compare(a, b) {
    if (a.jahr < b.jahr) {
      return -1;
    }
    if (a.jahr > b.jahr) {
      return 1;
    }
    return 0;
  }


// async filterdaten(){
//   this.FilterwkUebersicht=[];
// if (!this.filtertxt){
//   this.FilterwkUebersicht = this.wkUebersicht;
// }else {
//   await Promise.all(
//     this.wkUebersicht.map(async (f) => {
//         // const count = await getCountTask(f.id); 
//         // if (count <= 3) return; //don't want this one.       
//         let obj = {} as WkUebersicht;
//         if (f.WKname===this.filtertxt)
//         //this.FilterwkUebersicht.push(f);
        
//         obj.WKname = f.WKname;
//         obj.Jahr = f.Jahr;
//         // obj.status = 'Great';
//         this.FilterwkUebersicht.push(f);
//     })
// )




// }
// }



   datenUmwandeln() {
    this.wkUebersicht=[];
     for (let i = 0, l = this.dbStamWk.length; i < l; i += 1) {

      let jahrstart:number;
      let dbBewertungWkTemp: any = this.dbBewertungWk.filter(excelspalten => excelspalten.wk_id === this.dbStamWk[i].id);
      //console.log(dbBewertungWkTemp);

      if (dbBewertungWkTemp.length>0){
      let dbBewertungwk = dbBewertungWkTemp.sort(this.compare);
     // console.log(dbBewertungwk);

      jahrstart=dbBewertungwk[0].jahr;
      this._uebersicht = {} as WkUebersicht

      for (let a = 0, l = dbBewertungwk.length; a < l; a += 1) {
        if (jahrstart!==dbBewertungwk[a].jahr && a>0){
          this.wkUebersicht.push(this._uebersicht);
          this._uebersicht = {} as WkUebersicht;
          jahrstart=dbBewertungwk[a].jahr;}


          this._uebersicht.Jahr = dbBewertungwk[a].jahr;
          this._uebersicht.idwk=dbBewertungwk[a].wk_id;
          this._uebersicht.WKname=dbBewertungwk[a].wk_name;
         
          // 1	ÖKZ_TK_MP
          // 2	ÖKZ_TK_Dia
          // 3	ÖKZ_QK_MZB
          // 4	ÖKZ_QK_F
          // 5	ÖKZ_QK_P
          // 6	ÖKZ
        switch (dbBewertungwk[a].id_para) {
          case "1": {
            
            this._uebersicht.OKZ_TK_MP = dbBewertungwk[a].wert ;
            break;
          }
          case "2": {
            this._uebersicht.OKZ_TK_Dia = dbBewertungwk[a].wert;
            break;
          }
          case "3": {
            this._uebersicht.OKZ_QK_MZB = dbBewertungwk[a].wert;
            break;
          }
          case "4": {
            this._uebersicht.OKZ_QK_F = dbBewertungwk[a].wert;
            break;
          }
          case "5": {
            this._uebersicht.OKZ_QK_P = dbBewertungwk[a].wert;
            break;
          }
          case "6": {
            this._uebersicht.OKZ = dbBewertungwk[a].wert;
            break;
          }
         }

        if (a+1 === l){this.wkUebersicht.push(this._uebersicht);} //letzter Wert
      } 

    }}}}