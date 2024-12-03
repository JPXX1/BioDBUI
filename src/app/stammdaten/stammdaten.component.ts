import { Component ,OnInit,ViewChild,AfterViewInit,AfterViewChecked} from '@angular/core';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import {StammMessstellenComponent} from './stamm-messstellen/stamm-messstellen.component';
import { MessstellenStam } from 'src/app/shared/interfaces/messstellen-stam';
import {StammWkComponent} from './stamm-wk/stamm-wk.component';
import { MatSort,Sort} from '@angular/material/sort';
import { WasserkoerperStam } from 'src/app/shared/interfaces/wasserkoerper-stam';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import {CommentService} from 'src/app/shared/services/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HelpService } from 'src/app/shared/services/help.service';

@Component({
  selector: 'app-stammdaten',
  templateUrl: './stammdaten.component.html',
  styleUrls: ['./stammdaten.component.css']
})
/**
 * Die `StammdatenComponent` Klasse ist verantwortlich für die Verwaltung und Anzeige verschiedener Datentypen im Zusammenhang mit "Messstellen" und "Wasserkoerper".
 * Sie implementiert Angular-Lebenszyklus-Hooks, um Initialisierung und Ansichtsaktualisierungen zu handhaben, und bietet Methoden zum Sortieren, Filtern und Aktualisieren von Daten.
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {AfterViewChecked}
 * 
 * @property {boolean} TypWrrlAnzeige - Flag, das angibt, ob der WRRL-Typ angezeigt wird.
 * @property {boolean} ProbenehmerAnzeige - Flag, das angibt, ob der Probenehmer angezeigt wird.
 * @property {boolean} isHelpActive - Flag, das angibt, ob die Hilfe aktiv ist.
 * @property {boolean} seefliess - Flag, das den Typ des Gewässers angibt.
 * @property {MessstellenStam[]} messstellenStam1 - Array von "Messstellen"-Daten.
 * @property {WasserkoerperStam[]} wkStam1 - Array von "Wasserkoerper"-Daten.
 * @property {boolean} MessstellenAnzeige - Flag, das angibt, ob "Messstellen" angezeigt werden.
 * @property {boolean} WKAnzeige - Flag, das angibt, ob "Wasserkoerper" angezeigt werden.
 * @property {boolean} GewaesserAnzeige - Flag, das angibt, ob "Gewaesser" angezeigt werden.
 * @property {MessstellenStam[]} sortedData - Array von sortierten "Messstellen"-Daten.
 * @property {WasserkoerperStam[]} sortedDataWK - Array von sortierten "Wasserkoerper"-Daten.
 * @property {string} gewaesserart - Typ des Gewässers.
 * @property {boolean} PPTypAnzeige - Flag, das angibt, ob der PP-Typ angezeigt wird.
 * @property {boolean} DiaTypAnzeige - Flag, das angibt, ob der Dia-Typ angezeigt wird.
 * @property {boolean} MpTypAnzeige - Flag, das angibt, ob der MP-Typ angezeigt wird.
 * @property {string} helpText - Text für Hilfeinformationen.
 * 
 * @method sortData - Sortiert die "Messstellen"-Daten basierend auf den angegebenen Sortierkriterien.
 * @method ngAfterViewChecked - Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular die Ansicht der Komponente vollständig überprüft hat.
 * @method ngAfterViewInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht der Komponente vollständig initialisiert wurde.
 * @method new - Erstellt eine neue "Messstelle" und aktualisiert das "messstellenStam1"-Array.
 * @method sortDataWk - Sortiert die "Wasserkoerper"-Daten basierend auf den angegebenen Sortierkriterien.
 * @method ngOnInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular alle datengebundenen Eigenschaften initialisiert hat.
 * @method seeMst - Behandelt die Sichtbarkeit und das Abrufen von Daten für "Messstellen".
 * @method gewaesser1 - Behandelt die Anzeige-Logik für den "Gewaesser"-Abschnitt.
 * @method wrrlTyp - Aktualisiert die Anzeige-Flags, um den WRRL-Typ-Abschnitt anzuzeigen.
 * @method probenehmer - Schaltet die Sichtbarkeit verschiedener UI-Komponenten um, um den Probenehmer-Abschnitt anzuzeigen.
 * @method mpTyp - Behandelt die Anzeige-Logik für den MP-Typ-Abschnitt.
 * @method diaTyp - Aktualisiert die Sichtbarkeit verschiedener UI-Komponenten, um den Dia-Typ-Abschnitt anzuzeigen.
 * @method ppTyp - Aktualisiert die Sichtbarkeit verschiedener UI-Komponenten, um den PP-Typ-Abschnitt anzuzeigen.
 * @method fgwWk - Behandelt die Anzeige- und Aktualisierungslogik für "Fließgewässer".
 * @method seeWk - Behandelt die Anzeige-Logik für den "See"-Gewässertyp.
 * @method fgwMst - Initialisiert den Stammdaten-Service und aktualisiert verschiedene Anzeige-Flags.
 * @method handleDataWK - Behandelt die Aktualisierung der "WasserkoerperStam"-Daten.
 * @method handleData - Behandelt die bereitgestellten "MessstellenStam"-Daten und aktualisiert vorhandene Daten.
 * @method formatDate - Formatiert ein gegebenes Datum in einen String im Format "dd.MM.yyyy HH:mm".
 * @method applyFilterMessstellen - Filtert das "messstellenStam1"-Array basierend auf dem Eingabewert aus dem Ereignis.
 * @method applyFilterWK - Filtert das "WasserkoerperStam"-Array basierend auf dem Eingabewert aus dem Ereignis.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class StammdatenComponent implements OnInit,AfterViewInit,AfterViewChecked{
  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatSort) sortWK: MatSort
  @ViewChild(StammMessstellenComponent) stammMessstellenComponent1: StammMessstellenComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private helpService: HelpService,
    // private commentService: CommentService, 
    private snackBar: MatSnackBar,
    private stammdatenService:StammdatenService,
    // private stammMessstellenComponent:StammMessstellenComponent,
    // private stammWkComponent:StammWkComponent
  ){this.sortedData = this.messstellenStam1.slice();this.sortedDataWK = this.wkStam1.slice();}
  TypWrrlAnzeige:boolean=false;
  isbtnpnButton=false;
  isbtntypButton=false;
  isbtnmstButton=false;
  isbtnwkButton=false;
  isbtngewasser=false;
  ProbenehmerAnzeige:boolean=false;
  isHelpActive: boolean = false;
  seefliess:boolean;
   public messstellenStam1:MessstellenStam[]=[];
   public wkStam1:WasserkoerperStam[]=[];
  public MessstellenAnzeige:boolean=false;
  public WKAnzeige:boolean=false;
  public GewaesserAnzeige:boolean=false;
  sortedData:MessstellenStam[]=[];sortedDataWK:WasserkoerperStam[]=[];
  public gewaesserart:string;
  public PPTypAnzeige:boolean=false;
  public DiaTypAnzeige:boolean=false;
  public MzbTypAnzeige:boolean=false;
  public MpTypAnzeige:boolean=false;
  
  helpText: string = '';

//sort Mst
  /**
   * Sortiert die Daten basierend auf den angegebenen Sortierkriterien.
   * 
   * @param sort - Die Sortierkriterien, die den aktiven Sortierschlüssel und die Richtung enthalten.
   * 
   * Die Funktion sortiert das `messstellenStam1` Array basierend auf dem aktiven Sortierschlüssel und der Richtung.
   * Wenn kein Sortierschlüssel oder keine Richtung angegeben ist, gibt sie die unsortierten Daten zurück.
   * Die Sortierung erfolgt nach den folgenden Schlüsseln:
   * - 'id_mst': Sortiert nach der `id_mst` Eigenschaft.
   * - 'namemst': Sortiert nach der `namemst` Eigenschaft.
   * - 'ortslage': Sortiert nach der `ortslage` Eigenschaft.
   * - 'wk_name': Sortiert nach der `wk_name` Eigenschaft.
   * - 'gewaessername': Sortiert nach der `gewaessername` Eigenschaft.
   * - 'repraesent': Sortiert nach der `repraesent` Eigenschaft.
   * - 'updated_at': Sortiert nach der `updated_at` Eigenschaft.
   * 
   * Die Sortierreihenfolge wird durch die `direction` Eigenschaft des `sort` Parameters bestimmt,
   * die entweder 'asc' für aufsteigend oder 'desc' für absteigend sein kann.
   */
  sortData(sort: Sort) {
    const data = this.messstellenStam1.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.messstellenStam1=[];
    this.messstellenStam1 = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id_mst':
          return compare(a.id_mst, b.id_mst , isAsc) ;
        case 'namemst':
          return compare(a.namemst, b.namemst, isAsc);
        case 'ortslage':
          return compare(a.ortslage, b.ortslage, isAsc);
        case 'wk_name':
          return compare(a.wk_name, b.wk_name, isAsc);
        case 'gewaessername':
          return compare(a.gewaessername, b.gewaessername, isAsc);
          case 'repraesent':
          return compare(a.repraesent, b.repraesent, isAsc);
          case 'updated_at':
            return compare(a.updated_at, b.updated_at, isAsc);
          default:
          return 0;
      }
    });



}
/**
 * Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular die Ansicht der Komponente vollständig überprüft hat.
 * Diese Methode registriert Mouseover-Ereignisse mithilfe des helpService.
 * 
 * @see {@link https://angular.io/guide/lifecycle-hooks#ngafterviewchecked}
 */
