import { Injectable } from '@angular/core';
import { Messwerte } from '../interfaces/messwerte';
import { HttpClient,HttpParams } from '@angular/common/http';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import * as XLSX from 'xlsx';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PerlodesimportService {
  public InfoBox: string = "";
  public arten: any;
  public messwerte:Messwerte[];

  private apiUrl = environment.apiUrl;

  public MessData: Messwerte[] = []; public MessDataOrgi: Messwerte[] = []; //public MessDataGr: Messgroup[] = []; 
	public MessDataImp: Messwerte[] = []; public messstellenImp: MessstellenImp[] = [];
	public uebersicht:Uebersicht[]=[];
  public _uebersicht:Uebersicht;
  public mst: any;

  constructor(private httpClient: HttpClient,private xlsxImportPhylibService:XlsxImportPhylibService) { }

  getArtenMZB(){ 
        
    return this.httpClient.get(`${this.apiUrl}/impArtenMZB`);
    }




    async Perlodesexport(workbook, valspalten: any, tab: any,verfahrennr : number){
      await this.xlsxImportPhylibService.holeMst();
      this.xlsxImportPhylibService.displayColumnNames=[];
      this.xlsxImportPhylibService.dynamicColumns=[];
      this.xlsxImportPhylibService.displayColumnNames.push('Nr');
      this.xlsxImportPhylibService.dynamicColumns.push('nr');
      let aMessstelle: string;
      let mst: string;let importp:string;let typ;
      this.uebersicht=[];
      var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
      this.messstellenImp = [];let mstarray=[];
      tab = tab - 1;
      let XL_row_object;
      let json_Messstelle; var Messstelle: string; let mstOK: string;
      let bidmst; let bidpara; let bideinh; let bwert;

        const valrowsfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 4 && excelspalten.id_tab === tab);
    
      
      const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
     
   
      XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tab]]);
      json_Messstelle = JSON.stringify(XL_row_object);
      const obj = JSON.parse(json_Messstelle);
     
        obj.forEach((val, index) => {
          if (obj[index] !== null) {
            for (var i in obj[index]) {


              if (index===0){
                if (i!=='Probe'){

 

      // mstarray.push(i);

                  mst = i;
                aMessstelle=mst;
                //taxonzus=new Taxonzus();
                let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == mst);

                //console.log(mst);

                if (
                  mstee.length !== 0) {
                    mstOK = "";
                  mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
                }
                else {
                  aMessstelle = mst;
                  mstOK = "checked";
                }
               
                  // typ = obj[index+0][i];
               //   taxaliste=obj[index+1][i];
             //    nutzung=obj[index+2][i];

                //}
              }
              this._uebersicht= {} as Uebersicht;
             if ( mst!== undefined){
              if (mstOK==="checked") {importp="";}else{
                importp="checked";}
                  //this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                  this._uebersicht.mst=aMessstelle;
                  //this._uebersicht.sp3=typ;this._uebersicht.sp4=taxaliste;
                  // this._uebersicht.sp5=nutzung;s
                  this._uebersicht.fehler1=mstOK;
                  this._uebersicht.fehler2="";this._uebersicht.fehler3="";
                  this._uebersicht.import1=importp;
        
                  this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                  this.xlsxImportPhylibService.groupNAch();
                }

              }else
              if (index>3){
                const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === obj[index]['Probe']);
                
                if (valspaltenfiter2.length === 1) {
                  //mstarray =Messstellen
                  // for (let m = 0, l = mstarray.length; m < l; m += 1) {
                    let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == i);
                    if (mstee.length !== 0) {
                        mstOK = "checked";
                        bidmst = mstee[0].id_mst; 
                    
                  
                    bwert= obj[index][i];
                    // bwert = obj[index][i];
      
                    bidpara = valspaltenfiter2[0].id_para;
      
                    bideinh = valspaltenfiter2[0].id_einheit;
                    
                    this.xlsxImportPhylibService.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
                    this._uebersicht.mst=i;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
                    this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null ,uebersicht:this._uebersicht});
                   
                    this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                    this.xlsxImportPhylibService.groupNAch();
                 
                  



                   }
                }}




            }}})
    }


