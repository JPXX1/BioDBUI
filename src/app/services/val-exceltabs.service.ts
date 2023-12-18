import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ValExceltabsService {
	exceltabsimport:string[]=[];
  public valexceltabs: any;
  public InfoBox: string = "";
  public Verfahren:string="";
  
  constructor(private impPhylibServ: ImpPhylibServ) { }
  VorhandeneVerfahren:string[]=[];




	async callvalexceltabs() {


      await this.impPhylibServ.getvalExceltabs().forEach(value => {
        this.valexceltabs = value;
        console.log('observable -> ' + value);
      });



	}


async ExcelTabsinArray(workbook,sheetNr:number){
  await this.callvalexceltabs();
  
  let XL_row_object;
  let json_daten;
  
//   var parser = require('simple-excel-to-json')
// var doc = parser.parseXls2Json(workbook); 
  
  
  
  
  
  
  XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[sheetNr]]);

 
 
  json_daten = JSON.stringify(XL_row_object);



  const obj = JSON.parse(json_daten);
  
    obj.forEach((val, index) => {
      if (obj[index] !== null) {
        for (var i in obj[index]) {
          //var Phytobenthostyp;var Makrophytentyp;var WRRLTyp;var Gesamtdeckungsgrad;
          this.exceltabsimport.push(i);

            }
  }})

  await this.ValExcelTabs();
}


 async ValExcelTabs(){
   for (let i = 0, l = this.exceltabsimport.length; i < l; i += 1) {

    const name=this.exceltabsimport[i];

   for (let a = 0, l = this.valexceltabs.length; a < l; a += 1) {
    const valname=this.valexceltabs[a].tabname;
    const valnameerforderlich:boolean=this.valexceltabs[a].kennung;
    const verfahrensname:string=this.valexceltabs[a].verfahren;
      if (name===valname && valnameerforderlich===true){

    await    this.VorhandeneVerfahren.push(verfahrensname);
      }
    
    }

}

}
}