ngAfterViewChecked() {
  this.helpService.registerMouseoverEvents();
}

/**
 * Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
 * Diese Methode wird verwendet, um Mouseover-Ereignisse für Elemente mit der Klasse 'helpable' zu registrieren.
 * Sie nutzt den helpService, um diese Ereignisse zu verwalten.
 *
 * @memberof StammdatenComponent
 */

ngAfterViewInit() {
	
	//	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
		this.helpService.registerMouseoverEvents();}

/**
 * Erstellt eine neue Messstelle und aktualisiert das `messstellenStam1` Array.
 * 
 * Diese Methode ruft die `neueMst` Methode des `stammdatenService` mit dem `seefliess` Parameter auf.
 * Bei erfolgreicher Erstellung einer neuen Messstelle wird das `messstellenStam1` Array mit dem aktuellen 
 * Messstellen-Array aus dem `stammdatenService` aktualisiert und die `edit` Methode des 
 * `stammMessstellenComponent1` mit der neu erstellten Messstelle aufgerufen.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die neue Messstelle erstellt und die 
 * `edit` Methode aufgerufen wurde.
 * 
 * @throws Wird eine Fehlermeldung in die Konsole protokollieren, wenn ein Fehler bei der Erstellung der neuen Messstelle auftritt.
 */
