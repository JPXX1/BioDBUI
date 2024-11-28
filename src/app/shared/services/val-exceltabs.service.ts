import { Injectable } from '@angular/core';
import { ImpPhylibServ } from './impformenphylib.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
/**
 * Service zur Verarbeitung von Excel-Tabellen und deren Spalten, die aus einer PostgreSQL-Datenbank abgerufen werden.
 * 
 * Dieser Service bietet Funktionen zum Abrufen und Verarbeiten von Excel-Tabellen und deren Spalten, die in einer PostgreSQL-Datenbank gespeichert sind.
 * Er ermöglicht die Auswahl und Validierung von Verfahren basierend auf den Excel-Tabellen und deren Spaltennamen.
 * 
 * @class
 * @classdesc Diese Klasse bietet Methoden zum Abrufen und Verarbeiten von Excel-Tabellen und deren Spalten aus einer PostgreSQL-Datenbank.
 * 
 * @property {TabSpalte[]} excelspaltenimport - Array von TabSpalten, die aus den Excel-Tabellen importiert wurden.
 * @property {any} valexceltabs - Enthält die abgerufenen Excel-Tabs.
 * @property {any} valverfahren - Enthält die abgerufenen Verfahren.
 * @property {any} valspalten - Enthält die abgerufenen Excel-Spalten.
 * @property {string} InfoBox - Informationsbox für Nachrichten.
 * @property {string} Verfahren - Name des ausgewählten Verfahrens.
 * @property {number} NrVerfahren - Nummer des ausgewählten Verfahrens.
 * @property {string} Exceltabsimpalle - Namen aller importierten Excel-Tabs.
 * @property {string} ExceltabsimpVier - Namen der ersten vier importierten Excel-Tabs.
 * @property {boolean} loescheErste5Zeilen - Flag zum Löschen der ersten fünf Zeilen.
 * @property {number[]} VorhandeneVerfahren - Array von vorhandenen Verfahren.
 * 
 * @constructor
 * @param {ImpPhylibServ} impPhylibServ - Service zum Abrufen der Daten aus der PostgreSQL-Datenbank.
 * 
 * @method callvalexceltabs - Ruft asynchron verschiedene Werte vom Service ab und setzt sie.
 * @method waehleVerfahren - Wählt das entsprechende Verfahren basierend auf der Tab-Verfahrensnummer aus.
 * @method exceltabsauslesen - Liest die Namen der Excel-Tabs des importierten Excel-Files aus.
 * @method countOccurrences - Zählt die Vorkommen von Einträgen aus den Excel-Import-Registerkarten, die dem angegebenen Filter entsprechen.
 * @method ExcelTabsinArray - Verarbeitet die Excel-Arbeitsmappe und wählt das entsprechende Verfahren basierend auf der Anzahl der Tabs und deren Namen aus.
 * @method spaltenauslesen - Liest die Spaltennamen der Excel-Tabs aus.
 * @method ValExcelSpalten - Validiert die Excel-Spalten basierend auf den in `valspalten` definierten Kriterien.
 * @method ArrayAvg - Berechnet den Durchschnitt eines Arrays.
 */
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
    /**
     * Ruft asynchron verschiedene Werte vom Service ab und setzt sie.
     * 
     * Diese Methode führt die folgenden Operationen aus:
     * 1. Ruft Excel-Tabs vom Service ab und weist sie `valexceltabs` zu.
     * 2. Ruft Verfahren vom Service ab und weist sie `valverfahren` zu.
     * 3. Ruft Excel-Spalten vom Service ab und weist sie `valspalten` zu.
     * 
     * Jede Abrufoperation wird abgewartet, um sicherzustellen, dass die Werte nacheinander gesetzt werden.
     * 
     * @returns {Promise<void>} Ein Versprechen, das aufgelöst wird, wenn alle Werte abgerufen und gesetzt wurden.
     */
	async callvalexceltabs() {

      // holt sich die Exceltabs aus Postgres
      await this.impPhylibServ.getvalExceltabs().forEach(value => {
        this.valexceltabs = value;
        // console.log('observable -> ' + value);
      });
      // await this.impPhylibServ.getvalExceltabs().forEach(value => {
      //   const lowerCaseValue = value.toLowerCase();
      //   this.valexceltabs = lowerCaseValue;
      //   console.log('observable -> ' + lowerCaseValue);
      // });
      await this.impPhylibServ.getvalVerfahren().forEach(value => {
        this.valverfahren = value;
        // console.log('observable -> ' + value);
      });  
      await this.impPhylibServ.getvalExcelSpalten().forEach(value => {
        this.valspalten = value;
        // console.log('observable -> ' + value);
      }); 
      

	}

  /**
   * Wählt ein Verfahren basierend auf der angegebenen Verfahrensnummer aus.
   * Filtert die Liste der Verfahren, um dasjenige zu finden, das der angegebenen Nummer entspricht.
   * Wenn genau ein passendes Verfahren gefunden wird, setzt es die Eigenschaften `Verfahren` und `NrVerfahren`.
   *
   * @param {number} tabverfahrenNrs - Die Nummer des auszuwählenden Verfahrens.
   */
  waehleVerfahren(tabverfahrenNrs:number){

   let verfahrenList= this.valverfahren.filter(verfahre => verfahre.id === tabverfahrenNrs);

    if (verfahrenList.length===1){
      this.Verfahren=verfahrenList[0].verfahren;
      this.NrVerfahren=tabverfahrenNrs;

    }
    
  }
