import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {XlsxImportPhylibService} from '../services/xlsx-import-phylib.service';
import { Uebersicht } from '../interfaces/uebersicht';

@Injectable({
  providedIn: 'root'
})
export class PhytoseeServiceService {

  constructor(private xlsxImportPhylibService:XlsxImportPhylibService) { }


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
   
 
    XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tab]]);
    json_Messstelle = JSON.stringify(XL_row_object);
    const obj = JSON.parse(json_Messstelle);
    const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr  && excelspalten.import_spalte === true);

     
      obj.forEach((val, index) => {

        this._uebersicht= {} as Uebersicht;
        if (obj[index] !== null) {
          for (var i in obj[index]) {
            bwert=obj[index][i];
            const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => excelspalten.spalten_name === i);
            if (valspaltenfiter2.length === 1) {


           
                let mst = obj[index]['GewässernameWB'];
                 let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.gewaessername === mst && messstellen.repraesent_mst===true);
                
                 if (mstee.length>0){
                 this._uebersicht.mst=mstee[0].namemst;
                 mstOK = "";}
                 else {
                  this._uebersicht.mst=obj[index]['GewässernameWB']
                	mstOK = "checked";}
                 
               
             
           
              this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";
              
              this.xlsxImportPhylibService._uebersicht=this._uebersicht;
              this.xlsxImportPhylibService.schalteSpalte(valspaltenfiter2[0].namespalteng,bwert);
              
              this.xlsxImportPhylibService.groupNAch();
            }

              // if (i==='Typ_Nr'){
              //   Typ_Nr= obj[index][i];
              // }

          

              // if (i==='N_MSST'){

              //   NMSST=obj[index][i];
              // }
              // if (i==='Jahr'){

              //   Jahr=obj[index][i];
              // }
              // if (i==='Phyto-See-Index WB'){

              //   PhytoSeeIndexWB=obj[index][i];
              // }
              // if (i==='Gesamtbewertung 5 Klassen'){

              //   Gesamtbewertung=obj[index][i];
              // }

              // if (i==='Biomasse_Metrik'){

              //   Biomasse_Metrik=obj[index][i];

              // }
              // if (i==='Algenklassen_Metrik'){

              //   Algenklassen_Metrik=obj[index][i];

              // }
              // if (i==='PTSI_Bewertung'){

              //   PTSI_Bewertung=obj[index][i];

              // }
              // console.log(Typ_Nr);
             // Typ_Nr	GewässernameWB	N_MSST	Jahr	Phyto-See-Index WB	Gesamtbewertung 5 Klassen	Biomasse_Metrik	Algenklassen_Metrik	PTSI_Bewertung




            }
          }})

  }
}