async new(){

    this.stammdatenService.neueMst(this.seefliess).subscribe({
      next: async (newMessstelle) => {
        this.messstellenStam1 = this.stammdatenService.messstellenarray;
        await this.stammMessstellenComponent1.edit(newMessstelle);
      },
      error: (error) => {
        console.error('Error creating new Messstelle:', error);
      }
    });
  }
/**
 * Sortiert das `wkStam1` Array basierend auf den angegebenen Sortierkriterien und aktualisiert das `sortedDataWK` Array.
 * 
 * @param sortWK - Die Sortierkriterien, die das aktive Sortierfeld und die Richtung enthalten.
 * 
 * Die Funktion führt die folgenden Schritte aus:
 * 1. Erstellt eine Kopie des `wkStam1` Arrays.
 * 2. Überprüft, ob die Sortierkriterien gültig sind. Wenn nicht, wird das kopierte Array `sortedDataWK` zugewiesen und die Funktion beendet.
 * 3. Sortiert das kopierte Array basierend auf dem aktiven Sortierfeld und der Richtung.
 * 4. Aktualisiert das `sortedDataWK` Array mit den sortierten Daten.
 * 5. Protokolliert die sortierten Daten in der Konsole.
 * 6. Aktualisiert das `wkStam1` Array mit den sortierten Daten.
 * 
 * Die Sortierung erfolgt mithilfe der `compare` Funktion, die zwei Werte basierend auf der angegebenen Sortierrichtung vergleicht.
 * 
 * Die möglichen Sortierfelder sind:
 * - 'id'
 * - 'wk_name'
 * - 'kuenstlich'
 * - 'hmwb'
 * - 'gewaessername'
 * - 'wrrl_typ_str'
 * - 'updated_at'
 */

