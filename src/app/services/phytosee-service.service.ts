import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';
import { Messwerte } from '../interfaces/messwerte';
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
    let json_Messstelle; var Messstelle: string; let mstOK: string;
    let bidmst; let bidpara; let bideinh; let bwert;

   // const valrowsfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 4 && excelspalten.id_tab === tab);
  
    
  //  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr  && excelspalten.import_spalte === true);

 
    XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[valspaltenfiter[0].name_exceltab]);
    json_Messstelle = JSON.stringify(XL_row_object);
    const obj = JSON.parse(json_Messstelle);
   
     
      obj.forEach((val, index) => {

        this._uebersicht= {} as Uebersicht;
        if (obj[index] !== null) {
          for (var i in obj[index]) {
            bwert=obj[index][i];
            const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);
            if (valspaltenfiter2.length === 1) {


           
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
        
                      if (bidpara===94){bwert=bewertung_als_zahl(bwert)}
                      
                      bideinh = valspaltenfiter2[0].id_einheit;
                      
                    
                      
                      if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1){
        
                        
                      
                    
                    
        
                  }
             




                  // this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });
                     

               
           
              this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
              this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht });
							
              this.xlsxImportPhylibService._uebersicht=this._uebersicht;
              this.xlsxImportPhylibService.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
              
              this.xlsxImportPhylibService.groupNAch();
            }

             


            }
          }})
          this.xlsxImportPhylibService.messstellenImp=this.messstellenImp;
  }
}
function bewertung_als_zahl(bewertung:string){
  let bewertung_zahl:number;

  switch(bewertung) { 
		case "sehr gut": { 
			bewertung_zahl= 1;
		   break; 
		} 
		case "gut": { 
			bewertung_zahl= 2;
		   break; 
		} 
		case "mäßig": { 
			bewertung_zahl= 3;
		   break; 
		} 
		case "unbefriedigend": { 
			bewertung_zahl= 4;
		   break; 
		} 
		case "schlecht": { 
			bewertung_zahl= 5;
		   break; 
		} 
		
		default: { 
		  bewertung_zahl= 0; 
		   break; 
		} 
	 } 




return bewertung_zahl;
}