import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';

@Injectable({
  providedIn: 'root'
})
export class PhytoseeServiceService {

  constructor(private xlsxImportPhylibService:XlsxImportPhylibService) { }
  
  public messstellenImp: MessstellenImp[] = [];
  public uebersicht:Uebersicht[]=[];
  public _uebersicht:Uebersicht;


  async Phytoseeexport(workbook, valspalten: any, tab: any,verfahrennr:number){
    await this.xlsxImportPhylibService.holeMst();
    this.xlsxImportPhylibService.displayColumnNames=[];
    this.xlsxImportPhylibService.dynamicColumns=[];
    

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
                 let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.gewaessername === mst && messstellen.repraesent_mst===true);
                
                 if (mstee.length>0){
                 this._uebersicht.mst=mstee[0].namemst;
                 mstOK = "";}
                 else {
                  this._uebersicht.mst=mst
                	mstOK = "checked";}
                 
                  
                 
                   
        
                  bidpara = valspaltenfiter2[0].id_para;
                      
                      bwert = obj[index][i];
        
                      if (bidpara==='94'){
                        bwert=bewertung_als_zahl(bwert);}
                      
                      bideinh = valspaltenfiter2[0].id_einheit;
                      
                    
                      
                      if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){
        
                        
                      
                    
                    
        
                  }
             




                  // this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                     

               
           
              this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
              //wenn ein Jahr vorhanden ist wird es in die MessstellenImp eingetragen
              if (jahr!=='undefined') {this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht,jahr:jahr });}
                  else{this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht });}
							
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