// Liest die Namen der Exceltabs des importierten Excelfiles aus
/**
 * Liest die Blattnamen aus der bereitgestellten Arbeitsmappe und verarbeitet sie.
 * 
 * Diese Methode konvertiert die Blattnamen in Kleinbuchstaben und verkettet sie zu zwei Zeichenfolgen:
 * - `ExceltabsimpVier`: Enthält die ersten vier Blattnamen, getrennt durch Semikolons.
 * - `Exceltabsimpalle`: Enthält alle Blattnamen, getrennt durch Semikolons.
 * 
 * @param {Object} workbook - Das Arbeitsmappenobjekt, das die Blattnamen enthält.
 */

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

    /**
     * Zählt die Vorkommen von Einträgen aus den Excel-Import-Registerkarten, die dem angegebenen Filter entsprechen.
     *
     * @param valexceltabsfilter - durch Semikolon getrennte Zeichenfolgen, wird verwendet, um übereinstimmende Einträge zu filtern und zu zählen.
     * @returns Die Anzahl der Vorkommen von Einträgen aus den Excel-Import-Registerkarten, die dem Filter entsprechen.
     *
     * @bemerkungen
     * - Die Methode teilt die ersten vier Registerkarten der Excel-Importdatei in einzelne Einträge auf und konvertiert sie in Kleinbuchstaben.
     * - Sie teilt auch die `valexceltabsfilter`-Zeichenfolge in einzelne Einträge auf und konvertiert sie in Kleinbuchstaben.
     * - Schließlich zählt sie, wie viele dieser Einträge aus den Excel-Import-Registerkarten in den Filtereinträgen vorhanden sind.
     */
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




    /**
     * Verarbeitet die Excel-Arbeitsmappe und wählt das entsprechende Verfahren basierend auf der Anzahl der Tabs und deren Namen aus.
     * 
     * @param workbook - Die zu verarbeitende Excel-Arbeitsmappe.
     * 
     * Die Funktion führt die folgenden Schritte aus:
     * 1. Ruft alle Excel-Tabs aus der Postgres-Tabelle `val_exceltabs` ab.
     * 2. Bestimmt die Anzahl der Tabs in der Arbeitsmappe.
     * 3. Filtert die `valexceltabs` basierend auf der Anzahl der Tabs in der Arbeitsmappe.
     * 4. Liest die Excel-Tabs und deren Spaltennamen.
     * 5. Wählt das entsprechende Verfahren basierend auf den in `valexceltabs` definierten Kriterien aus.
     * 
     * Die Auswahlkriterien umfassen:
     * - Wenn es nur eine Vorlage für einen Tab gibt, überprüft es die Identifikationskriterien (`ident_kriterium`):
     *   - Wenn `ident_kriterium` 1 ist, wählt es das Verfahren basierend auf der Anzahl der Tabs aus.
     *   - Wenn `ident_kriterium` 2 ist, wählt es das Verfahren basierend auf der Anzahl und den Namen der Tabs aus.
     *   - Wenn `ident_kriterium` 4 ist, validiert es die Excel-Spalten und wählt das Verfahren basierend auf dem Durchschnitt der verfügbaren Verfahren aus.
     *   - Wenn `ident_kriterium` 5 ist und der Tab-Name mehr als einmal vorkommt, wählt es das Verfahren basierend auf dem Tab-Namen aus.
     * - Wenn es mehrere Vorlagen für einen Tab gibt, filtert es weiter basierend auf den Tab-Namen und Spaltennamen.
     * 
     * Die Funktion behandelt verschiedene Szenarien, einschließlich:
     * - Phylib-Importdateien basierend auf Tab-Namen.
     * - Phytosee-Exportdateien basierend auf Tab-Namen.
     * - Phytofluss-Exportdateien basierend auf Tab-Namen und Spaltennamen.
     * - Phylib-Exportdateien basierend auf Spaltennamen.
     * 
     * Im Falle von Fehlern während des Prozesses versucht die Funktion, diese elegant zu behandeln.
     */
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

      
      //z.B.: Phylibimportdatei Prüfung anhand der Tab-Benennung
    //  let valexceltabsfilter4=valexceltabsfilter.filter(exceltabs=>exceltabs.namentabs===this.ExceltabsimpVier);
      let valexceltabsfilter4=this.countOccurrences(valexceltabsfilter[0].namentabs);

      let valexceltabsfilter2 = valexceltabsfilter.filter(exceltabs => exceltabs.namentabs === this.Exceltabsimpalle);
      if (valexceltabsfilter2.length === 1) {

        this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }//Phytosee-Export 
      else   if (valexceltabsfilter4 === 2) {this.waehleVerfahren(valexceltabsfilter2[0].id_verfahren);

      }
      //Phytofluss-Exportdatei
      else if (valexceltabsfilter.length ===2 && valexceltabsfilter4 === 1 && this.excelspaltenimport.length>0) {
        valexceltabsfilter4=this.countOccurrences(valexceltabsfilter[1].namentabs);
      if (valexceltabsfilter4 === 4) {
        this.waehleVerfahren(7);
      }}
      
      else{
        if (this.excelspaltenimport.length>0){
          
          
        try {
            for (let i = 0, l = this.excelspaltenimport.length; i < l; i += 1) {
              let name = this.excelspaltenimport[i];
              if (name.Spaltenname === "ilat-nr." || name.Spaltenname === "llbb-nr" || 
                name.Spaltenname.includes("protokoll phytoplankton")) {
                if (name.Spaltenname.includes("protokoll phytoplankton")) {
                  this.loescheErste5Zeilen=true;
                }else{  this.loescheErste5Zeilen=false;}
                this.waehleVerfahren(6);break;}else  if
                //Phylib-Exportdatei  Prüfung anhand der Spaltennamen
                (name.Spaltenname === "makrophytentyp" || name.Spaltenname === "diatomeentyp" || 
                  name.Spaltenname.includes("makrophytenverödung")) {
                    this.waehleVerfahren(2);break;
                }//Pelodes-import
                else if(name.Spaltenname === "id_art")
                  { this.waehleVerfahren(3);break;}
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

  /**
   * Liest Spalten aus einer Excel-Arbeitsmappe und speichert sie im Array `excelspaltenimport`.
   * 
   * @param workbook - Das Excel-Arbeitsmappenobjekt, aus dem die Spalten gelesen werden sollen.
   * 
   * Die Methode iteriert durch jedes Blatt in der Arbeitsmappe, konvertiert die Blattdaten in JSON
   * und extrahiert die Spaltennamen aus der ersten Zeile jedes Blattes. Die Spaltennamen werden dann
   * zusammen mit dem entsprechenden Blattnamen im Array `excelspaltenimport` gespeichert.
   */
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
  /**
   * Filtert und verarbeitet Excel-Spalten basierend auf dem angegebenen Tabellennamen.
   * 
   * @param namentabs - Der Name der Excel-Tabelle, nach der die Spalten gefiltert werden sollen.
   * 
   * Diese Methode initialisiert das Array `VorhandeneVerfahren` als leeres Array.
   * Anschließend filtert sie das Array `valspalten` basierend auf dem Wert von `namentabs`.
   * Wenn `namentabs` "indifferent" ist, filtert sie `valspalten`, bei denen `name_exceltab` gleich `namentabs` ist.
   * Andernfalls filtert sie `valspalten`, bei denen `name_exceltab` nicht "indifferent" ist.
   * 
   * Die Methode protokolliert den Inhalt von `excelspaltenimport` in der Konsole und iteriert über jedes Element in `excelspaltenimport`.
   * Für jedes Element iteriert sie über jedes Element im gefilterten `valspaltenfiter`.
   * 
   * Sie setzt den Tabellennamen basierend auf dem Wert von `namentabs` und überprüft, ob die Spaltennamen und Tabellennamen übereinstimmen,
   * und ob der Name erforderlich ist. Wenn diese Bedingungen erfüllt sind, fügt sie die `verfahrens_id` zu `VorhandeneVerfahren` hinzu.
   * 
   * Schließlich protokolliert sie den Inhalt von `VorhandeneVerfahren` in der Konsole.
   */
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


/**
 * Berechnet den Durchschnitt der Zahlen im angegebenen Array.
 * Wenn das Array leer ist, wird 20 zurückgegeben.
 *
 * @param {number[]} myArray - Das Array von Zahlen, deren Durchschnitt berechnet werden soll.
 * @returns {number} Der Durchschnitt der Zahlen im Array, gerundet auf die nächste ganze Zahl.
 */

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
/**
 * Stellt eine Spalte innerhalb eines Tabs in einer Excel-Datei dar.
 * 
 * @interface TabSpalte
 * 
 * @property {string} Tabname - Der Name des Tabs.
 * @property {string} Spaltenname - Der Name der Spalte innerhalb des Tabs.
 */

interface TabSpalte {
        

Tabname: string;
Spaltenname: string;


}