sortDataWk(sortWK: Sort) {
  const data = this.wkStam1.slice();
  if (!sortWK.active || sortWK.direction === '') {
    this.sortedDataWK = data;
    return;
  }
  this.sortedDataWK=[];
  this.sortedDataWK = data.sort((a, b) => {
    const isAsc = sortWK.direction === 'asc';
    switch (sortWK.active) {
      case 'id':
        
        return compare(a.id, b.id, isAsc);
      case 'wk_name':
        return compare(a.wk_name, b.wk_name, isAsc);
      case 'kuenstlich':
        return compare(a.kuenstlich, b.kuenstlich, isAsc);
        case 'hmwb':
        return compare(a.hmwb, b.hmwb, isAsc);
      case 'gewaessername':
        return compare(a.gewaessername, b.gewaessername, isAsc);
        case 'wrrl_typ_str':
        return compare(a.wrrl_typ_str, b.wrrl_typ_str, isAsc);
        case 'updated_at':
          return compare(a.updated_at, b.updated_at, isAsc);
        default:
       return 0;
    }
  });
console.log( this.sortedDataWK);
this.wkStam1=this.sortedDataWK;

}
  /**
   * Lebenszyklus-Hook, der aufgerufen wird, nachdem Angular alle datengebundenen Eigenschaften einer Direktive initialisiert hat.
   * Diese Methode überprüft, ob der Benutzer eingeloggt ist. Wenn nicht, wird auf die Login-Seite umgeleitet.
   * Wenn der Benutzer eingeloggt ist, wird er bei den Observables des Help-Services angemeldet, um den Hilfestatus und -text zu aktualisieren.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist.
   */
  async ngOnInit(){

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
        }else{
          this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
			this.helpService.helpText$.subscribe(text => this.helpText = text);
        } 
      
  }


/**
 * Behandelt asynchron die Sichtbarkeit und das Abrufen von Daten für verschiedene UI-Komponenten im Zusammenhang mit "Messstellen".
 * 
 * Diese Methode führt die folgenden Aktionen aus:
 * - Setzt `seefliess` auf `true`.
 * - Setzt `MpTypAnzeige` auf `false`.
 * - Ruft die `start` Methode des `stammdatenService` mit den Parametern `true` und `false` auf.
 * - Setzt `PPTypAnzeige` auf `false`.
 * - Setzt `DiaTypAnzeige` auf `false`.
 * - Setzt `MessstellenAnzeige` auf `true`.
 * - Setzt `WKAnzeige` auf `false`.
 * - Setzt `GewaesserAnzeige` auf `false`.
 * - Setzt `TypWrrlAnzeige` auf `false`.
 * - Protokolliert das `messstellenarray` vom `stammdatenService` in der Konsole.
 * - Weist das `messstellenarray` vom `stammdatenService` `messstellenStam1` zu.
 * - Setzt `ProbenehmerAnzeige` auf `false`.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Methode abgeschlossen ist.
 */
 async  seeMst(){
  
  this.isbtnpnButton=false;
  this.isbtntypButton=false;
  this.isbtngewasser=false;
  this.isbtnmstButton=true;
  this.isbtnwkButton=false;
  this.seefliess=true;
  this.MpTypAnzeige=false;
  this.MzbTypAnzeige=false;
  await  this.stammdatenService.start(true,false);
  this.PPTypAnzeige=false;
  this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=true;
    this.WKAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    console.log (this.stammdatenService.messstellenarray)
    this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.ProbenehmerAnzeige=false;

  }
/**
 * Aktualisiert die Anzeigeeigenschaften verschiedener Komponenten, um nur die "Gewaesser" Komponente anzuzeigen.
 * 
 * Diese Methode setzt die folgenden Eigenschaften:
 * - `MpTypAnzeige`: false
 * - `DiaTypAnzeige`: false
 * - `PPTypAnzeige`: false
 * - `MessstellenAnzeige`: false
 * - `WKAnzeige`: false
 * - `TypWrrlAnzeige`: false
 * - `GewaesserAnzeige`: true
 * - `ProbenehmerAnzeige`: false
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Anzeigeeigenschaften aktualisiert wurden.
 */
/**
 * Behandelt die Anzeige-Logik für den "Gewaesser" Abschnitt.
 * 
 * Diese Methode setzt die Sichtbarkeit verschiedener UI-Komponenten im Zusammenhang 
 * mit verschiedenen Datentypen und Messpunkten. Sie verbirgt alle anderen Abschnitte 
 * und zeigt nur den "Gewaesser" Abschnitt an.
 * 
 * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Anzeige-Logik abgeschlossen ist.
 */

