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
  public loescheErste5Zeilen:boolean;
  constructor(private impPhylibServ: ImpPhylibServ) { }
  VorhandeneVerfahren:number[]=[];



//Datenabfrage aus Postgres (exceltabs, Excelspalten und ValVerfahren)
	async callvalexceltabs() {

      // holt sich die Exceltabs aus Postgres
      await this.impPhylibServ.getvalExceltabs().forEach(value => {
        this.valexceltabs = value;
        console.log('observable -> ' + value);
      });
      // await this.impPhylibServ.getvalExceltabs().forEach(value => {
      //   const lowerCaseValue = value.toLowerCase();
      //   this.valexceltabs = lowerCaseValue;
      //   console.log('observable -> ' + lowerCaseValue);
      // });
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
// Liest die Namen der Exceltabs des importierten Excelfiles aus
exceltabsauslesen(workbook) {
  let tabs = "";
  let tabsvier = "";
  
  for (let i = 0, l = workbook.SheetNames.length; i < l; i += 1) {
    // Holt den Namen des aktuellen Tabs und wandelt ihn in Kleinbuchstaben um
    const tabNeu = workbook.SheetNames[i].toLowerCase();
    
    if (i + 1 < l) {
      if (i < 3) {
        tabsvier = tabsvier + tabNeu + ";";
      }
      if (i === 3) {
        tabsvier = tabsvier + tabNeu;
      }
      tabs = tabs + tabNeu + ";";
    } else if (i + 1 === l) {
      tabs = tabs + tabNeu;
    }
  }
  
  this.ExceltabsimpVier = tabsvier;
  this.Exceltabsimpalle = tabs;
}

  countOccurrences(valexceltabsfilter: string): number {
    // Schritt 1: Splitten der vier ersten Tabs der Excelimportdatei in einzelne Einträge und in Kleinbuchstaben umwandeln
    const entries = this.ExceltabsimpVier.split(';')
      .filter(entry => entry.trim().length > 0)
      .map(entry => entry.toLowerCase());
  
    // Schritt 2: Splitten der valexceltabsfilter-Zeichenkette und in Kleinbuchstaben umwandeln
    const filterEntries = valexceltabsfilter.split(';')
      .filter(entry => entry.trim().length > 0)
      .map(entry => entry.toLowerCase());
  
    // Schritt 3: Überprüfen, wie viele dieser Einträge in filterEntries vorkommen
    const occurrences = entries.filter(entry => filterEntries.includes(entry)).length;
  
    return occurrences;
  }
  async ExcelTabsinArray(workbook) {
    //holt sich alle Exceltabs aus Postgres (Tabelle val_exceltabs)
    await this.callvalexceltabs();
    
    //Anzahl Tabs ermitteln
    let tabs = workbook.SheetNames.length;
    let valexceltabsfilter = this.valexceltabs.filter(exceltabs => exceltabs.anzahltabs === tabs);
    this.exceltabsauslesen(workbook);//liest Exceltabs aus
    this.spaltenauslesen(workbook);//auslesen der Tabs und enthaltener Spaltennamen

    if (valexceltabsfilter.length === 1) {//wenn nur eine Vorlage für ein Tab vorhanden ist
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
      else if (valexceltabsfilter[0].ident_kriterium === 5 &&  this.countOccurrences(valexceltabsfilter[0].namentabs)>1) {
        
        this.NrVerfahren =valexceltabsfilter[0].id_verfahren;
        console.log( this.NrVerfahren );
      }

    }
      //wenn mehrere Vorlagen für ein Tab vorhanden sind in (PG) val_exceltabs
    else if (valexceltabsfilter.length > 1) {

      
      //Phylibimportdatei Prüfung anhand der Tab-Benennung
    //  let valexceltabsfilter4=valexceltabsfilter.filter(exceltabs=>exceltabs.namentabs===this.ExceltabsimpVier);
      const valexceltabsfilter4=this.countOccurrences(valexceltabsfilter[0].namentabs);

      let valexceltabsfilter2 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsimpalle);
      if (valexceltabsfilter2.length === 1) {

        this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }//Phytosee-Export 
      else   if (valexceltabsfilter4 === 2) {this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }
      
      
      else{
        if (this.excelspaltenimport.length>0){
          
          
          try {
            for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {
              let name = this.excelspaltenimport[i];
              if (name.Spaltenname === "ilat-nr." || name.Spaltenname === "llbb-nr" || name.Spaltenname.includes("protokoll phytoplankton")) {
                if (name.Spaltenname.includes("protokoll phytoplankton")) {
                  this.loescheErste5Zeilen=true;
                }else{  this.loescheErste5Zeilen=false;}
                this.waehleVerfahren(6);break;}
                  }
             
                 
                }
              
            
          catch (error) {
           // console.error(error.message);
          }
      }
   
  }

    }else{
      if (this.excelspaltenimport.length>0){
        
        
        try {
          for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {
            let name = this.excelspaltenimport[i];
            if (name.Spaltenname === "ilat-nr." || name.Spaltenname === "llbb-nr." || name.Spaltenname.includes("protokoll phytoplankton")) {
              if (name.Spaltenname.includes("protokoll phytoplankton")) {
                this.loescheErste5Zeilen=true;
              }else{  this.loescheErste5Zeilen=false;} 
              this.waehleVerfahren(6);break;}
                }
           
               
              }
            
          
        catch (error) {
         // console.error(error.message);
        }
    }
 
}}

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

         temp.Spaltenname=i.toLowerCase();
         temp.Tabname=Tabname.toLowerCase();
          this.excelspaltenimport.push(temp);
        }
      }
    })}
  }
  ValExcelSpalten(namentabs: string) {
    // Initialisiere das Array VorhandeneVerfahren als leeres Array
    this.VorhandeneVerfahren = [];

    // Deklariere und initialisiere Variablen
    let valspaltenfiter = null;
    let valtabname = namentabs;

    // Filtere die valspalten (VOrgabe PG ) basierend auf dem Wert von namentabs (Importdatei)
    if (namentabs === "indifferent") {
        // Wenn namentabs "indifferent" ist, filtere die valspalten, deren name_exceltab gleich namentabs ist
        valspaltenfiter = this.valspalten.filter(excelspalten => excelspalten.name_exceltab === namentabs);
    } else {
        // Ansonsten filtere die valspalten, deren name_exceltab nicht "indifferent" ist
        valspaltenfiter = this.valspalten.filter(excelspalten => excelspalten.name_exceltab !== "indifferent");
    }

    // Logge den Inhalt von excelspaltenimport in die Konsole
    console.log(this.excelspaltenimport);

    // Iteriere über jedes Element in excelspaltenimport
    for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {
        let name = this.excelspaltenimport[i];

        // Iteriere über jedes Element im gefilterten valspaltenfiter
        for (let a = 0, l = valspaltenfiter.length; a < l; a += 1) {
            const valnamespalte = valspaltenfiter[a].spalten_name.toLowerCase();

            // Setze den Tabellennamen basierend auf dem Wert von namentabs
            if (namentabs !== "indifferent") {
                valtabname = valspaltenfiter[a].name_exceltab;
            } else {
                name.Tabname = "indifferent";
            }

            const valnameerforderlich: boolean = valspaltenfiter[a].kennung;
            const verfahrens_id: number = valspaltenfiter[a].id_verfahren;

            // Überprüfe, ob die Spaltennamen und Tabellennamen übereinstimmen und ob der Name erforderlich ist
            if (name.Spaltenname === valnamespalte && name.Tabname === valtabname && valnameerforderlich === true) {
                // Füge die verfahrens_id zu VorhandeneVerfahren hinzu
                this.VorhandeneVerfahren.push(verfahrens_id);
            }
        }
    }

    // Logge den Inhalt von VorhandeneVerfahren in die Konsole
    console.log(this.VorhandeneVerfahren);
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
