import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';
import { Messwerte } from '../interfaces/messwerte';
import { ImpPhylibServ } from './impformenphylib.service';
@Injectable({
  providedIn: 'root'
})
export class PhytoseeServiceService {

  constructor(private impPhylibServ:ImpPhylibServ,private xlsxImportPhylibService:XlsxImportPhylibService) { }
  public arten: any;
  public messwerte:Messwerte[];
  public messstellenImp: MessstellenImp[] = [];
  public uebersicht:Uebersicht[]=[];
  public _uebersicht:Uebersicht;


  async callartenPhyto() {
    // this.workbookInit(datum,Probenehmer)
    await this.impPhylibServ.getArtenPhylibMP(5).forEach(value => {
      this.arten = value;
      console.log('observable -> ' + value);
    });
  }
  
  async PhytoseeLLBBimport(workbook, valspalten: any, tab: any,verfahrennr:number,loescheErste5Zeilen:boolean){
   
      // let array: Messwerte[] = []; 
      this.uebersicht = []; 
      this.xlsxImportPhylibService.MessDataOrgi = [];
      this.xlsxImportPhylibService.displayColumnNames=[];
    this.xlsxImportPhylibService.dynamicColumns=[];
    this.messstellenImp=[];
      //let reader = new FileReader();
    
      // var sheets;
      let Abundanzid:number=1;let Messstelle: string; var Probe; var Taxon; var Form; var Messwert; var Einheit; var Tiefe; var cf;let RLD;
      let aAbundanzID:string;let aMessstelle: string; let aParameter:string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
      // var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
      let bidmst;  let bideinh; let bwert;
      let importp:string;let mstOK: string; let ok: string; let typ:string;let nutzung:string;let taxaliste:string;
      
    let datum:Date;
    let einh1: number = 6;
let einh2: number = 7;
let einh3: number = 9;
let einh4: number = 8;

let para_id1: number = 97;
let para_id2: number = 98;
let para_id3: number = 99;
let para_id4: number = 100;
let gewaesser:string;
      let XL_row_object;
      let json_Messstelle;
      let mst_alt:string;
     let abundanz: string;let biovolKonz: string;let spezBioVoll:string;let relBioVol:string;
      let mst: string;
      this.arten=[];
      
      await  this.xlsxImportPhylibService.holeMst();
      await this.callartenPhyto();
      //welche Spalte in der Übersicht
      // const valspaltenfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1 && excelspalten.id_tab === tabMST);
      // const valtabfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.id_tab === tabMST);
  
      
      // const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
      // const valspaltenfiterMst = valspalten.filter(excelspalten => excelspalten.spalte_messstelle === true &&  excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 1);
  
        
  
  
  
        //console.log(workbook.SheetNames[i]);
        XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        json_Messstelle = JSON.stringify(XL_row_object);
        const obj1 = JSON.parse(json_Messstelle);
       
        // Entferne die ersten 5 Zeilen wenn neues LLBB-Format
        if (loescheErste5Zeilen===true){obj1.splice(0, 5);
          const headers = obj1[0];

      // Konvertiere das restliche Objekt zurück in ein JSON-Objekt mit den neuen Überschriften
      XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: headers, range: 5 });
        // XL_row_object=data;
        json_Messstelle = JSON.stringify(XL_row_object);
       
        }

        const obj = JSON.parse(json_Messstelle);
          console.log(this.uebersicht);
          // Here is your object
          let o: number = 1;
          obj.forEach((val, index) => {
            if (obj[index] !== null) {//index=Zeilennummer der Exceltabelle
              // for (var i in obj[index]) { //i=Spaltenüberschrift der Exceltabelle
              if (index>0){
                //console.log(val + " / " + obj[index][i] + ": " + i);
                console.log(obj.length)
                o = o + 1;
                              
                  
                  abundanz=null; biovolKonz=null; spezBioVoll=null; relBioVol=null;
                  const datumString:string = excelDateToJSDate(obj[index]['Datum']); // Beispiel: '2023-10-01'

                  // Konvertiere das Datum in eine Date-Instanz
                  const datum: Date = new Date(datumString);

                  gewaesser=obj[index]['Gewässer'];
                    mst =  obj[index]['Messstelle'];
                    if (mst===undefined){   mst = obj[index]['Messtelle'];}
                    if (mst.startsWith('O')) {
                      aMessstelle = mst.substring(1);
                    } else {
                      aMessstelle = mst;
                    }
                  
            
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
                 
                    
                   

                  //}
                
                this._uebersicht= {} as Uebersicht;
               if ( mst!== undefined){
                if (mstOK==="checked") {importp="";}else{
                  importp="checked";}

                       }

                  if (loescheErste5Zeilen===true){
                      
                        abundanz=obj[index]['Abundanz']; biovolKonz=obj[index]['Biovolumenkonzentration']; spezBioVoll=obj[index]['spezifisches Biovolumen']; relBioVol=obj[index]['relatives Biovolumen'];
                       
                  }else{
                    //Zellzahl (Zellen mL-1)	Biovol. (mm3L-1)	Zellvol. (µm³)			% BV

                    abundanz=obj[index]['Zellzahl (Zellen mL-1)']; biovolKonz=obj[index]['Biovol. (mm3L-1)']; spezBioVoll=obj[index]['Zellvol. (µm³)']; relBioVol=obj[index]['% BV'];
                  }
                  aAbundanzID=obj[index]['Taxonzusatz'];
                  if(aAbundanzID!==null){
                  Abundanzid
                //ergänzen 10-15µm...
                }

                    // einh1=6;einh2=7;einh3=9;einh4=8;
                    // para_id1=97;para_id2=98;para_id3=99;para_id4=100;
                    aParameter='Zellzahl';
                      Messwert=abundanz;
                      aTiefe=0;
                      aProbe='-';
                      aForm='-';
                      aEinheit='m/L';
                      //für array und  this.MessDataImp (ImortMesswerte)
                      Einheit=einh1;
                      Form=6;
                      Probe=11;
                      Tiefe=1;
                      cf=false;
                      if (Messwert>0){
                      Taxon = obj[index]['DV-Nr.'];
                      if (Taxon!==undefined){ // zummengefasste Taxa z.B.SummeKlasse Bacillariophyceae

                     
                      let taxon_ = this.arten.filter(arten => arten.dvnr == Taxon);
                      if (taxon_.length > 0) {
                         Taxon = taxon_[0].id_taxon; 
                         aTaxon = taxon_[0].taxon; RLD=taxon_[0].rld;
                         ok = ""; } 
                         else {
                        ok = "checked";
                        aTaxon=Taxon+'/ '+obj[index]['TAXON_NAME']+' nicht bekannt';
                        // var taxon2 = this.arten.filter(arten => arten.dvnr == Taxon);
                        // if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon; ok=false;}
      
                      }
                      importp="checked";
                      if (ok==="checked" || mstOK==="checked") {importp="";}

                      this._uebersicht= {} as Uebersicht;
                      // array.push({ _Nr: o, _Messstelle: mst, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: Messwert, _Einheit: Einheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD  });
                      this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Datum: datumString, _Probe: aProbe, _Taxon: aTaxon,_Parameter:aParameter, _Form: aAbundanzID, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: Abundanzid,_RoteListeD:RLD });
                      this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: datumString, id_einh: einh1, id_para: para_id1, wert: abundanz, id_import: null, id_pn: null ,uebersicht:this._uebersicht});
                      this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: datumString, id_einh: einh2, id_para: para_id2, wert: biovolKonz, id_import: null, id_pn: null ,uebersicht:this._uebersicht});
                      this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: datumString, id_einh: einh3, id_para: para_id3, wert: spezBioVoll, id_import: null, id_pn: null ,uebersicht:this._uebersicht});
                      this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: datumString, id_einh: einh4, id_para: para_id4, wert: relBioVol, id_import: null, id_pn: null ,uebersicht:this._uebersicht});
                      // this.xlsxImportPhylibService.schalteSpalte('sp3',gewaesser);
                    
                      this._uebersicht.mst=aMessstelle;this._uebersicht.fehler1=mstOK;
                      this._uebersicht.fehler2=ok;this._uebersicht.fehler3="";this._uebersicht.import1=importp;
                      this.xlsxImportPhylibService._uebersicht=this._uebersicht;
                      this.xlsxImportPhylibService.schalteSpalte('sp3',gewaesser);
                      this.xlsxImportPhylibService.groupNAch();
                      Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = ""; mstOK = "";RLD=null;
                      aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
                       // this._uebersicht.mst=i;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
                    }
                  }


                    
                 
                    
                  
  
                      
                
                
                
              }}
            
          })
  
          //of(array);
        
          this.uebersicht=this.xlsxImportPhylibService.uebersicht;
      //  this.xlsxImportPhylibService.MessDataImp = array;
      
        }
  
  async Phytoseeexport(workbook, valspalten: any, tab: any,verfahrennr:number){
    await this.xlsxImportPhylibService.holeMst();
    // console.log(this.xlsxImportPhylibService.mst);
    this.xlsxImportPhylibService.displayColumnNames=[];
    this.xlsxImportPhylibService.dynamicColumns=[];
    this.messstellenImp=[];

    let XL_row_object;
    let json_Messstelle;let jahr: string | undefined;
    let mstOK: string;
    let bidmst; let bidpara; let bideinh; let bwert;

   // const valrowsfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 4 && excelspalten.id_tab === tab);
  
    
  //  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr  && excelspalten.import_spalte === true);

 

// Holt das Arbeitsblatt aus dem Workbook basierend auf dem Namen des ersten gefilterten valspalten-Objekts
// Der Name des Sheets wird in Kleinbuchstaben umgewandelt und Unterstriche werden entfernt
const sheetName = valspaltenfiter[0].name_exceltab.toLowerCase().replace(/_/g, '');

// Wandelt die Namen der Sheets im Workbook in Kleinbuchstaben um, entfernt Unterstriche und erstellt eine Zuordnung
const sheets = Object.keys(workbook.Sheets).reduce((acc: any, key: string) => {
  const normalizedKey = key.toLowerCase().replace(/_/g, '');
  acc[normalizedKey] = workbook.Sheets[key];
  return acc;
}, {});


// Holt das Arbeitsblatt aus dem Workbook basierend auf dem in Kleinbuchstaben umgewandelten Namen
const sheet = sheets[sheetName];

// Konvertiert das Arbeitsblatt in ein JSON-Objekt
// const XL_row_object = XLSX.utils.sheet_to_json(sheet);

XL_row_object = XLSX.utils.sheet_to_json(sheet);
   // XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[valspaltenfiter[0].name_exceltab]);
    json_Messstelle = JSON.stringify(XL_row_object);
    const obj = JSON.parse(json_Messstelle);
   
     
      obj.forEach((val, index) => {

        this._uebersicht= {} as Uebersicht;
        if (obj[index] !== null) {
          for (var i in obj[index]) {
            bwert=obj[index][i];
            const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => i.includes(excelspalten.spalten_name));
            if (valspaltenfiter2.length === 1) {
            // Überprüft, ob die Spalte 'Jahr' existiert, bevor sie zugewiesen wird
  if ('Jahr' in obj[index]) {
    jahr = obj[index]['Jahr'];
  }else{
    // Setzt jahr auf undefined
    jahr = undefined;}
           
                let mst = obj[index]['Gewässername'];
                if (mst===null){  let mst = obj[index]['GewässernameWB'];}
                 let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst === mst);
                
                 if (mstee.length>0){
                 this._uebersicht.mst=mstee[0].namemst;
                 bidmst=mstee[0].id_mst;
                 mstOK = "";}
            
                 

                  else{

                    let mstee2 = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.name_synonym === mst);
                if (mstee2.length>0){
                  this._uebersicht.mst=mstee2[0].namemst;
                  bidmst=mstee2[0].id_mst;
                  mstOK = "";}else{
                  this._uebersicht.mst=mst
                	mstOK = "checked";bidmst=null;}}
                 
                  
                 
                   
        
                  bidpara = valspaltenfiter2[0].id_para;
                      
                      bwert = obj[index][i];
        
                      if (bidpara==='94'){
                        bwert=bewertung_als_zahl(bwert);}
                      
                      bideinh = valspaltenfiter2[0].id_einheit;
                      
                    
                      
                      if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){
        
                        
                      
                    
                    
        
                  }
             




                  // this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                     

               
           
              this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
              if (mstOK==="checked"){this._uebersicht.import1="";} else{this._uebersicht.import1="checked";}
               
              
              //wenn ein Jahr vorhanden ist wird es in die MessstellenImp eingetragen
              if (jahr!=='undefined') {
                this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht,jahr:jahr });}
                  else{
                    this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht });}
							
              this.xlsxImportPhylibService._uebersicht=this._uebersicht;
              this.xlsxImportPhylibService.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert,jahr);
              
              this.xlsxImportPhylibService.groupNAch();
            }

             


            }
          }})
          console.log(this.messstellenImp)
          
          this.xlsxImportPhylibService.messstellenImp=this.messstellenImp;
  }
}
/**
 * Konvertiert eine textuelle Bewertung in eine numerische Bewertung.
 * @param bewertung - Die textuelle Bewertung.
 * @returns Die numerische Bewertung.
 */
