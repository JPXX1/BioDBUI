import { Injectable } from '@angular/core';
import { ImpPhylibServ } from './impformenphylib.service';
import * as XLSX from 'xlsx';
import { firstValueFrom } from 'rxjs';

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
  public tabs:number;



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
	async callvalexceltabs(): Promise<void> {
  this.valexceltabs = await firstValueFrom(this.impPhylibServ.getvalExceltabs());
  this.valverfahren = await firstValueFrom(this.impPhylibServ.getvalVerfahren());
  this.valspalten  = await firstValueFrom(this.impPhylibServ.getvalExcelSpalten());
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

  // 🔹 SheetNames kopieren, lowercase & alphabetisch sortieren
  const sortedSheetNames = [...workbook.SheetNames]
    .map(name => name.toLowerCase())
    .sort((a, b) => a.localeCompare(b, 'de')); // ASC, deutsch

  const l = sortedSheetNames.length;

  for (let i = 0; i < l; i++) {
    const tabNeu = sortedSheetNames[i];

    if (i + 1 < l) {
      if (i < 3) {
        tabsvier += tabNeu + ";";
      }
      if (i === 3) {
        tabsvier += tabNeu;
      }
      tabs += tabNeu + ";";
    } else {
      tabs += tabNeu;
      tabsvier += tabNeu;
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
 async ExcelTabsinArray(workbook): Promise<void> {
  await this.callvalexceltabs();
  
  this.sanitizeWorkbook(workbook);
  this.analysiereWorkbook(workbook);


  // ✅ Prüfung: erster Tab heißt "_Metadaten" und enthält "phytosee"
  if (this.pruefeMetadatenTab(workbook)) {
    return;
  }


  const valexceltabsfilter = this.valexceltabs.filter(
    exceltabs => exceltabs.anzahltabs === this.tabs
  );

  // Klarer als verschachtelte if/else:
  if (valexceltabsfilter.length === 0) {
    this.handleKeineVorlage();
    return;
  }

  if (valexceltabsfilter.length === 1) {
    this.handleEineVorlage(valexceltabsfilter[0]);
    return;
  }

  if (valexceltabsfilter.length > 1) {
    this.handleMehrereVorlagen(valexceltabsfilter);
    return;
  }
}

private pruefeMetadatenTab(workbook: XLSX.WorkBook): boolean {
  // Erster Tab-Name prüfen
  const ersterTabName = workbook.SheetNames[0];
  if (!ersterTabName || ersterTabName.toLowerCase() !== '_metadaten') {
    return false;
  }

  // Inhalt des ersten Tabs lesen
  const sheet = workbook.Sheets[ersterTabName];
  if (!sheet || !sheet['!ref']) {
    return false;
  }

  // Alle Zellwerte des Sheets durchsuchen
  const range = XLSX.utils.decode_range(sheet['!ref']);
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellRef];
      if (cell && cell.v != null) {
        const cellWert = String(cell.v).toLowerCase();

        if (cellWert.includes('phytosee')) {
          this.waehleVerfahren(5);
          return true;
        }

        if (cellWert.includes('phytofluss')) {
          this.waehleVerfahren(7);
          return true;
        }
      }
    }
  }

  return false;
}

private handleKeineVorlage(): void {
  if (this.excelspaltenimport.length === 0) return;

  for (const name of this.excelspaltenimport) {
    if (name.Spaltenname === "ilat-nr." || 
        name.Spaltenname === "llbb-nr." || 
        name.Spaltenname.includes("protokoll phytoplankton")) {
      this.loescheErste5Zeilen = name.Spaltenname.includes("protokoll phytoplankton");
      this.waehleVerfahren(6);
      return;
    }
  }
}