async gewaesser1(){
  this.isbtnpnButton=false;
  this.isbtntypButton=false;
  this.isbtngewasser=true;
  this.isbtnmstButton=false;
  this.isbtnwkButton=false;
  this.MpTypAnzeige=false;
  this.DiaTypAnzeige=false;
  this.MzbTypAnzeige=false;
  this.PPTypAnzeige=false;
  this.MessstellenAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
this.GewaesserAnzeige=true;
this.ProbenehmerAnzeige=false;
}
  /**
   * Aktualisiert die Anzeige-Flags für verschiedene Typen und setzt das WRRL-Typ-Anzeige-Flag auf true.
   * 
   * Diese Methode setzt die folgenden Flags:
   * - `MpTypAnzeige`: false
   * - `DiaTypAnzeige`: false
   * - `MessstellenAnzeige`: false
   * - `GewaesserAnzeige`: false
   * - `WKAnzeige`: false
   * - `PPTypAnzeige`: false
   * - `TypWrrlAnzeige`: true
   * - `ProbenehmerAnzeige`: false
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Operation abgeschlossen ist.
   */
  async wrrlTyp(){
    this.isbtnpnButton=false;
    this.isbtntypButton=true;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false;
    this.MpTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
    this.PPTypAnzeige=false;
this.TypWrrlAnzeige=true;
this.ProbenehmerAnzeige=false;
  }
  /**
   * Schaltet die Sichtbarkeit verschiedener UI-Komponenten um, indem `ProbenehmerAnzeige` auf true
   * und alle anderen Sichtbarkeits-Flags auf false gesetzt werden.
   *
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Sichtbarkeitsänderungen abgeschlossen sind.
   */
  async probenehmer(){
    this.isbtnpnButton=true;
    this.isbtntypButton=false;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false;
    this.ProbenehmerAnzeige=true;
    this.MpTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
    this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=false;
  }
   /**
   * Behandelt die Anzeige-Logik für den MpTyp-Abschnitt.
   * 
   * Diese Methode setzt die Sichtbarkeit verschiedener UI-Komponenten im Zusammenhang 
   * mit dem MpTyp-Abschnitt. Sie verbirgt die Abschnitte Probenehmer, Messstellen, 
   * Gewaesser, WK, TypWrrl, PPTyp und DiaTyp und zeigt den MpTyp-Abschnitt an.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Anzeige-Logik abgeschlossen ist.
   */
   async mzbTyp(){ 
    this.isbtnpnButton=false;
    this.isbtntypButton=true;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false;
    this.ProbenehmerAnzeige=false;
    this.MzbTypAnzeige=true;
    this.MpTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=false;
  }
  /**
   * Behandelt die Anzeige-Logik für den MpTyp-Abschnitt.
   * 
   * Diese Methode setzt die Sichtbarkeit verschiedener UI-Komponenten im Zusammenhang 
   * mit dem MpTyp-Abschnitt. Sie verbirgt die Abschnitte Probenehmer, Messstellen, 
   * Gewaesser, WK, TypWrrl, PPTyp und DiaTyp und zeigt den MpTyp-Abschnitt an.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Anzeige-Logik abgeschlossen ist.
   */
  async mpTyp(){
    this.isbtnpnButton=false;
    this.isbtntypButton=true;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false; 
    this.ProbenehmerAnzeige=false;
    this.MzbTypAnzeige=false;
    this.MpTypAnzeige=true;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=false;
  }
  /**
   * Aktualisiert die Sichtbarkeit verschiedener UI-Komponenten, um den DiaTyp-Abschnitt anzuzeigen.
   * 
   * Diese Methode setzt die Sichtbarkeit der folgenden Komponenten:
   * - MpTypAnzeige: false
   * - MessstellenAnzeige: false
   * - GewaesserAnzeige: false
   * - WKAnzeige: false
   * - TypWrrlAnzeige: false
   * - PPTypAnzeige: false
   * - DiaTypAnzeige: true
   * - ProbenehmerAnzeige: false
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Sichtbarkeitsaktualisierungen abgeschlossen sind.
   */
  async diaTyp(){
    this.isbtnpnButton=false;
    this.isbtntypButton=true;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false;
    this.MpTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=false;
    this.DiaTypAnzeige=true;
    this.ProbenehmerAnzeige=false;
  }
  /**
   * Aktualisiert die Sichtbarkeit verschiedener UI-Komponenten, um den PP Typ Abschnitt anzuzeigen.
   * 
   * Diese Methode setzt die Sichtbarkeit der folgenden Komponenten:
   * - MpTypAnzeige: false
   * - DiaTypAnzeige: false
   * - MessstellenAnzeige: false
   * - GewaesserAnzeige: false
   * - WKAnzeige: false
   * - TypWrrlAnzeige: false
   * - PPTypAnzeige: true
   * - ProbenehmerAnzeige: false
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Sichtbarkeitsaktualisierungen abgeschlossen sind.
   */
  async ppTyp(){
    this.isbtnpnButton=false;
    this.isbtntypButton=true;
    this.isbtngewasser=false;
    this.isbtnwkButton=false;
    this.isbtnmstButton=false;
    this.MpTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.DiaTypAnzeige=false;
    this.MessstellenAnzeige=false;
    this.GewaesserAnzeige=false;
    this.WKAnzeige=false;
this.TypWrrlAnzeige=false;
    this.PPTypAnzeige=true;
    this.ProbenehmerAnzeige=false;
  }
  /**
   * Behandelt die Logik für die Anzeige und Aktualisierung des Zustands im Zusammenhang mit "Fließgewässer".
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Setzt verschiedene Anzeige-Flags auf false.
   * - Ruft die `startwk` Methode des `stammdatenService` mit spezifischen Parametern auf.
   * - Aktualisiert die Anzeige-Flags und Zustandsvariablen entsprechend.
   * - Setzt die `gewaesserart` auf "Fließgewässer".
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die asynchronen Operationen abgeschlossen sind.
   */
  async fgwWk()
  
  { this.isbtnpnButton=false;
    this.isbtntypButton=false;
    this.isbtngewasser=false;
    this.isbtnwkButton=true;
    this.isbtnmstButton=false;
  this.DiaTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.MpTypAnzeige=false;
    this.PPTypAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    await  this.stammdatenService.startwk(false,false);
  this.MessstellenAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
 // console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
this.gewaesserart="Fließgewässer";
this.ProbenehmerAnzeige=false;}
  
  /**
   * Behandelt asynchron die Anzeige-Logik für den "See" Gewässertyp.
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Startet den Prozess für den Gewässertyp mit spezifischen Parametern.
   * - Aktualisiert verschiedene Anzeige-Flags, um die Sichtbarkeit verschiedener UI-Komponenten zu steuern.
   * - Setzt die `wkStam1` Eigenschaft mit dem Gewässertyp-Array aus dem Service.
   * - Setzt die `gewaesserart` Eigenschaft auf "See".
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Methode abgeschlossen ist.
   */
  async seeWk()

  { this.isbtnpnButton=false;
    this.isbtntypButton=false;this.isbtngewasser=false;
    this.isbtnwkButton=true;
    this.isbtnmstButton=false;
    await  this.stammdatenService.startwk(true,false);
    this.DiaTypAnzeige=false;
    this.MzbTypAnzeige=false;
    this.MpTypAnzeige=false;
    this.seefliess=true;
  this.MessstellenAnzeige=false;
  this.PPTypAnzeige=false;
  this.GewaesserAnzeige=false;
  this.WKAnzeige=true;
  this.TypWrrlAnzeige=false;
 // console.log (this.stammdatenService.wkarray)
  this.wkStam1=this.stammdatenService.wkarray;
  this.gewaesserart="See";
  this.ProbenehmerAnzeige=false;}



  /**
   * Initialisiert den Stammdaten-Service asynchron und aktualisiert verschiedene Anzeige-Flags.
   * 
   * Diese Methode führt die folgenden Aktionen aus:
   * - Startet den Stammdaten-Service mit den angegebenen Parametern.
   * - Setzt verschiedene Anzeige-Flags, um die Sichtbarkeit verschiedener UI-Komponenten zu steuern.
   * - Aktualisiert die Eigenschaft `messstellenStam1` mit dem `messstellenarray` aus dem Stammdaten-Service.
   * 
   * @returns {Promise<void>} Ein Promise, das aufgelöst wird, wenn die Initialisierung und Aktualisierungen abgeschlossen sind.
   */
  async fgwMst(){
    this.isbtnpnButton=false;
    this.isbtntypButton=false;
    this.isbtngewasser=false;
    this.isbtnmstButton=true;
    this.isbtnwkButton=false;
   await this.stammdatenService.start(false,false);
   this.DiaTypAnzeige=false;
   this.MzbTypAnzeige=false;
   this.MpTypAnzeige=false;
   this.seefliess=false;
   //console.log (this.stammdatenService.messstellenarray)
   this.messstellenStam1=this.stammdatenService.messstellenarray;
    this.MessstellenAnzeige=true;
    this.PPTypAnzeige=false;
    this.GewaesserAnzeige=false;
    this.TypWrrlAnzeige=false;
    this.WKAnzeige=false;
    this.ProbenehmerAnzeige=false;
  }

  /**
   * Behandelt die Aktualisierung der WasserkoerperStam-Daten.
   * 
   * Diese Methode aktualisiert die WasserkoerperStam-Daten, wenn die ID mit der ID des Ergebnisses übereinstimmt.
   * Sie archiviert die alten Daten, aktualisiert die Felder mit den neuen Daten und speichert die aktualisierten Daten.
   * 
   * @param {WasserkoerperStam} result - Die neuen WasserkoerperStam-Daten, die aktualisiert werden sollen.
   */
  handleDataWK(result:WasserkoerperStam){
    let wkStam2:WasserkoerperStam[]=this.wkStam1;
    for (let i = 0, l = wkStam2.length; i < l; i += 1) {
      if (wkStam2[i].id===result.id)
    {
      //archiviere alte Mst-Daten 
      this.stammdatenService.archiviereWKStamm(wkStam2[i]); 

      const updated_at= this.formatDate(Date.now());

      wkStam2[i].bericht_eu=result.bericht_eu;
      wkStam2[i].dia_typ=result.dia_typ;
      wkStam2[i].mp_typ=result.mp_typ;
      wkStam2[i].pp_typ=result.pp_typ;
      wkStam2[i].wrrl_typ=result.wrrl_typ;
      wkStam2[i].id_gewaesser=result.id_gewaesser;
      wkStam2[i].hmwb=result.hmwb;
      wkStam2[i].kuenstlich=result.kuenstlich;
      wkStam2[i].updated_at=updated_at;
      wkStam2[i].land=result.land;
      wkStam2[i].eu_cd_wb=result.eu_cd_wb;
      wkStam2[i].wk_name=result.wk_name;
      wkStam2[i].dia_typ_str=result.dia_typ_str;
      wkStam2[i].mp_typ_str=result.mp_typ_str;
      wkStam2[i].wrrl_typ_str=result.wrrl_typ_str;
      wkStam2[i].pp_typ_str=result.pp_typ_str;

       //speichere neue Mst-Daten
       this.stammdatenService.speichereWK(result); 
  }
    }}
