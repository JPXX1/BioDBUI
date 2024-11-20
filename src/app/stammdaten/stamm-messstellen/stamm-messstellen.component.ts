import {Component, Input,Output, EventEmitter,ViewChild,ElementRef} from '@angular/core';
import { Sort} from '@angular/material/sort';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import {EditStammdatenMstComponent} from '../edit-stammdaten-mst/edit-stammdaten-mst.component';
import {ArchivStammdatenComponent} from '../archiv-stammdaten-mst/archiv-stammdaten.component';
import { MatDialog } from '@angular/material/dialog';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
import { Overlay } from '@angular/cdk/overlay';
// ];
@Component({
  selector: 'app-stamm-messstellen',
  templateUrl: './stamm-messstellen.component.html',
  styleUrls: ['./stamm-messstellen.component.css']
})

export class StammMessstellenComponent {
  @Input()  gewaesser: string="Gewässer"; 
  @Input()  messstellenStam: MessstellenStam[] = []; 
  @Output() newData =new EventEmitter<MessstellenStam>();
  @Output() sortData1=new EventEmitter<Sort>(); 
  @ViewChild('buttonElement') buttonElement: ElementRef;

 archivMst:MessstellenStam[] = [];

arraybuendel:ArraybuendelSel;
  
  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','repraesent','updated_at','actions'];
  dataSource = this.messstellenStam;
 

  constructor( private overlay: Overlay,public dialog: MatDialog,private stammdatenService:StammdatenService) {
   
  }  

  sortData(sort:Sort){

    this.sortData1.emit(sort);

  }

     
  /**
   * Öffnet einen Dialog, um die Daten der angegebenen Person zu bearbeiten.
   * 
   * Diese Methode führt die folgenden Schritte aus:
   * 1. Lädt asynchron notwendige Daten mit `stammdatenService`.
   * 2. Bereitet die Daten für den Dialog vor.
   * 3. Berechnet die Position des Dialogs basierend auf dem Mausereignis, falls vorhanden.
   * 4. Öffnet den Dialog mit den vorbereiteten Daten und der berechneten Position.
   * 5. Sendet neue Daten, wenn der Dialog mit einem Ergebnis geschlossen wird.
   * 
   * @param person - Die zu bearbeitenden Personendaten.
   * @param event - Optionales Mausereignis zur Positionierung des Dialogs.
   * @returns Ein Promise, das aufgelöst wird, wenn der Dialog geschlossen wird.
   */
  async edit(person: MessstellenStam, event?: MouseEvent) {
    // Lade Daten asynchron
    await this.stammdatenService.holeSelectDataWK();
    await this.stammdatenService.callGewaesser();
    await this.stammdatenService.wandleGewaesser(false);
  
    console.log(this.stammdatenService.gewaesser);
    let wk = this.stammdatenService.wk;
    let gewaesser: TypWrrl[] = this.stammdatenService.gewaesser;
  
    // Daten für Dialog vorbereiten
    this.arraybuendel = {
      mststam: person,
      wkstam: wk,
      melde: this.stammdatenService.meldemst,
      gewaesser: gewaesser,
    };
  
    const OFFSET_TOP = -1320; // Offset in Pixeln
  
    let leftPosition = 0;
    let topPosition = 0;
  
    // Position basierend auf Event berechnen, falls verfügbar
    if (event) {
      const targetElement = event.currentTarget as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dialogWidth = 800; // Breite des Dialogs
        const dialogHeight = 400; // Höhe des Dialogs
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
  
        leftPosition = rect.left + rect.width / 2 - dialogWidth / 2;
        if (leftPosition < 0) {
          leftPosition = 0;
        } else if (leftPosition + dialogWidth > viewportWidth) {
          leftPosition = viewportWidth - dialogWidth;
        }
  
        topPosition = rect.top + rect.height + OFFSET_TOP;
        if (topPosition + dialogHeight > viewportHeight) {
          topPosition = rect.top - dialogHeight - OFFSET_TOP;
          if (topPosition < 0) {
            topPosition = OFFSET_TOP; // Mindestabstand von oben
          }
        }
      }
    } else {
      // Fallback: Zentriert im Bildschirm mit Offset
      const dialogWidth = 800;
      const dialogHeight = 400;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
  
      leftPosition = (viewportWidth - dialogWidth) / 2;
      topPosition = (viewportHeight - dialogHeight) / 2 + OFFSET_TOP;
    }
  
    // Dialog öffnen
    const dialogRef = this.dialog.open(EditStammdatenMstComponent, {
      width: `800px`,
      data: this.arraybuendel,
      position: {
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
      },
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newData.emit(result);
      }
    });
  }
  
  
  
async showArchiv(event: MouseEvent, person: MessstellenStam) {
  const targetElement = event.currentTarget as HTMLElement;
  await this.stammdatenService.holeArchiv(person.id_mst);
  this.archivMst = this.stammdatenService.archivMst;

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
  const dialogRef = this.dialog.open(ArchivStammdatenComponent, {
    width: `${dialogWidth}px`,
    height: `${dialogHeight}px`,
    data: this.archivMst,
    position: {
      top: `${topPosition}px`,
      left: `${leftPosition}px`
    },
    scrollStrategy: this.overlay.scrollStrategies.reposition()
  });
}

 }
