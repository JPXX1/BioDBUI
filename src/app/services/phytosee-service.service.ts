import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { XlsxImportPhylibService } from '../services/xlsx-import-phylib.service';
import { Uebersicht } from '../interfaces/uebersicht';
import { MessstellenImp } from '../interfaces/messstellen-imp';
import { Messwerte } from '../interfaces/messwerte';
import { ImpPhylibServ } from './impformenphylib.service';
import { firstValueFrom } from 'rxjs';
import { Taxonzus } from '../file-upload/klassen/taxonzus';
@Injectable({
  providedIn: 'root'
})
/**
 * Serviceklasse zur Handhabung verschiedener Operationen im Zusammenhang mit Phytosee.
 * 
 * Dieser Service bietet Methoden zum Abrufen und Verarbeiten von Daten aus verschiedenen Quellen,
 * einschließlich des Imports von Daten aus Excel-Arbeitsmappen und des Exports von Daten in spezifischen Formaten.
 * Er interagiert mit anderen Diensten wie `ImpPhylibServ` und `XlsxImportPhylibService`,
 * um seine Operationen durchzuführen.
 * 
 * @class
 * @name PhytoseeServiceService
 * 
 * @constructor
 * @param {ImpPhylibServ} impPhylibServ - Service zum Abrufen von Phylib-Daten.
 * @param {XlsxImportPhylibService} xlsxImportPhylibService - Service zum Importieren von Daten aus Excel-Dateien.
 * 
 * @property {any} arten - Speichert die abgerufenen Arten-Daten.
 * @property {Messwerte[]} messwerte - Array von Messwerte-Objekten.
 * @property {MessstellenImp[]} messstellenImp - Array von MessstellenImp-Objekten.
 * @property {Uebersicht[]} uebersicht - Array von Uebersicht-Objekten.
 * @property {Uebersicht} _uebersicht - Einzelnes Uebersicht-Objekt.
 * @property {any} formen - Speichert die abgerufenen Formen-Daten.
 * 
 * @method
 * @async
 * @name getFormen
 * @description Ruft "Formen"-Daten vom `impPhylibServ` Service ab und weist sie der `formen`-Eigenschaft zu.
 * Verwendet `firstValueFrom`, um das Observable in ein Promise zu konvertieren.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten abgerufen und zugewiesen wurden.
 * @throws Gibt eine Fehlermeldung in die Konsole aus, wenn der Abrufvorgang fehlschlägt.
 * 
 * @method
 * @async
 * @name callartenPhyto
 * @description Ruft asynchron die Methode `getArtenPhylibMP` vom `impPhylibServ` Service
 * mit einem festen Parameterwert von 5 auf. Setzt die `arten`-Eigenschaft auf den Wert, der vom Observable zurückgegeben wird.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Observable abgeschlossen ist.
 * 
 * @method
 * @async
 * @name PhytoseeLLBBimport
 * @description Importiert Daten aus einem Excel-Arbeitsbuch in das Phytosee-System.
 * @param {any} workbook - Das Excel-Arbeitsbuch, aus dem Daten importiert werden sollen.
 * @param {any} valspalten - Die zu validierenden Spalten.
 * @param {any} tab - Die Anzahl der zu verarbeitenden Blätter.
 * @param {number} verfahrennr - Die Verfahrensnummer.
 * @param {boolean} loescheErste5Zeilen - Ob die ersten 5 Zeilen des neuen LLBB-Formats gelöscht werden sollen.
 * @returns {Promise<string>} Ein Promise, das eine Zeichenkette zurückgibt, die das Ergebnis des Importvorgangs angibt.
 * @throws Wirft einen Fehler, wenn es Probleme mit den Daten gibt, wie z.B. ungültige Daten oder falsche Spaltenüberschriften.
 * 
 * @method
 * @async
 * @name Phytoflussexport
 * @description Exportiert Daten aus einem Workbook in ein spezifisches Format.
 * @param {any} workbook - Das Workbook-Objekt, das die zu exportierenden Daten enthält.
 * @param {any} valspalten - Ein Array von Objekten, die die zu verarbeitenden Spalten repräsentieren.
 * @param {any} tab - Die Tab-Nummer, die verarbeitet werden soll.
 * @param {number} verfahrennr - Die Verfahrensnummer, um die Spalten zu filtern.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Exportprozess abgeschlossen ist.
 * @remarks Diese Funktion verarbeitet die Workbook-Daten, indem sie die Spalten anhand der angegebenen Verfahrensnummer und des Tabs filtert.
 * Sie konvertiert das relevante Arbeitsblatt in JSON-Format und verarbeitet jede Zeile, um Daten zu extrahieren und zu transformieren.
 * Die transformierten Daten werden im `messstellenImp`-Array gespeichert, und verschiedene Servicemethoden werden aufgerufen, um die Daten zu verarbeiten.
 * 
 * @method
 * @async
 * @name Phytoseeexport
 * @description Exportiert Daten aus einem Workbook in ein spezifisches Format für Phytosee.
 * @param {any} workbook - Das Workbook-Objekt, das die zu exportierenden Daten enthält.
 * @param {any} valspalten - Ein Array von Objekten, die die zu verarbeitenden Spalten repräsentieren.
 * @param {any} tab - Der Tab-Identifikator für die Daten.
 * @param {number} verfahrennr - Die Verfahrensnummer, um die Spalten zu filtern.
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn der Exportprozess abgeschlossen ist.
 * @remarks Diese Funktion verarbeitet die Workbook-Daten, indem sie die Spalten anhand der angegebenen Verfahrensnummer und des Tab-Identifikators filtert.
 * Sie konvertiert das relevante Arbeitsblatt in JSON-Format und verarbeitet jede Zeile, um Daten zu extrahieren und zu transformieren.
 * Die transformierten Daten werden im `messstellenImp`-Array gespeichert und der `xlsxImportPhylibService.messstellenImp`-Eigenschaft zugewiesen.
 * Die Funktion behandelt auch spezifische Transformationen für bestimmte Parameter-IDs und verwaltet die Übersicht über Fehler und Importstatus.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class PhytoseeServiceService {

  constructor(private impPhylibServ: ImpPhylibServ, private xlsxImportPhylibService: XlsxImportPhylibService) { }
  public arten: any;
  public messwerte: Messwerte[];
  public messstellenImp: MessstellenImp[] = [];
  public uebersicht: Uebersicht[] = [];
  public _uebersicht: Uebersicht;
  public formen: any;
  /**
   * Ruft die "formen" Daten vom impPhylibServ Service ab und weist sie der `formen` Eigenschaft zu.
   * Verwendet `firstValueFrom`, um das Observable in ein Promise zu konvertieren.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Daten abgerufen und zugewiesen wurden.
   * @throws Wird eine Fehlermeldung in die Konsole ausgeben, wenn der Abrufvorgang fehlschlägt.
   */
  async getFormen() {
    try {
      // Using firstValueFrom to convert the observable to a promise
      this.formen = await firstValueFrom(this.impPhylibServ.getFormen());
      //console.log(this.formen);
    } catch (err) {
      // Asserting that err is an instance of Error
      const errorMessage = (err as Error).message;

      console.error('Error fetching formen:', errorMessage);
    }
  }
  /**
   * Ruft asynchron die Methode `getArtenPhylibMP` vom `impPhylibServ` Service
   * mit einem festen Parameterwert von 5 auf. Die Methode setzt die `arten`-Eigenschaft
   * auf den Wert, der vom Observable zurückgegeben wird.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn das Observable abgeschlossen ist.
   */
  async callartenPhyto() {
    this.arten = null;
    // this.workbookInit(datum,Probenehmer)
    await this.impPhylibServ.getArtenPhylibMP(5).forEach(value => {
      this.arten = value;
      // console.log('observable -> ' + value);
    });
  }

  /**
   * Importiert Daten aus einem Excel-Arbeitsbuch in das Phytosee-System.
   * 
   * @param workbook - Das Excel-Arbeitsbuch, aus dem Daten importiert werden sollen.
   * @param valspalten - Die zu validierenden Spalten.
   * @param tab - Die Anzahl der zu verarbeitenden Blätter.
   * @param verfahrennr - Die Verfahrensnummer.
   * @param loescheErste5Zeilen - Ob die ersten 5 Zeilen des neuen LLBB-Formats gelöscht werden sollen.
   * @returns Ein Promise, das eine Zeichenkette zurückgibt, die das Ergebnis des Importvorgangs angibt.
   * 
   * @throws Wird einen Fehler auslösen, wenn es Probleme mit den Daten gibt, wie z.B. ungültige Daten oder falsche Spaltenüberschriften.
   */
  async PhytoseeLLBBimport(workbook, valspalten: any, tab: any, verfahrennr: number, loescheErste5Zeilen: boolean): Promise<string> {

    // console.log('observable -> ' + value);
    this.getFormen();
    this.uebersicht = [];
    this.xlsxImportPhylibService.MessDataOrgi = [];
    this.xlsxImportPhylibService.displayColumnNames = [];
    this.xlsxImportPhylibService.dynamicColumns = [];
    this.xlsxImportPhylibService.MessDataImp = [];
    this.xlsxImportPhylibService.messstellenImp = [];
    this.xlsxImportPhylibService.messstellenImp = [];
    //let reader = new FileReader();

    // var sheets;
    let Messstelle: string; var Probe; var Taxon; var Form; var Messwert; var Einheit; var Tiefe; var cf; let RLD;
    let aTaxonzusatz: string; let aMessstelle: string; let aParameter: string; let aProbe: string; let aTaxon; let aForm: string; let aMesswert; let aEinheit; let aTiefe; let acf;
    // var Oekoregion; var Makrophytenveroedung; var Begruendung; var Helophytendominanz; var Diatomeentyp; var Phytobenthostyp; var Makrophytentyp; var WRRLTyp; var Gesamtdeckungsgrad; var Veggrenze;
    let bidmst; let bideinh; let bwert;
    let importp: string; let mstOK: string; let ok: string; let typ: string; let nutzung: string; let taxaliste: string;
    let FehlerInfo: string = "Import erfolgreich";
    let datum: Date;
    let einh1: string = '6';
    let einh2: string = '7';
    let einh3: string = '9';
    let einh4: string = '8';

    let para_id1: number = 2;
    let para_id2: number = 3;
    let para_id3: number = 4;
    let para_id4: number = 5;
    let gewaesser: string;
    let XL_row_object;
    let json_Messstelle;
    let mst_alt: string;
    let abundanz: string; let biovolKonz: string; let spezBioVoll: string; let relBioVol: string;
    let mst: string;
    this.arten = [];

    await this.xlsxImportPhylibService.holeMst();
    await this.callartenPhyto();

    try {
      for (let i = 0; i < tab; i++) {

        //console.log(workbook.SheetNames[i]);
        XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
        json_Messstelle = JSON.stringify(XL_row_object);
        const obj1 = JSON.parse(json_Messstelle);
        if (obj1 !== null) {
          // Entferne die ersten 5 Zeilen wenn neues LLBB-Format
          if (loescheErste5Zeilen === true) {
            obj1.splice(0, 5);
            const headers = obj1[0];

            // Konvertiere das restliche Objekt zurück in ein JSON-Objekt mit den neuen Überschriften
            XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]], { header: headers, range: 5 });
            // XL_row_object=data;
            json_Messstelle = JSON.stringify(XL_row_object);

          }

          const obj = JSON.parse(json_Messstelle);
          // abundaz, Biovolumen, Zellzahl etc. finden

          let head_1 = findKeyWithIncludes(obj[0], "abundanz");
          let head_2 = findKeyWithIncludes(obj[0], "biovolumenkonzentration");
          let head_3 = findKeyWithIncludes(obj[0], "spezifisch");
          let head_4 = findKeyWithIncludes(obj[0], "relativ");
          if (head_1 === null) { head_1 = findKeyWithIncludes(obj[0], "zellzahl"); }
          if (head_2 === null) { head_2 = findKeyWithIncludes(obj[0], "biovol"); }
          if (head_3 === null) { head_3 = findKeyWithIncludes(obj[0], "zellvol"); }
          if (head_4 === null) { head_4 = findKeyWithIncludes(obj[0], "bv"); }
          //abundanz=obj[index]['Zellzahl (Zellen mL-1)']; biovolKonz=obj[index]['Biovol. (mm3L-1)']; spezBioVoll=obj[index]['Zellvol. (µm³)']; relBioVol=obj[index]['% BV'];


          if (head_1 !== null && head_2 !== null && head_3 !== null && head_4 !== null) {
            // console.log(this.uebersicht);
            // Here is your object
            let o: number = 1;
            obj.forEach((val, index) => {
              if (obj[index] !== null) {//index=Zeilennummer der Exceltabelle
                // for (var i in obj[index]) { //i=Spaltenüberschrift der Exceltabelle
                if (index > 0) {
                  //console.log(val + " / " + obj[index][i] + ": " + i);
                  // console.log(obj.length)
                  o = o + 1;


                  abundanz = null; biovolKonz = null; spezBioVoll = null; relBioVol = null;
                  const datumString: string = excelDateToJSDate(obj[index]['Datum']); // Beispiel: '2023-10-01'
                  // Überprüfe, ob das Datum ungültig ist
                  if (datumString === "Ungültiges Datum") {
                    FehlerInfo = "Fehler: ungültiges Datum in Exceltabelle";
                    throw new Error(FehlerInfo);
                  }
                  // Konvertiere das Datum in eine Date-Instanz
                  const datum: Date = new Date(datumString);

                  gewaesser = obj[index]['Gewässer'];
                  mst = obj[index]['Messstelle'];
                  if (mst === undefined) { mst = obj[index]['Messtelle']; }
                  if (mst.startsWith('O')) {
                    aMessstelle = mst.substring(1);
                  } else {
                    aMessstelle = mst;
                  }


                  let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst == aMessstelle);

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

                  this._uebersicht = {} as Uebersicht;
                  if (mst !== undefined) {
                    if (mstOK === "checked") { importp = ""; } else {
                      importp = "checked";
                    }

                  }

                  Form = 6; //(ohne Taxonzus)
                  aTaxonzusatz = undefined;
                  //neue Importtabelle
                  //if (loescheErste5Zeilen === true) {

                  abundanz = obj[index][head_1]; biovolKonz = obj[index][head_2]; spezBioVoll = obj[index][head_3]; relBioVol = obj[index][head_4];
                  //Taxonzusatz des Phytoplanktons 5-10µm, ...
                  aTaxonzusatz = obj[index]['Taxonzusatz'];


                  if (aTaxonzusatz !== undefined) {
                    // Angenommen, this.formen ist ein Array von Objekten und aTaxonzusatz ist die Variable, mit der verglichen wird
                    aTaxonzusatz = aTaxonzusatz.replace(/\s+/g, '');
                    // console.log(this.formen);
                    // Filtere die Elemente aus this.formen, deren importname mit aTaxonzusatz übereinstimmt
                    const gefilterteFormen = this.formen.filter(form => aTaxonzusatz.includes(form.importname) && form.id_taxonzus > 6);

                    // Ausgabe der gefilterten Elemente
                    if (gefilterteFormen.length > 0) {
                      Form = gefilterteFormen[0].id_taxonzus;
                    }

                    //ergänzen 10-15µm...
                  }

                  //alte Importtabelle   
                  //  } else{


                  // abundanz=obj[index][head_1]; biovolKonz=obj[index][head_2]; spezBioVoll=obj[index][head_3]; relBioVol=obj[index][head_4];

                  Taxon = obj[index]['Taxon'];
                  if (Taxon.includes("<")) {
                    // console.log(Taxon);
                  }

                  let koi = Taxon.toLowerCase();
                  koi = koi.replace(/\s+/g, '');
                  // koi = koi.replace(/\./g, ',');
                  const gefilterteFormen = this.formen.filter(form => koi.includes(form.importname) && form.id_taxonzus > 6);
                  if (gefilterteFormen.length > 0) {
                    Form = gefilterteFormen[0].id_taxonzus;
                    aTaxonzusatz = gefilterteFormen[0].importname;
                    // console.log(aTaxonzusatz);
                  }
                  // }



                  // einh1=6;einh2=7;einh3=9;einh4=8;

                  aParameter = 'Zellzahl';
                  Messwert = abundanz;
                  aTiefe = 0;
                  aProbe = '-';
                  aForm = '-';
                  aEinheit = 'm/L';
                  //für array und  this.MessDataImp (ImortMesswerte)
                  Einheit = einh1;
                  //Form=6;
                  Probe = 11;
                  Tiefe = 1;
                  cf = false;
                  if (Messwert > 0) {
                    Taxon = obj[index]['DV-Nr.'];
                    if (Taxon !== undefined) { // zummengefasste Taxa z.B.SummeKlasse Bacillariophyceae


                      let taxon_ = this.arten.filter(arten => arten.dvnr == Taxon);
                      if (taxon_.length > 0) {
                        Taxon = taxon_[0].id_taxon;
                        aTaxon = taxon_[0].taxon; RLD = taxon_[0].rld;

                        if (aTaxonzusatz !== undefined) {

                          aTaxon = aTaxon + '/ ' + aTaxonzusatz;
                          // console.log(aTaxon);
                        }
                        ok = "";
                      }
                      else {
                        ok = "checked";
                        aTaxon = Taxon + '/ ' + obj[index]['TAXON_NAME'] + ' nicht bekannt';
                        // var taxon2 = this.arten.filter(arten => arten.dvnr == Taxon);
                        // if (taxon2.length !== 0) { aTaxon = taxon2[0].taxon; ok=false;}

                      }
                      importp = "checked";
                      if (ok === "checked" || mstOK === "checked") { importp = ""; }

                      this._uebersicht = {} as Uebersicht;
                      this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Datum: datumString, _Probe: aProbe, _Taxon: aTaxon, _Parameter: aParameter, _Form: Form, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1, _RoteListeD: RLD });

                      this.xlsxImportPhylibService.MessDataImp.push({ _Nr: o, _Messstelle: mst, _Datum: datumString, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: abundanz, _Einheit: einh1, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 2, _RoteListeD: RLD });
                      this.xlsxImportPhylibService.MessDataImp.push({ _Nr: o, _Messstelle: mst, _Datum: datumString, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: biovolKonz, _Einheit: einh2, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 3, _RoteListeD: RLD });
                      this.xlsxImportPhylibService.MessDataImp.push({ _Nr: o, _Messstelle: mst, _Datum: datumString, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: spezBioVoll, _Einheit: einh3, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 4, _RoteListeD: RLD });
                      this.xlsxImportPhylibService.MessDataImp.push({ _Nr: o, _Messstelle: mst, _Datum: datumString, _Tiefe: Tiefe, _Probe: Probe, _Taxon: Taxon, _Form: Form, _Messwert: relBioVol, _Einheit: einh4, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 5, _RoteListeD: RLD });


                    } else {
                      //Algenklassen je Mst und PN-Datum werden in Data_Abiotik gespeichert
                      aTaxon = obj[index]['Taxon'];

                      const gefilterteFormen = this.formen.filter(form => aTaxon.includes(form.importname));
                      if (gefilterteFormen.length > 0) {
                        para_id1 = 80;
                        aTaxonzusatz = gefilterteFormen[0].id_taxonzus;
                        if (aTaxonzusatz.length > 0) {
                          para_id1 = phytoKlassen(aTaxonzusatz);
                          this.xlsxImportPhylibService.messstellenImp.push({ id_mst: bidmst, datum: datumString, id_einh: 13, id_para: para_id1, wert: Messwert, id_import: null, id_pn: null, uebersicht: this._uebersicht });

                        }





                      }

                      this._uebersicht.mst = aMessstelle; this._uebersicht.fehler1 = mstOK;
                      this._uebersicht.fehler2 = ok; this._uebersicht.fehler3 = ""; this._uebersicht.import1 = importp;
                      this.xlsxImportPhylibService._uebersicht = this._uebersicht;
                      this.xlsxImportPhylibService.schalteSpalte('sp3', gewaesser);
                      this.xlsxImportPhylibService.groupNAch();
                      Messstelle = null; Probe = null; Taxon = null; Form = null; Messwert = null; Einheit = null; Tiefe = null; cf = null; ok = ""; mstOK = ""; RLD = null;
                      aMessstelle = null; aProbe = null; aTaxon = null; aForm = null; aMesswert = null; aEinheit = null; aTiefe = null; acf = null;
                      // this._uebersicht.mst=i;this._uebersicht.fehler1=mstOK;this._uebersicht.fehler2="";this._uebersicht.fehler3="";

                    }


                  }








                }
              }

            })
          } else {
            FehlerInfo = "Fehler: falsche Spaltenüberschriften in Exceltabelle";
            throw new Error(FehlerInfo);

          }
        }

        //of(array);



        //  this.xlsxImportPhylibService.MessDataImp = array;
      }
      // console.log(this.xlsxImportPhylibService.MessDataImp); 
      this.uebersicht = this.xlsxImportPhylibService.uebersicht; return FehlerInfo;

    } catch (error) {
      // Fehlerbehandlung
      // console.log(this.xlsxImportPhylibService.MessDataImp);
      return FehlerInfo;
    }
  }



  /**
* Exportiert Daten aus einem Workbook in ein spezifisches Format.
* 
* @param workbook - Das Workbook-Objekt, das die zu exportierenden Daten enthält.
* @param valspalten - Ein Array von Objekten, die die zu verarbeitenden Spalten repräsentieren.
* @param tab - Die Tab-Nummer, die verarbeitet werden soll.
* @param verfahrennr - Die Verfahrensnummer, um die Spalten zu filtern.
* 
* @returns Ein Promise, das sich auflöst, wenn der Exportprozess abgeschlossen ist.
* 
* @Bemerkungen
* Diese Funktion verarbeitet die Workbook-Daten, indem sie die Spalten anhand der angegebenen Verfahrensnummer und des Tabs filtert.
* Anschließend wird das relevante Arbeitsblatt in JSON-Format konvertiert und jede Zeile wird bearbeitet, um Daten zu extrahieren und zu transformieren.
* Die transformierten Daten werden im `messstellenImp`-Array gespeichert, und verschiedene Servicemethoden werden aufgerufen, um die Daten zu verarbeiten.
* 
* @Beispiel
* ```typescript
* const workbook = ...; // Workbook laden oder erstellen
* const valspalten = [...]; // Zu verarbeitende Spalten definieren
* const tab = 1; // Tab-Nummer angeben
* const verfahrennr = 123; // Verfahrensnummer angeben
* 
* await Phytoflussexport(workbook, valspalten, tab, verfahrennr);
* ```
*/

  async Phytoflussexport(workbook, valspalten: any, tab: any, verfahrennr: number) {
    await this.xlsxImportPhylibService.holeMst();
    // console.log(this.xlsxImportPhylibService.mst);
    this.xlsxImportPhylibService.displayColumnNames = [];
    this.xlsxImportPhylibService.dynamicColumns = [];
    this.messstellenImp = [];
    let mstee2=[];
    let mstArray = [];
    let XL_row_object;
    let json_Messstelle; let jahr: string | undefined;
    let mstOK: string;
    let bidmst;
    let bidpara1; let bideinh1; let bwert1;
    let bidpara2; let bideinh2; let bwert2;
    const namespalteng0: string = 'sp3';
    const namespalteng1: string = 'sp4';
    const namespalteng2: string = 'sp5';
    // const valrowsfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 4 && excelspalten.id_tab === tab);


    //  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);




    const sheetName = 'gesamtbewertung';

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
      mstee2=[];mstArray=[]
      this._uebersicht = {} as Uebersicht;
      if (obj[index] !== null) {
        for (var i in obj[index]) {
          // bwert=obj[index][i];
          // const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => i.includes(excelspalten.spalten_name));

          // Überprüft, ob die Spalte 'Jahr' existiert, bevor sie zugewiesen wird
          if ('Jahr' in obj[index]) {
            jahr = obj[index]['Jahr'];
          } else {
            // Setzt jahr auf undefined
            jahr = undefined;
          }

          let mst = obj[index]['Gewässername'];
          if (mst === null) { let mst = obj[index]['GewässernameWB']; }
          mstArray.push(mst);
          this._uebersicht.sp3 = mst;
          let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst === mst);

          if (mstee.length > 0) {
            this._uebersicht.mst = mstee[0].namemst;
            bidmst = mstee[0].id_mst;
            mstOK = "";
          }

          

          else {
            // Filtere die Messstellen basierend auf den Bedingungen in name_synonym
            mstee2 = this.xlsxImportPhylibService.mst.filter(messstellen => {
              const nameSynonym = messstellen.name_synonym;
          
              // Überprüfe, ob name_synonym nicht null ist
              if (!nameSynonym) {
                return false;
              }
          
              // Teile name_synonym am Komma und entferne Leerzeichen
              const parts = nameSynonym.split(',').map(part => part.trim());
          
              // Wenn es keine Teile gibt, filtere diese Messstelle aus
              if (parts.length === 0) {
                return false;
              }
          
              // Prüfe, ob alle Wörter in irgendeiner Messstelle in mstArray vorkommen
              const allWordsExist = parts.every(word => mstArray.some(m => m && m.includes(word)));
          
              // Nur wenn alle Wörter existieren, wird die Messstelle beibehalten
              return allWordsExist;
            });
          }
            // Wenn mindestens eine passende Messstelle gefunden wurde
            if (mstee2.length > 0) {
              // Setze die Übersicht auf die erste gefundene Messstelle
              this._uebersicht.mst = mstee2[0].namemst;
              bidmst = mstee2[0].id_mst;
              mstOK = "";
            } else {
              // Wenn keine passende Messstelle gefunden wurde, setze die Übersicht auf mst
              this._uebersicht.mst = mst;
            }



            // let mstee2 = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.name_synonym === mst);
            if (mstee2.length > 0) {
              this._uebersicht.mst = mstee2[0].namemst;
              bidmst = mstee2[0].id_mst;
              mstOK = "";
            } else {
              this._uebersicht.mst = mst
              mstOK = "checked"; bidmst = null;
            }
          
        }

          bwert1 = obj[index]['Gesamtindex'];
          bideinh1 = '13';
          bidpara1 = '104';
          this._uebersicht.jahr = jahr;
         
          this._uebersicht.sp4 = bwert1;

          bwert2 = bewertung_als_zahl(obj[index]['Verbale Bewertung']);
          bidpara2 = '94'
          bideinh2 = '13'
          this._uebersicht.sp5 = obj[index]['Verbale Bewertung'];








          // this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });




          this._uebersicht.fehler1 = mstOK; this._uebersicht.fehler2 = ""; this._uebersicht.fehler3 = "";
          if (mstOK === "checked") { this._uebersicht.import1 = ""; } else { this._uebersicht.import1 = "checked"; }


          //wenn ein Jahr vorhanden ist wird es in die MessstellenImp eingetragen
          if (jahr !== 'undefined') {
            this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh1, id_para: bidpara1, wert: bwert1, id_import: null, id_pn: null, uebersicht: this._uebersicht, jahr: jahr });
            this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh2, id_para: bidpara2, wert: bwert2, id_import: null, id_pn: null, uebersicht: this._uebersicht, jahr: jahr });
          }



          else {
            this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh1, id_para: bidpara1, wert: bwert1, id_import: null, id_pn: null, uebersicht: this._uebersicht });
            this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh2, id_para: bidpara2, wert: bwert2, id_import: null, id_pn: null, uebersicht: this._uebersicht });
            // this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null,uebersicht:this._uebersicht });
          }

          this.xlsxImportPhylibService._uebersicht = this._uebersicht;
          this.xlsxImportPhylibService.schalteSpalte(namespalteng0, this._uebersicht.sp3, jahr);
          this.xlsxImportPhylibService.schalteSpalte(namespalteng1, bwert1, jahr);
          this.xlsxImportPhylibService.schalteSpalte(namespalteng2, bwert2, jahr);
          this.xlsxImportPhylibService.groupNAch();





        
      }
    })
    //console.log(this.messstellenImp)

    this.xlsxImportPhylibService.messstellenImp = this.messstellenImp;

  }
  /**
   * Exportiert Daten aus einem Workbook in ein spezifisches Format für Phytosee.
   * 
   * @param workbook - Das Workbook-Objekt, das die zu exportierenden Daten enthält.
   * @param valspalten - Ein Array von Objekten, die die zu verarbeitenden Spalten repräsentieren.
   * @param tab - Der Tab-Identifikator für die Daten.
   * @param verfahrennr - Die Verfahrensnummer, um die Spalten zu filtern.
   * 
   * @returns Ein Promise, das sich auflöst, wenn der Exportprozess abgeschlossen ist.
   * 
   * @Bemerkungen
   * Diese Funktion verarbeitet die Workbook-Daten, indem sie die Spalten anhand der angegebenen Verfahrensnummer
   * und des Tab-Identifikators filtert. Anschließend wird das relevante Arbeitsblatt in JSON-Format konvertiert und
   * jede Zeile wird bearbeitet, um Daten zu extrahieren und zu transformieren. Die transformierten Daten werden im
   * `messstellenImp`-Array gespeichert und der `xlsxImportPhylibService.messstellenImp`-Eigenschaft zugewiesen.
   * 
   * Die Funktion behandelt auch spezifische Transformationen für bestimmte Parameter-IDs und verwaltet die Übersicht
   * über Fehler und Importstatus.
   * 
   * @Beispiel
   * ```typescript
   * const workbook = ...; // Workbook laden oder erstellen
   * const valspalten = [...]; // Zu verarbeitende Spalten definieren
   * const tab = 1; // Tab-Identifikator angeben
   * const verfahrennr = 123; // Verfahrensnummer angeben
   * 
   * await Phytoseeexport(workbook, valspalten, tab, verfahrennr);
   * ```
   */
  async Phytoseeexport(workbook, valspalten: any, tab: any, verfahrennr: number) {
    await this.xlsxImportPhylibService.holeMst();
    // console.log(this.xlsxImportPhylibService.mst);
    this.xlsxImportPhylibService.displayColumnNames = [];
    this.xlsxImportPhylibService.dynamicColumns = [];
    this.messstellenImp = [];

    let XL_row_object;
    let json_Messstelle; let jahr: string | undefined;
    let mstOK: string;
    let bidmst; let bidpara; let bideinh; let bwert;

    // const valrowsfiteranzeige = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.anzeige_tab2_tab1 === 4 && excelspalten.id_tab === tab);


    //  const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);
    const valspaltenfiter = valspalten.filter(excelspalten => excelspalten.id_verfahren === verfahrennr && excelspalten.import_spalte === true);



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

      this._uebersicht = {} as Uebersicht;
      if (obj[index] !== null) {
        for (var i in obj[index]) {
          bwert = obj[index][i];
          const valspaltenfiter2 = valspaltenfiter.filter(excelspalten => i.includes(excelspalten.spalten_name));
          if (valspaltenfiter2.length === 1) {
            // Überprüft, ob die Spalte 'Jahr' existiert, bevor sie zugewiesen wird
            if ('Jahr' in obj[index]) {
              jahr = obj[index]['Jahr'];
            } else {
              // Setzt jahr auf undefined
              jahr = undefined;
            }

            let mst = obj[index]['Gewässername'];
            if (mst === null) { let mst = obj[index]['GewässernameWB']; }
            let mstee = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.namemst === mst);

            if (mstee.length > 0) {
              this._uebersicht.mst = mstee[0].namemst;
              bidmst = mstee[0].id_mst;
              mstOK = "";
            }



            else {

              let mstee2 = this.xlsxImportPhylibService.mst.filter(messstellen => messstellen.name_synonym === mst);
              if (mstee2.length > 0) {
                this._uebersicht.mst = mstee2[0].namemst;
                bidmst = mstee2[0].id_mst;
                mstOK = "";
              } else {
                this._uebersicht.mst = mst
                mstOK = "checked"; bidmst = null;
              }
            }





            bidpara = valspaltenfiter2[0].id_para;

            bwert = obj[index][i];

            if (bidpara === '94') {
              bwert = bewertung_als_zahl(bwert);
            }

            bideinh = valspaltenfiter2[0].id_einheit;



            if (valspaltenfiter2[0].anzeige_tab2_tab1 === 1) {






            }





            // this.xlsxImportPhylibService.MessDataOrgi.push({ _Nr: o, _Messstelle: aMessstelle, _Tiefe: aTiefe, _Probe: aProbe, _Taxon: aTaxon, _Form: aForm, _Messwert: Messwert, _Einheit: aEinheit, _cf: cf, MstOK: mstOK, OK: ok, _AnzahlTaxa: 1, _idAbundanz: 1,_RoteListeD:RLD });




            this._uebersicht.fehler1 = mstOK; this._uebersicht.fehler2 = ""; this._uebersicht.fehler3 = "";
            if (mstOK === "checked") { this._uebersicht.import1 = ""; } else { this._uebersicht.import1 = "checked"; }


            //wenn ein Jahr vorhanden ist wird es in die MessstellenImp eingetragen
            if (jahr !== 'undefined') {
              this.messstellenImp.push({ id_mst: bidmst, datum: null, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null, uebersicht: this._uebersicht, jahr: jahr });
            }
            else {
              this.messstellenImp.push({ id_mst: bidmst, datum: jahr, id_einh: bideinh, id_para: bidpara, wert: bwert, id_import: null, id_pn: null, uebersicht: this._uebersicht });
            }

            this.xlsxImportPhylibService._uebersicht = this._uebersicht;
            this.xlsxImportPhylibService.schalteSpalte(valspaltenfiter2[0].namespalteng, bwert, jahr);

            this.xlsxImportPhylibService.groupNAch();
          }




        }
      }
    })
    //console.log(this.messstellenImp)

    this.xlsxImportPhylibService.messstellenImp = this.messstellenImp;
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
/**
 * Konvertiert eine Excel-Datumszahl in eine JavaScript-Datumszeichenkette im Format "DD.MM.YYYY".
 * 
 * @param {number} excelDate - Die zu konvertierende Excel-Datumszahl.
 * @returns {string} Die konvertierte Datumszeichenkette im Format "DD.MM.YYYY". Wenn das Datum ungültig ist, wird "Ungültiges Datum" zurückgegeben.
 */
