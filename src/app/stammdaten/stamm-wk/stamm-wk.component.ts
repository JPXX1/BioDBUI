import { Component,Input,Output,EventEmitter } from '@angular/core';
import { Sort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {StammdatenService} from 'src/app/shared/services/stammdaten.service';
import { WasserkoerperStam } from 'src/app/shared/interfaces/wasserkoerper-stam';
import { ArraybuendelWK } from 'src/app/shared/interfaces/arraybuendel-wk';
import {EditStammdatenWkComponent} from 'src/app/stammdaten/edit-stammdaten-wk/edit-stammdaten-wk.component';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
import { Overlay } from '@angular/cdk/overlay';
import {ArchivStammdatenWkComponent} from '../archiv-stammdaten-wk/archiv-stammdaten-wk.component';
@Component({
  selector: 'app-stamm-wk',
  templateUrl: './stamm-wk.component.html',
  styleUrls: ['./stamm-wk.component.css']
})
/**
 * Komponente, die die StammWkComponent darstellt.
 * 
 * @export
 * @class StammWkComponent
 * 
 * @property {WasserkoerperStam[]} wasserkoerperStam - Eingabeeigenschaft für das WasserkoerperStam-Array.
 * @property {string} gewaesserart - Eingabeeigenschaft für die Art des Gewässers.
 * @property {EventEmitter<WasserkoerperStam>} newDataWK - Ausgabe-Event-Emitter für neue WasserkoerperStam-Daten.
 * @property {EventEmitter<Sort>} sortDataWK - Ausgabe-Event-Emitter zum Sortieren von Daten.
 * @property {string[]} displayedColumns - Array der Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {WasserkoerperStam[]} dataSource - Datenquelle für die Tabelle.
 * @property {ArraybuendelWK} arraybuendelWK - Gebündeltes Array von WasserkoerperStam und verwandten Typen.
 * @property {WasserkoerperStam[]} archivWK - Array der archivierten WasserkoerperStam.
 * 
 * @constructor
 * @param {MatDialog} dialog - Angular Material Dialog-Service.
 * @param {StammdatenService} stammdatenService - Service zur Handhabung von Stammdaten-Operationen.
 * 
 * @method sortData - Sendet das sortDataWK-Event mit dem angegebenen Sortierparameter.
 * @param {Sort} sort - Der Sortierparameter.
 * 
 * @method edit - Öffnet einen Dialog zum Bearbeiten von WasserkoerperStam und sendet neue Daten, wenn Änderungen vorgenommen werden.
 * @param {WasserkoerperStam} person - Das zu bearbeitende WasserkoerperStam.
 * 
 * @method showArchiv - Öffnet einen Dialog, um das Archiv eines WasserkoerperStam anzuzeigen.
 * @param {WasserkoerperStam} person - Das WasserkoerperStam, dessen Archiv angezeigt werden soll.
 */
export class StammWkComponent {
  
  @Input()  wasserkoerperStam: WasserkoerperStam[] = []; 
  @Input() gewaesserart:string;
  @Output() newDataWK =new EventEmitter<WasserkoerperStam>();
  @Output() sortDataWK=new EventEmitter<Sort>(); 
  
  constructor(private overlay: Overlay, public dialog: MatDialog,private stammdatenService:StammdatenService) {
    
  }  
  displayedColumns: string[] = ['id', 'wk_name','gewaessername', 'kuenstlich','hmwb','bericht_eu','land','wrrl_typ_str','pp_typ_str','dia_typ_str','mp_typ_str','mzb_typ_str','updated_at','actions'];
  dataSource = this.wasserkoerperStam;
  arraybuendelWK:ArraybuendelWK;
  archivWK:WasserkoerperStam[] = [];
  sortData(sort:Sort){

    this.sortDataWK.emit(sort);

  }
  
  async edit(person: WasserkoerperStam, event?: MouseEvent) {
    // Lade Daten asynchron
    await this.stammdatenService.callDiatyp();
    await this.stammdatenService.callGewaesser();
    await this.stammdatenService.callMptyp();
    await this.stammdatenService.callMZBtyp();
    await this.stammdatenService.callWrrltyp();
    await this.stammdatenService.callPptyp();
    await this.stammdatenService.wandleGewaesser(false);
    await this.stammdatenService.wandleTypDia(false, person.see);
    await this.stammdatenService.wandleTypMP(false, person.see);
    await this.stammdatenService.wandleTypMZB(false, person.see);
    await this.stammdatenService.wandleTypPP(false, person.see);
    await this.stammdatenService.wandleTypWRRL(person.see);
  
    // Daten für den Dialog vorbereiten
    let diatyp: TypWrrl[] = this.stammdatenService.diatyp;
    let gewaesser: TypWrrl[] = this.stammdatenService.gewaesser;
    let mptyp: TypWrrl[] = this.stammdatenService.mptyp;
    let wrrltyp: TypWrrl[] = this.stammdatenService.wrrltyp;
    let pptyp: TypWrrl[] = this.stammdatenService.pptyp;
    let mzbtyp: TypWrrl[] = this.stammdatenService.mzbtyp;
  
    this.arraybuendelWK = {
      wkstam: person,
      diatyp: diatyp,
      mptyp: mptyp,
      mzbtyp: mzbtyp,
      pptyp: pptyp,
      wrrltyp: wrrltyp,
      gewaesser: gewaesser,
    };
  
    const OFFSET_TOP = 20; // Offset in Pixeln
    const DIALOG_WIDTH = 800; // Breite des Dialogs
    const DIALOG_HEIGHT = 1000; // Höhe des Dialogs
  
    let leftPosition = 0;
    let topPosition = 30;
  
    if (event) {
      // Position basierend auf Event berechnen
      const targetElement = event.currentTarget as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
  
        // Horizontale Zentrierung
        leftPosition = (viewportWidth - DIALOG_WIDTH) / 2;
  
        // Vertikale Position mit Offset
        topPosition = rect.top + rect.height + OFFSET_TOP;
  
        // Falls der Dialog aus dem unteren Bereich rutscht
        if (topPosition + DIALOG_HEIGHT > viewportHeight) {
          topPosition = rect.top - DIALOG_HEIGHT - OFFSET_TOP;
  
          // Sicherstellen, dass der Dialog nicht außerhalb des oberen Bereichs liegt
          if (topPosition < 0) {
            topPosition = OFFSET_TOP;
          }
        }
      }
    } else {
      // Fallback: Zentriert im Bildschirm
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
  
      leftPosition = (viewportWidth - DIALOG_WIDTH) / 2;
      topPosition = (viewportHeight - DIALOG_HEIGHT) / 2 + OFFSET_TOP;
    }
  
    // Dialog öffnen
    const dialogRef = this.dialog.open(EditStammdatenWkComponent, {
      width: `${DIALOG_WIDTH}px`,
      height: `${DIALOG_HEIGHT}px`,
      data: this.arraybuendelWK,
      position: {
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
      },
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newDataWK.emit(result);
      }
    });
  }
  

  // async showArchiv(person:WasserkoerperStam){
    