/**
 * Behandelt die bereitgestellten MessstellenStam-Daten, indem die vorhandenen Daten aktualisiert werden, wenn eine Übereinstimmung gefunden wird.
 * 
 * @param {MessstellenStam} result - Die neuen MessstellenStam-Daten, die verarbeitet werden sollen.
 * 
 * Diese Funktion führt die folgenden Schritte aus:
 * 1. Iteriert durch die vorhandenen MessstellenStam-Daten (`messstellenStam1`).
 * 2. Wenn eine Übereinstimmung gefunden wird (basierend auf `id_mst`), archiviert sie die alten Daten mit `stammdatenService.archiviereMstStamm`.
 * 3. Aktualisiert die übereinstimmenden MessstellenStam-Daten mit den neuen Werten aus `result`.
 * 4. Setzt das Feld `updated_at` auf das aktuelle Datum.
 * 5. Speichert die neuen MessstellenStam-Daten mit `stammdatenService.speichereMst`.
 */

handleData(result:MessstellenStam){


      let messstellenStam2: MessstellenStam[] = this.messstellenStam1; 
        for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
          if (messstellenStam2[i].id_mst===result.id_mst)
        {
            //archiviere alte Mst-Daten    
          this.stammdatenService.archiviereMstStamm(messstellenStam2[i]);  
         const updated_at= this.formatDate(Date.now());
                  messstellenStam2[i].id_wk=result.id_wk;
                  messstellenStam2[i].wk_name=result.wk_name;
                  messstellenStam2[i].idgewaesser=result.idgewaesser;
                  messstellenStam2[i].gewaessername=result.gewaessername;
                  messstellenStam2[i].namemst=result.namemst;
                  messstellenStam2[i].ortslage=result.ortslage;
                  messstellenStam2[i].hw_etrs=result.hw_etrs;
                  messstellenStam2[i].repraesent=result.repraesent;
                  messstellenStam2[i].rw_etrs=result.rw_etrs;
                  messstellenStam2[i].updated_at=updated_at;
                
                
                  //speichere neue Mst-Daten
                  this.stammdatenService.speichereMst(result); 
                 

      }
      
    }
}


