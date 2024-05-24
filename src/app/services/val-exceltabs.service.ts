import { Injectable } from '@angular/core';
import { ImpPhylibServ } from '../services/impformenphylib.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ValExceltabsService {

	excelspaltenimport:TabSpalte[]=[];
  public valexceltabs: any;
  public valverfahren: any;
  public valspalten: any;
  public InfoBox: string = "";
  public Verfahren:string="";
  public NrVerfahren:number;
  public Exceltabsimpalle:string="";
  public ExceltabsimpVier:string="";
  
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
let tabsvier="";
    for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {
     const tabNeu=workbook.SheetNames[i]
      if (i+1<l){
        if (i<3){
          tabsvier=tabsvier+tabNeu+";";
        }
        if (i===3){ tabsvier=tabsvier+tabNeu;}
        tabs=tabs+tabNeu+";";
      }else if(i+1===l){
        tabs=tabs+tabNeu;

      }

    }
    this.ExceltabsimpVier=tabsvier;
    this.Exceltabsimpalle=tabs;
  }


  async ExcelTabsinArray(workbook) {
    await this.callvalexceltabs();
    
    //Anzahl Tabs ermitteln
    let tabs = workbook.SheetNames.length;
    let valexceltabsfilter = this.valexceltabs.filter(exceltabs => exceltabs.anzahltabs === tabs);
    this.exceltabsauslesen(workbook);//liest Exceltabs aus
    this.spaltenauslesen(workbook);//auslesen der Tabs und enthaltener Spaltennamen

    if (valexceltabsfilter.length === 1) {//wenn nur ein Tab vorhanden ist
      //Anzahl der Tabs ist eindeutig für Verfahrensauswahl
      if (valexceltabsfilter[0].ident_kriterium === 1) {
        this.waehleVerfahren(valexceltabsfilter[0].id_verfahren);
        //führe Verfahren aus
        //Anzahl der Tabs ist nicht eindeutig für Verfahrensauswahl 
      } else if (valexceltabsfilter[0].ident_kriterium === 2) {//Anzahl und Name der Tabs ist erforderlich für Verfahrensauswahl

        let valexceltabsfilter2_1 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsimpalle);
        if (valexceltabsfilter2_1.length === 1) {

          this.waehleVerfahren(valexceltabsfilter2_1[0].id_verfahren);

        }
      } else if (valexceltabsfilter[0].ident_kriterium === 4) {

        
        this.ValExcelSpalten(valexceltabsfilter[0].namentabs);
        this.NrVerfahren = this.ArrayAvg(this.VorhandeneVerfahren);


        console.log(this.NrVerfahren);
      }
      else if (valexceltabsfilter[0].ident_kriterium === 5 &&  valexceltabsfilter[0].namentabs===this.ExceltabsimpVier) {
        
        this.NrVerfahren =valexceltabsfilter[0].id_verfahren;
        console.log( this.NrVerfahren );
      }

    }
      //wenn mehr als ein Tab vorhanden ist
    else if (valexceltabsfilter.length > 1) {

      
      //Phylibimportdatei Prüfung anhand der Tab-Benennung
      let valexceltabsfilter4=valexceltabsfilter.filter(exceltabs=>exceltabs.namentabs===this.ExceltabsimpVier);
      let valexceltabsfilter2 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsimpalle);
      if (valexceltabsfilter2.length === 1) {

        this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }//Phytosee-Export 
      else   if (valexceltabsfilter4.length === 1) {this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }
      
      
      else {
        try {
          for (let i = 0, l =valexceltabsfilter.length; i < l; i += 1) {
            this.ValExcelSpalten(valexceltabsfilter[i].namentabs);
            this.NrVerfahren = this.ArrayAvg(this.VorhandeneVerfahren);
            if (this.NrVerfahren > 0) {
              throw new Error("Number is 4");
            }
            console.log(  this.NrVerfahren);
          };
        } catch (error) {
         // console.error(error.message);
        }


       }

    }
 
}

  spaltenauslesen( workbook) {

    this.excelspaltenimport=[];
    let XL_row_object;
    let json_daten;
    for (let a = 0, l = workbook.SheetNames.length; a < l; a += 1) {
      
      let Tabname=workbook.SheetNames[a];
    XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[a]]);
    json_daten = JSON.stringify(XL_row_object);
    const obj = JSON.parse(json_daten);
    obj.forEach((val, index) => {
      if (obj[index] !== null && index===0) {
        for (var i in obj[index]) {
          let temp:TabSpalte={} as TabSpalte;

         temp.Spaltenname=i;
         temp.Tabname=Tabname;
          this.excelspaltenimport.push(temp);
        }
      }
    })}
  }
  ValExcelSpalten(namentabs:string){
    this.VorhandeneVerfahren=[];
  let valspaltenfiter=null;let valtabname=namentabs;
  if (namentabs==="indifferent"){ 
    valspaltenfiter= this.valspalten.filter(excelspalten => excelspalten.name_exceltab === namentabs);}
  else{
    valspaltenfiter= this.valspalten.filter(excelspalten => excelspalten.name_exceltab !== "indifferent");
  }
console.log(this.excelspaltenimport)
   for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {

    let name=this.excelspaltenimport[i];

   for (let a = 0, l = valspaltenfiter.length; a < l; a += 1) {
    const valnamespalte=valspaltenfiter[a].spalten_name;
    if (namentabs!=="indifferent"){ 
     valtabname=valspaltenfiter[a].name_exceltab;}else{name.Tabname="indifferent";}
    const valnameerforderlich:boolean=valspaltenfiter[a].kennung;
    const verfahrens_id:number=valspaltenfiter[a].id_verfahren;
    
      if (name.Spaltenname===valnamespalte && name.Tabname===valtabname && valnameerforderlich===true){

     this.VorhandeneVerfahren.push(verfahrens_id);
      }
    
    }

}
console.log(this.VorhandeneVerfahren)
}


 ArrayAvg(myArray) {
  let d=20;
  var i = 0, summ = 0, ArrayLen = myArray.length;
  while (i < ArrayLen) {
    summ = summ + myArray[i++];
  }
if (ArrayLen>0){
 d=summ/ArrayLen}
  return Math.round (d);
}



}
interface TabSpalte {
        

Tabname: string;
Spaltenname: string;


}