async startimport(workbook){
  this.arten=[];
await  this.xlsxImportPhylibService.holeMst();
await this.callartenMZB();
await this.Perlodesimport(workbook)
//this.xlsxImportPhylibService.mst;
}



    // callartenMZB() {
		
    //   this.getArtenMZB().subscribe(arten_ => {
    //     this.arten = arten_;
    //     //console.log(this.arten);
    //     //return einheiten;
    //   }, (err) => { this.InfoBox = this.InfoBox + " " + err.message });
    // }
  
  	async callartenMZB() {
      // this.workbookInit(datum,Probenehmer)
      await this.getArtenMZB().forEach(value => {
        this.arten = value;
        console.log('observable -> ' + value);
      });
    }
  
    async Perlodesimport(workbook) {
      let array: Messwerte[] = []; this.uebersicht = []; this.xlsxImportPhylibService.MessDataOrgi = [];
      //let reader = new FileReader();
    
      // var sheets;
      var Messstelle: string; var Probe; var Taxon; var Form; var Messwert; var Einheit; var Tiefe; var cf;let RLD;
      let aMessstelle: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
      // var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
      let bidmst; let bidpara; let bideinh; let bwert;
      let importp:string;let mstOK: string; let ok: string; let typ:string;let nutzung:string;let taxaliste:string;
      let XL_row_object;
      let json_Messstelle;
     
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
                console.log(obj.length)
                o = o + 1;
                //Messstellen
                if (index===0){
                  if (i!=='ID_ART' && i!=='Taxon_name'){




                    mst = i;
                  aMessstelle=mst;
                  //taxonzus=new Taxonzus();
                  let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == mst);
  
                  //console.log(mst);
  
                  if (
                    mstee.length !== 0) {
                      mstOK = "";
                    mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
                  }
                  else {
                    aMessstelle = mst;
                    mstOK = "checked";
                  }
                 
                    typ = obj[index+0][i];
                    taxaliste=obj[index+1][i];
                   nutzung=obj[index+2][i];

                  //}
                }
                this._uebersicht= {} as Uebersicht;
               if ( mst!== undefined){
                if (mstOK==="checked") {importp="";}else{
                  importp="checked";}
                    //this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                    this._uebersicht.mst=aMessstelle;this._uebersicht.sp3=typ;this._uebersicht.sp4=taxaliste;
                    this._uebersicht.sp5=nutzung;this._uebersicht.fehler1=mstOK;
                    this._uebersicht.fehler2="";this._uebersicht.fehler3="";
                    this._uebersicht.import1=importp;
     

                  this.xlsxImportPhylibService.MessDataImp.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
									
                  
                    this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                    this.xlsxImportPhylibService.groupNAch();
                  }

                }
               
                // if (i == 'Messstelle') {
  
                  if (index > 2) { 
                   

                   
                   
                      
                     
                      
                      if (i!=='ID_ART' && i!=='TAXON_NAME'){
                      aMessstelle=i;
                      Messwert=obj[index][i];
                      aTiefe=0;
                      aProbe='-';
                      aForm='-';
                      aEinheit='Ind./m²';
                      //für array und  this.MessDataImp (ImortMesswerte)
                      Einheit=3;
                      Form=6;
                      Probe=11;
                      Tiefe=1;
                      cf=false;
                      if (Messwert>0){
                      Taxon = obj[index]['ID_ART'];
                      
                      //Mst für import
                      let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == i);
  
      
                      if (
                        mstee.length !== 0) {
                          mstOK = "";
                        mst = mstee[0].id_mst; aMessstelle = mstee[0].namemst;
                      }
                      else {
                        aMessstelle = i;
                        mstOK = "checked";
                      }
                     
                      //Taxon = obj[index][TAXON_NAME];
                      let taxon_ = this.arten.filter(arten => arten.id_art == Taxon);
                      if (taxon_.length > 0) {
                         Taxon = taxon_[0].id_taxon; 
                         aTaxon = taxon_[0].taxonname_perlodes; RLD=taxon_[0].rld;
                         ok = ""; } 
                         else {
                        ok = "checked";
                        aTaxon=Taxon+'/'+obj[index]['TAXON_NAME']+'ID_ART nicht bekannt';
                        // var taxon2 = this.arten.filter(arten => arten.dvnr == Taxon);
                        // if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon; ok=false;}
      
                      }
                      importp="checked";
                      if (ok==="checked" || mstOK==="checked") {importp="";}

                      this._uebersicht= {} as Uebersicht;
                      array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
                      this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                     
                      this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;
                      this._uebersicht.fehler2=ok;this._uebersicht.fehler3="";this._uebersicht.import1=importp;
                      this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                      this.xlsxImportPhylibService.groupNAch();
                      Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = ""; mstOK = "";RLD=null;
                      aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
                  
                    }}



                    
                 
                    
                  }
  
                      
                
                
                
              }
            }
          })
  
          //of(array);
        
          this.uebersicht=this.xlsxImportPhylibService.uebersicht;
       this.xlsxImportPhylibService.MessDataImp = array;
      
        }}
  
  