/**
 * Formatiert ein gegebenes Datum in einen String im Format "dd.MM.yyyy HH:mm".
 *
 * @param date - Das zu formatierende Datum.
 * @returns Ein String, der das formatierte Datum darstellt.
 */
formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      stunden=d.getHours(),
      min=d.getMinutes();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  let datum =   day + "."+month + "."+year+ " "+stunden+":"+min
      return datum;
  //return [year, month, day].join('-');
}

/**
 * Filtert das `messstellenStam1` Array basierend auf dem Eingabewert aus dem Ereignis.
 * Der Filter überprüft, ob der Eingabewert in den Eigenschaften `namemst`, `gewaessername` 
 * oder `ortslage` der `MessstellenStam` Objekte im `messstellenarray` enthalten ist.
 * 
 * @param {Event} event - Das Eingabeereignis, das den Filterwert enthält.
 */
applyFilterMessstellen(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;

  let messstellenStam2: MessstellenStam[] = this.stammdatenService.messstellenarray;

  this.messstellenStam1 = [];
  for (let i = 0, l = messstellenStam2.length; i < l; i += 1) {
    let messstellenStamTemp: MessstellenStam = messstellenStam2[i];

    // Ensure that the properties are not null or undefined before calling 'includes'
    const namemst = messstellenStamTemp.namemst || ''; // Fallback to empty string if null or undefined
    const gewaessername = messstellenStamTemp.gewaessername || ''; // Fallback to empty string if null or undefined
    const ortslage = messstellenStamTemp.ortslage || ''; // Fallback to empty string if null or undefined

    if (
      namemst.includes(filterValue) ||
      gewaessername.includes(filterValue) ||
      ortslage.includes(filterValue)
    ) {
      this.messstellenStam1.push(messstellenStamTemp);
    }
  }
}