function excelDateToJSDate(excelDate: number): string {
  const excelEpoch = new Date(1899, 11, 30); // Excel epoch start date
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000); // 86400000 ms in a day

  // Überprüfe, ob das Datum gültig ist
  if (isNaN(jsDate.getTime())) {
    return "Ungültiges Datum";
  }

  const day = String(jsDate.getDate()).padStart(2, '0'); // Tag mit führender Null
  const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Monat mit führender Null (Monate sind 0-basiert)
  const year = jsDate.getFullYear();

  return `${day}.${month}.${year}`;
}
function phytoKlassen(taxon: string): number {
  let para_id: number;

  // Überprüft, ob der Taxon-Name "Bacillariophyceae" enthält
  if (taxon.includes("Bacillariophyceae")) {
    para_id = 97;

  }


  // Überprüft, ob der Taxon-Name "Chlorophyceae" enthält
  else if (taxon.includes("Chlorophyceae")) {
    para_id = 98;

  }
  // Überprüft, ob der Taxon-Name "Cyanophyceae" enthält
  else if (taxon.includes("Chrysophyceae")) {
    para_id = 99;

  }
  // Überprüft, ob der Taxon-Name "Diatomeen" enthält
  else if (taxon.includes("Conjugatophyceae")) {
    para_id = 100;
  }
  // Überprüft, ob der Taxon-Name "Dinophyceae" enthält
  else if (taxon.includes("Cryptophyceae")) {

    para_id = 101;
  }
  // Überprüft, ob der Taxon-Name "Dinophyceae" enthält
  else if (taxon.includes("Euglenophyceae")) {

    para_id = 102;
  }
  else if (taxon.includes("Gesamt-Phytoplankton")) {
    para_id = 103;
  }


  // Gibt die Algenklasse zurück
  return para_id;
} 
/**
 * Funktion, um den passenden Schlüssel zu finden: Sucht nach einem Schlüssel im angegebenen Objekt, der die angegebene Suchzeichenfolge enthält.
 * 
 * @param obj - Das Objekt, in dem gesucht werden soll.
 * @param searchString - Die Zeichenfolge, nach der in den Schlüsseln des Objekts gesucht werden soll.
 * @returns Der erste Schlüssel, der die Suchzeichenfolge enthält, oder null, wenn kein solcher Schlüssel gefunden wird.
 */

function findKeyWithIncludes(obj, searchString) {
  const keys = Object.keys(obj);
  for (const key of keys) {

    const koi = key.toLowerCase();
    if (koi.includes(searchString)) {
      return key;
    }
  }
  return null;
}