private handleEineVorlage(vorlage: any): void {
  switch (vorlage.ident_kriterium) {
    case 1:
      this.waehleVerfahren(vorlage.id_verfahren);
      break;

    case 2:
      const filter2 = [vorlage].filter(
        exceltabs => exceltabs.namentabs === this.Exceltabsimpalle
      );
      if (filter2.length === 1) {
        this.waehleVerfahren(filter2[0].id_verfahren);
      }
      break;

    case 4:
      this.ValExcelSpalten(vorlage.namentabs);
      this.NrVerfahren = this.ArrayAvg(this.VorhandeneVerfahren);
      break;

    case 5:
      if (this.countOccurrences(vorlage.namentabs) > 1) {
        this.NrVerfahren = vorlage.id_verfahren;
      }
      break;
  }
}

private handleMehrereVorlagen(vorlagen: any[]): void {
  const filter4count = this.countOccurrences(vorlagen[0].namentabs);
  const filterExakt = vorlagen.filter(
    exceltabs => exceltabs.namentabs === this.Exceltabsimpalle
  );

  if (filterExakt.length === 1) {
    this.waehleVerfahren(filterExakt[0].id_verfahren);
    return;
  }

  if (filter4count === 2) {
    this.waehleVerfahren(filterExakt[0].id_verfahren);
    return;
  }

  if (vorlagen.length === 2 && filter4count === 1 && this.excelspaltenimport.length > 0) {
    if (this.countOccurrences(vorlagen[1].namentabs) === 2) {
      this.waehleVerfahren(7);
      return;
    }
  }

  // Spaltennamen prüfen
  if (this.excelspaltenimport.length === 0) return;

  for (const name of this.excelspaltenimport) {
    if (name.Spaltenname === "ilat-nr." || 
        name.Spaltenname === "llbb-nr" || 
        name.Spaltenname.includes("protokoll phytoplankton")) {
      this.loescheErste5Zeilen = name.Spaltenname.includes("protokoll phytoplankton");
      this.waehleVerfahren(6);
      return;
    }
    if (name.Spaltenname === "makrophytentyp" || 
        name.Spaltenname === "diatomeentyp" || 
        name.Spaltenname.includes("makrophytenverödung")) {
      this.waehleVerfahren(2);
      return;
    }
    if (name.Spaltenname === "id_art") {
      this.waehleVerfahren(3);
      return;
    }
  }
}

  /**
   * Liest Spalten aus einer Excel-Arbeitsmappe und speichert sie im Array `excelspaltenimport`.
   * 
   * @param workbook - Das Excel-Arbeitsmappenobjekt, aus dem die Spalten gelesen werden sollen.
   * 
   * Die Methode iteriert durch jedes Blatt in der Arbeitsmappe, konvertiert die Blattdaten in JSON
   * und extrahiert die Spaltennamen aus der ersten Zeile jedes Blattes. Die Spaltennamen werden dann
   * zusammen mit dem entsprechenden Blattnamen im Array `excelspaltenimport` gespeichert.
   */
  spaltenauslesen(workbook) {

    this.excelspaltenimport = [];
  
    for (const sheetName of workbook.SheetNames) {
  
      const sheet = workbook.Sheets[sheetName];
  
//leere sheets (ohne Daten) überspringen

if (!sheet || !sheet['!ref']) {
  console.warn("Leeres Sheet übersprungen:", sheetName);
  continue;
}

const range = XLSX.utils.decode_range(sheet['!ref']);


      const headerRow = range.s.r; // meist 0
  
      for (let c = range.s.c; c <= range.e.c; c++) {
  
        const cellRef = XLSX.utils.encode_cell({ r: headerRow, c });
        const cell = sheet[cellRef];
  
        // ⛔ Abbruch bei erster leerer Spalte
        if (!cell || cell.v === undefined || cell.v === null || cell.v === '') {
          break;
        }
  
        this.excelspaltenimport.push({
          Spaltenname: String(cell.v).trim().toLowerCase(),
          Tabname: sheetName.toLowerCase()
        });
      }
    }
  }
  private analysiereWorkbook(workbook: XLSX.WorkBook) {

  this.excelspaltenimport = [];

  let tabs = "";
  let tabsvier = "";
  let validSheetNames: string[] = [];

  for (const sheetName of workbook.SheetNames) {

    const sheet = workbook.Sheets[sheetName];

    // 🔹 Leere Sheets überspringen
    if (!sheet || !sheet['!ref']) {
      console.warn("Leeres Sheet übersprungen:", sheetName);
      continue;
    }

    const range = XLSX.utils.decode_range(sheet['!ref']);

    // Optional: wirklich leere Sheets erkennen
    if (range.e.r === 0 && range.e.c === 0) {
      console.warn("Sheet ohne echte Daten:", sheetName);
      continue;
    }

    validSheetNames.push(sheetName.toLowerCase());

    const headerRow = range.s.r;

    for (let c = range.s.c; c <= range.e.c; c++) {

      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c });
      const cell = sheet[cellRef];

      if (!cell || cell.v == null || cell.v === '') {
        break;
      }

      this.excelspaltenimport.push({
        Spaltenname: String(cell.v).trim().toLowerCase(),
        Tabname: sheetName.toLowerCase()
      });
    }
  }

  // 🔹 Tabs alphabetisch sortieren
  const sortedSheetNames = validSheetNames
    .sort((a, b) => a.localeCompare(b, 'de'));

  const l = sortedSheetNames.length;

  for (let i = 0; i < l; i++) {

    const tabNeu = sortedSheetNames[i];

    if (i + 1 < l) {
      if (i < 3) tabsvier += tabNeu + ";";
      if (i === 3) tabsvier += tabNeu;
      tabs += tabNeu + ";";
    } else {
      tabs += tabNeu;
      tabsvier += tabNeu;
    }
  }

  this.tabs = l;
  this.ExceltabsimpVier = tabsvier;
  this.Exceltabsimpalle = tabs;
}

 /**
 * Sanitiert Excel-Sheets mit fehlerhaftem Used-Range (!ref).
 *
 * Hintergrund:
 * Manche Excel-Dateien enthalten ein kaputtes !ref (z. B. A1:AMJ1048576),
 * wodurch XLSX-Funktionen extrem langsam werden oder hängen.
 *
 * Strategie:
 * - Iteriert über alle Sheets (Sheetnamen sind variabel)
 * - Erkennt offensichtlich kaputte Used-Ranges
 * - Liest ausschließlich die Header-Zeile
 * - Bestimmt die letzte echte Spalte
 * - Verkleinert !ref auf den real genutzten Bereich
 *
 * Wichtig:
 * - Repariert NUR die In-Memory-Struktur (keine Änderung der Excel-Datei!)
 * - Sicher für Import-/Analyse-Zwecke
 * - Verändert keine Zellwerte
 *
 * @param workbook XLSX-Workbook-Objekt
 */

sanitizeWorkbook(workbook: XLSX.WorkBook) {

  for (const sheetName of workbook.SheetNames) {

    const sheet = workbook.Sheets[sheetName];
    if (!sheet || !sheet['!ref']) continue;

    const ref = sheet['!ref'];

    // Excel-Maximum → sicher kaputt
    if (!ref.includes('1048576')) continue;

    const range = XLSX.utils.decode_range(ref);
    const headerRow = range.s.r;

    let lastCol = range.s.c;
    let emptyCount = 0;

    for (let c = range.s.c; c <= range.e.c; c++) {

      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c });
      const cell = sheet[cellRef];

      if (!cell || cell.v === '' || cell.v == null) {
        emptyCount++;
        if (emptyCount >= 2) break;
        continue;
      }

      emptyCount = 0;
      lastCol = c;
    }

    // Neues, sauberes ref (nur Header-Zeile)
    sheet['!ref'] = XLSX.utils.encode_range({
      s: { r: headerRow, c: range.s.c },
      e: { r: headerRow, c: lastCol }
    });

    console.warn(`Sheet "${sheetName}" hatte kaputtes !ref → korrigiert`);
  }
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