// async showArchivWK(event: MouseEvent, person: MessstellenStam) {
//   const targetElement = event.currentTarget as HTMLElement;
//   await this.stammdatenService.holeArchivWK(person.id);
//   this.archivWK = this.stammdatenService.archivWK;

//   // Ermitteln des angeklickten Elements
//   const rect = targetElement.getBoundingClientRect();

//   // Berechnung der Dialogposition
//   const dialogWidth = 1200; // Breite des Dialogs in Pixeln
//   const dialogHeight = 600; // Höhe des Dialogs in Pixeln
//   const viewportWidth = window.innerWidth;
//   const viewportHeight = window.innerHeight;

//   // Berechnung der 'left'-Position
//   let leftPosition = rect.left + rect.width / 2 - dialogWidth / 2;
//   if (leftPosition < 0) {
//     leftPosition = 0; // Verhindert, dass der Dialog links außerhalb des Viewports erscheint
//   } else if (leftPosition + dialogWidth > viewportWidth) {
//     leftPosition = viewportWidth - dialogWidth; // Verhindert, dass der Dialog rechts außerhalb des Viewports erscheint
//   }

//   // Berechnung der 'top'-Position
//   let topPosition = rect.top + rect.height;
//   if (topPosition + dialogHeight > viewportHeight) {
//     topPosition = rect.top - dialogHeight; // Öffnet den Dialog oberhalb des Elements, wenn unten nicht genügend Platz ist
//     if (topPosition < 0) {
//       topPosition = 0; // Verhindert, dass der Dialog oben außerhalb des Viewports erscheint
//     }
//   }

//   // Öffnen des Dialogs mit berechneter Position
//   const dialogRefWK = this.dialog.open(ArchivStammdatenWkComponent, {
//     width: `${dialogWidth}px`,
//     height: `${dialogHeight}px`,
//     data: this.archivWK,
//     position: {
//       top: `${topPosition}px`,
//       left: `${leftPosition}px`
//     },
//     scrollStrategy: this.overlay.scrollStrategies.reposition()
//   });
// }

// 

async showArchiv(event: MouseEvent, person: WasserkoerperStam) {
  const targetElement = event.currentTarget as HTMLElement;
  await this.stammdatenService.holeArchivWK(person.id);
  this.archivWK = this.stammdatenService.archivWK;

  // Ermitteln des angeklickten Elements
  // const targetElement = this.buttonElement.nativeElement;
  // const targetElement = event.currentTarget as HTMLElement;
  const rect = targetElement.getBoundingClientRect();
 


  // Berechnung der Dialogposition
  const dialogWidth = 1200; // Breite des Dialogs in Pixeln
  const dialogHeight = 600; // Höhe des Dialogs in Pixeln
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Berechnung der 'left'-Position
  let leftPosition = rect.left + rect.width / 2 - dialogWidth / 2;
  if (leftPosition < 0) {
    leftPosition = 0; // Verhindert, dass der Dialog links außerhalb des Viewports erscheint
  } else if (leftPosition + dialogWidth > viewportWidth) {
    leftPosition = viewportWidth - dialogWidth; // Verhindert, dass der Dialog rechts außerhalb des Viewports erscheint
  }

  // Berechnung der 'top'-Position
  let topPosition = rect.top + rect.height;
  if (topPosition + dialogHeight > viewportHeight) {
    topPosition = rect.top - dialogHeight; // Öffnet den Dialog oberhalb des Elements, wenn unten nicht genügend Platz ist
    if (topPosition < 0) {
      topPosition = 0; // Verhindert, dass der Dialog oben außerhalb des Viewports erscheint
    }
  }

  // Öffnen des Dialogs mit berechneter Position
  const dialogRef = this.dialog.open(ArchivStammdatenWkComponent, {
    width: `${dialogWidth}px`,
    height: `${dialogHeight}px`,
    data: this.archivWK,
    position: {
      top: `${topPosition}px`,
      left: `${leftPosition}px`
    },
    scrollStrategy: this.overlay.scrollStrategies.reposition()
  });
}
}