/**
 * Filtert das WasserkoerperStam-Array basierend auf dem Eingabewert aus dem Ereignis.
 * Die gefilterten Ergebnisse werden im `wkStam1` Array gespeichert.
 *
 * @param {Event} event - Das Eingabeereignis, das den Filterwert enthält.
 */
applyFilterWK(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;

  let kwStam2: WasserkoerperStam[] = this.stammdatenService.wkarray;


  this.wkStam1= [];
  for (let i = 0, l = kwStam2.length; i < l; i += 1) {
    let wkStamTemp:WasserkoerperStam=kwStam2[i];
    if (wkStamTemp.gewaessername==null) {wkStamTemp.gewaessername=' '}
    if (wkStamTemp.wk_name.includes(filterValue) 
    || 
    wkStamTemp.gewaessername.includes(filterValue) 
     || wkStamTemp.eu_cd_wb.includes(filterValue) 
    // || messstellenStam2[i].wk_name.includes(filterValue)
    ){
      this.wkStam1.push(kwStam2[i]);

    }}
  }
}

/**
 * Vergleicht zwei Werte vom Typ Nummer, String oder Boolean.
 *
 * @param a - Der erste zu vergleichende Wert.
 * @param b - Der zweite zu vergleichende Wert.
 * @param isAsc - Ein Boolean, der angibt, ob der Vergleich in aufsteigender Reihenfolge erfolgen soll.
 * @returns Eine negative Zahl, wenn `a` kleiner als `b` ist, eine positive Zahl, wenn `a` größer als `b` ist,
 *          oder 0, wenn sie gleich sind. Das Ergebnis wird mit 1 multipliziert, wenn `isAsc` true ist, oder -1, wenn `isAsc` false ist.
 */

function compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}