import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WkUebersicht } from '../interfaces/wk-uebersicht';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnzeigeBewertungService {
  public dbBewertungWk: any;
  public dbBewertungWkaMst: any;
  public filtertxt:string;
  public dbStamWk: any;
  public InfoBox: string = "";
  public wkUebersicht: WkUebersicht[] = [];
  public wkUebersichtaMst: WkUebersicht[] = [];
  private apiUrl = environment.apiUrl;
  //public FilterwkUebersicht: WkUebersicht[] = [];
  public _uebersicht: WkUebersicht;
  // public _uebersichtaMst: WkUebersicht;
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
   
    
  }
async startBWUebersichtAusMst(){
  await this.callBwUebersichtAusMst();

  this.datenUmwandeln_mstausWK();
}
   getBwWKUebersicht() {
     return this.httpClient.get(`${this.apiUrl}/bwWasserkoerper`);
  }
  getBwWKUebersichtAusMst() {
    return this.httpClient.get(`${this.apiUrl}/bwWasserkoerper_aus_mst`);
 }
   getStamWasserkoerper() {
    return this.httpClient.get(`${this.apiUrl}/stamWasserkoerper`);
  }

  async callStamWK() {
		// this.workbookInit(datum,Probenehmer)
		await this.getStamWasserkoerper().forEach(formen2_ => {
      this.dbStamWk = formen2_;
			//console.log(  formen_);
		});
	}
 
  async callBwUebersicht() {

    await this.getBwWKUebersicht().forEach(formen2_ => {
      this.dbBewertungWk = formen2_;
     // console.log(formen_);
    });
  }
async callBwUebersichtAusMst() {
await this.getBwWKUebersichtAusMst().forEach(formen_ => {
  this.dbBewertungWkaMst = formen_;
 // console.log(formen_); 
});}

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

    }}}
    datenUmwandeln_mstausWK() {
      let _uebersichtaMst: WkUebersicht={} as WkUebersicht;
      this.wkUebersichtaMst=[];
       for (let i = 0, l = this.dbStamWk.length; i < l; i += 1) {
  
        let jahrstart:number;
        const dbBewertungWkTemp: any = this.dbBewertungWkaMst.filter(excelspalten => excelspalten.wk_id === this.dbStamWk[i].id);
        //console.log(dbBewertungWkTemp);
  
        if (dbBewertungWkTemp.length>0){
        let dbBewertungwk = dbBewertungWkTemp.sort(this.compare);
       // console.log(dbBewertungwk);
  
        jahrstart=dbBewertungwk[0].jahr;
        _uebersichtaMst = {} as WkUebersicht
  
        for (let a = 0, l = dbBewertungwk.length; a < l; a += 1) {
          if (jahrstart!==dbBewertungwk[a].jahr && a>0){
            this.wkUebersichtaMst.push(_uebersichtaMst);
            _uebersichtaMst = {} as WkUebersicht;
            jahrstart=dbBewertungwk[a].jahr;}
  
  
            _uebersichtaMst.Jahr = dbBewertungwk[a].jahr;
            _uebersichtaMst.idwk=dbBewertungwk[a].wk_id;
            _uebersichtaMst.WKname=dbBewertungwk[a].wk_name;
           
            // 1	ÖKZ_TK_MP
            // 2	ÖKZ_TK_Dia
            // 3	ÖKZ_QK_MZB
            // 4	ÖKZ_QK_F
            // 5	ÖKZ_QK_P
            // 6	ÖKZ
          switch (dbBewertungwk[a].id_para.toString()) {
            case "1": {
              
              _uebersichtaMst.OKZ_TK_MP = dbBewertungwk[a].wert ;
              break;
            }
            case "2": {
              _uebersichtaMst.OKZ_TK_Dia = dbBewertungwk[a].wert;
              break;
            }
            case "3": {
              _uebersichtaMst.OKZ_QK_MZB = dbBewertungwk[a].wert;
              break;
            }
            case "4": {
              _uebersichtaMst.OKZ_QK_F = dbBewertungwk[a].wert;
              break;
            }
            case "5": {
              _uebersichtaMst.OKZ_QK_P = dbBewertungwk[a].wert;
              break;
            }
            case "6": {
              _uebersichtaMst.OKZ = dbBewertungwk[a].wert;
              break;
            }
           }
  
          if (a+1 === l){this.wkUebersichtaMst.push(_uebersichtaMst);} //letzter Wert
        } 
  
      }}
      console.log(this.wkUebersichtaMst);}
  
  }