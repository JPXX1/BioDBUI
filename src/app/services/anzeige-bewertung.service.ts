import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WkUebersicht } from '../interfaces/wk-uebersicht';

@Injectable({
  providedIn: 'root'
})
export class AnzeigeBewertungService {
  public dbBewertungWk: any;
  public dbStamWk: any;
  public InfoBox: string = "";
  public wkUebersicht: WkUebersicht[] = [];
  public _uebersicht: WkUebersicht;
  constructor(private httpClient: HttpClient) { }



  async ngOnInit() {

    await this.callStamWK();
   await this.callBwUebersicht();
     this.datenUmwandeln();
     console.log(this.wkUebersicht);
  }

   getBwWKUebersicht() {
     return this.httpClient.get('http://localhost:3000/bwWasserkoerper');
  }

   getStamWasserkoerper() {
    return this.httpClient.get('http://localhost:3000/stamWasserkoerper');
  }

  async callStamWK() {
		// this.workbookInit(datum,Probenehmer)
		await this.getStamWasserkoerper().forEach(formen_ => {
      this.dbStamWk = formen_;
			console.log(  formen_);
		});
	}
 
  async callBwUebersicht() {

    await this.getBwWKUebersicht().forEach(formen_ => {
      this.dbBewertungWk = formen_;
      console.log(formen_);
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




   datenUmwandeln() {

     for (let i = 0, l = this.dbStamWk.length; i < l; i += 1) {

      let jahrstart:number;
      let dbBewertungWkTemp: any = this.dbBewertungWk.filter(excelspalten => excelspalten.wk_id === this.dbStamWk[i].id);
      console.log(dbBewertungWkTemp);

      if (dbBewertungWkTemp.length>0){
      let dbBewertungwk = dbBewertungWkTemp.sort(this.compare);
      console.log(dbBewertungwk);

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