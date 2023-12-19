import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ValExceltabsService {
	excelspaltenimport:string[]=[];
  public valexceltabs: any;
  public valverfahren: any;
  public valspalten: any;
  public InfoBox: string = "";
  public Verfahren:string="";
  public NrVerfahren:number;
  public Exceltabsalle:string="";
  
  constructor(private impPhylibServ: ImpPhylibServ) { }
  VorhandeneVerfahren:number[]=[];




	async callvalexceltabs() {


      await this.impPhylibServ.getvalExceltabs().forEach(value => {
        this.valexceltabs = value;
        console.log('observable -> ' + value);
      });

      await this.impPhylibServ.getvalVerfahren().forEach(value => {
        this.valverfahren = value;
        console.log('observable -> ' + value);
      });  
      await this.impPhylibServ.getvalExcelSpalten().forEach(value => {
        this.valspalten = value;
        console.log('observable -> ' + value);
      }); 
      

	}

  waehleVerfahren(tabverfahrenNrs:number){

   let verfahrenList= this.valverfahren.filter(verfahre => verfahre.id === tabverfahrenNrs);

    if (verfahrenList.length===1){
      this.Verfahren=verfahrenList[0].verfahren;
      this.NrVerfahren=tabverfahrenNrs;

    }
    
  }

  exceltabsauslesen(workbook){
let tabs="";
    for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {
      tabs=workbook.SheetNames[i]
      if (i+1<l){
        tabs=tabs+";";
      }

    }

    this.Exceltabsalle=tabs;
  }


  async ExcelTabsinArray(workbook, sheetNr: number) {
    await this.callvalexceltabs();

    
    let tabs = workbook.SheetNames.length;
    let valexceltabsfilter = this.valexceltabs.filter(exceltabs => exceltabs.anzahltabs === tabs);
    this.exceltabsauslesen(workbook);//liest Exceltabs aus

    if (valexceltabsfilter.length === 1) {//wenn nur ein Tab vorhanden ist
     if ( valexceltabsfilter[0].ident_kriterium===1){//Anzahl der Tabs ist eindeutig für Verfahrensauswahl
      this.waehleVerfahren(valexceltabsfilter[0].id_verfahren);
      //führe Verfahren aus
    }else if (valexceltabsfilter[0].ident_kriterium===2){//Anzahl und Name der Tabs ist eindeutig für Verfahrensauswahl

      let valexceltabsfilter2_1 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsalle);
      if (valexceltabsfilter2_1.length === 1) {

        this.waehleVerfahren(valexceltabsfilter2_1[0].id_verfahren);
        //führe Verfahren aus
      }
    }else if (valexceltabsfilter[0].ident_kriterium===4){

      this.spaltenauslesen(1,workbook);
      this.ValExcelSpalten(1);

    }


    }

    else if (valexceltabsfilter.length > 1) {

      

      let valexceltabsfilter2 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsalle);
      if (valexceltabsfilter2.length === 1) {

        this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }

    }
 
}

  spaltenauslesen(tab: number, workbook) {
    let XL_row_object;
    let json_daten;
    XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[tab-1]]);
    json_daten = JSON.stringify(XL_row_object);
    const obj = JSON.parse(json_daten);
    obj.forEach((val, index) => {
      if (obj[index] !== null) {
        for (var i in obj[index]) {
         
          this.excelspaltenimport.push(i);
        }
      }
    })
  }
 async ValExcelSpalten(tab:number){

  let valspaltenfiter= this.valspalten.filter(exceltabs => exceltabs.id_tab === tab-1);

   for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {

    const name=this.excelspaltenimport[i];

   for (let a = 0, l = valspaltenfiter.length; a < l; a += 1) {
    const valname=valspaltenfiter[a].tabname;
    const valnameerforderlich:boolean=valspaltenfiter[a].kennung;
    const verfahrens_id:number=valspaltenfiter[a].id_verfahren;
      if (name===valname && valnameerforderlich===true){

    await this.VorhandeneVerfahren.push(verfahrens_id);
      }
    
    }

}

}
}