import { Injectable } from '@angular/core';
import { Messwerte } from '../interfaces/messwerte';
import { HttpClient,HttpParams } from '@angular/common/http';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import * as XLSX from 'xlsx';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';
@Injectable({
  providedIn: 'root'
})
export class PerlodesimportService {
  public InfoBox: string = "";
  public arten: any;
  public messwerte:Messwerte[];
  
  public MessData: Messwerte[] = []; public MessDataOrgi: Messwerte[] = []; //public MessDataGr: Messgroup[] = []; 
	public MessDataImp: Messwerte[] = []; public messstellenImp: MessstellenImp[] = [];
	public uebersicht:Uebersicht[]=[];
  public _uebersicht:Uebersicht;
  public mst: any;

  constructor(private httpClient: HttpClient,private xlsxImportPhylibService:XlsxImportPhylibService) { }

  getArtenMZB(){ 
        
    return this.httpClient.get('http://localhost:3000/impArtenMZB');
    }


async startimport(workbook){

await  this.xlsxImportPhylibService.holeMst();
this.callartenMZB();
await this.Perlodesimport(workbook)
//this.xlsxImportPhylibService.mst;
}



    callartenMZB() {
		
      this.getArtenMZB().subscribe(arten_ => {
        this.arten = arten_;
        //console.log(this.arten);
        //return einheiten;
      }, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
    }
  
  
  
    async Perlodesimport(workbook) {
      let array: Messwerte[] = []; this.uebersicht = []; this.MessDataOrgi = [];
      //let reader = new FileReader();
    
      var sheets;
      var Messstelle: string; var Probe: string; var Taxon; var Form: string; var Messwert; var Einheit; var Tiefe; var cf;let RLD;
      let aMessstelle: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
      // var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
      let bidmst; let bidpara; let bideinh; let bwert;
      let mstOK: boolean; let ok: boolean;
      let XL_row_object;
      let json_Messstelle;
      this._uebersicht= {} as Uebersicht;
      let mst: string;
  
      //welche Spalte in der Übersicht
      // const valspaltenfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === tabMST);
      // const valtabfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.id_tab === tabMST);
  
      
      // const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
      // const valspaltenfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1);
  
        
  
  
  
        //console.log(workbook.SheetNames[i]);
        XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        json_Messstelle = JSON.stringify(XL_row_object);
        const obj = JSON.parse(json_Messstelle);
       
        
  
          console.log(this.uebersicht);
          // Here is your object
          let o: number = 1;
          obj.forEach((val, index) => {
            if (obj[index] !== null) {
              for (var i in obj[index]) {
                //console.log(val + " / " + obj[index][i] + ": " + i);
  
                o = o + 1;
                //Messstellen
                if (index===0){
                  if (i!=='ID_ART'){




                    mst = i;
                  aMessstelle=mst;
                  //taxonzus=new Taxonzus();
                  let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == mst);
  
                  //console.log(mst);
  
                  if (
                    mstee.length !== 0) {
                      mstOK = true;
                    mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
                  }
                  else {
                    aMessstelle = mst;
                    mstOK = false
                  }
  
                  //Messstelle = obj[index][i];
                }


                    this.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                    this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=true;this._uebersicht.fehler3=true;
                    this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                    this.xlsxImportPhylibService.groupNAch();
                  }

               
                //Typen
                if (index===1){
                  Taxon = obj[index][i];
                  if (i!=='Typ'){



                  }

                }
                // if (i == 'Messstelle') {
  
                //   if (index > 0) { //console.log("Insert into dat_einzeldaten (id_taxon, id_einheit, id_probe, id_mst, id_taxonzus, id_pn, datumpn, id_messprogr, id_abundanz,cf,wert) values (" + Taxon + "," + Einheit + "," + Probe + "," + Messstelle + "," + Form + "," + Einheit + "," + cf + ",'" + Messwert + "');"); 
                //     array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
                //     this.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                //     // this.groupNAch(aMessstelle,  "1", "1", "1", "1", "1", "1", "1", "1", "1", "1","1",mstOK, true, false);
                //     this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2=ok;this._uebersicht.fehler3=true;
                //     Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = true; mstOK = true;RLD=null;
                //     aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
                //    // this.groupNAch();
                //   }
  
                //   mst = obj[index][i];
                //   //aMessstelle=mst;
                //   //taxonzus=new Taxonzus();
                //   let mstee = this.mst.filter(messstellen => messstellen.namemst == mst);
  
                //   //console.log(mst);
  
                //   if (
                //     mstee.length !== 0) {
                //       mstOK = true;
                //     mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
                //   }
                //   else {
                //     aMessstelle = mst;
                //     mstOK = false
                //   }
  
                //   //Messstelle = obj[index][i];
                // }
                if (i == 'Probe') {
                  aProbe = obj[index][i];
                  Probe = '11';
                }
                if (i == 'Taxon') {
                  //ok=false;
                  Taxon = obj[index][i];
                  let taxon_ = this.arten.filter(arten => arten.taxon == Taxon);
                  if (taxon_.length !== 0) { Taxon = taxon_[0].id_taxon; aTaxon = taxon_[0].taxon; RLD=taxon_[0].rld } else {
                    ok = false;
                    var taxon2 = this.arten.filter(arten => arten.dvnr == Taxon);
                    if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon; ok=false;}
  
  
                  }
                }
                
                
                
              }
            }
          })
  
          //of(array);
        
          this.uebersicht=this.xlsxImportPhylibService.uebersicht;
      // this.MessDataImp = array;
      
        }}
  
  