function bewertung_als_zahl(bewertung: string): number {
  let bewertung_zahl: number;

  // Überprüft, ob die Bewertung "sehr gut" enthält
  if (bewertung.includes("sehr gut")) {
    bewertung_zahl = 1;
  } 
  // Überprüft, ob die Bewertung "gut" enthält
  else if (bewertung.includes("gut")) {
    bewertung_zahl = 2;
  } 
  // Überprüft, ob die Bewertung "mäßig" enthält
  else if (bewertung.includes("mäßig")) {
    bewertung_zahl = 3;
  } 
  // Überprüft, ob die Bewertung "unbefriedigend" enthält
  else if (bewertung.includes("unbefr")) {
    bewertung_zahl = 4;
  } 
  // Überprüft, ob die Bewertung "schlecht" enthält
  else if (bewertung.includes("schlecht")) {
    bewertung_zahl = 5;
  } 
  // Standardfall, wenn keine der obigen Bewertungen enthalten ist
  else {
    bewertung_zahl = 0;
  }

  // Gibt die numerische Bewertung zurück
  return bewertung_zahl;
}
function excelDateToJSDate(excelDate: number): string {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch start date
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000); // 86400000 ms in a day

  const day = String(jsDate.getDate()).padStart(2, '0'); // Tag mit führender Null
  const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Monat mit führender Null (Monate sind 0-basiert)
  const year = jsDate.getFullYear();

  return `${day}.${month}.${year}`;
}