import {Component, Input,Output, EventEmitter} from '@angular/core';
import { Sort} from '@angular/material/sort';
import {StammdatenService} from 'src/app/services/stammdaten.service';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import {TypWrrl} from 'src/app/interfaces/typ-wrrl';
import {EditStammdatenMstComponent} from '../edit-stammdaten-mst/edit-stammdaten-mst.component';
import {ArchivStammdatenComponent} from '../archiv-stammdaten-mst/archiv-stammdaten.component';
// import { MatDialog } from '@angular/material/dialog';
import { ArraybuendelSel } from 'src/app/interfaces/arraybuendel-sel';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
// import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
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

 archivMst:MessstellenStam[] = [];
//  private scrollStrategy: ScrollStrategy;
arraybuendel:ArraybuendelSel;
mouseX: number;
mouseY: number;
private overlayRef: OverlayRef;


  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','repraesent','updated_at','actions'];
  dataSource = this.messstellenStam;
 

  constructor(private overlay: Overlay, private stammdatenService:StammdatenService) {
     // Blockierte Scroll-Strategie für Dialogfenster
  }  

  sortData(sort:Sort){

    this.sortData1.emit(sort);

  }

     
 


 

  async edit(person: MessstellenStam) {
    await this.stammdatenService.holeSelectDataWK();
    await this.stammdatenService.callGewaesser();
    await this.stammdatenService.wandleGewaesser(false);
  
    const wk = this.stammdatenService.wk;
    const gewaesser: TypWrrl[] = this.stammdatenService.gewaesser;
  
    this.arraybuendel = {
      mststam: person,
      wkstam: wk,
      melde: this.stammdatenService.meldemst,
      gewaesser: gewaesser
    };
    
    // Dispose, wenn bereits ein OverlayRef besteht
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  
    const scrollY = window.scrollY || window.pageYOffset;

    let mouseY= this.calculateMouseY(scrollY);
    const viewportHeight = window.innerHeight;
    const topPosition = scrollY + viewportHeight *mouseY; // Position im oberen Drittel des sichtbaren Bereichs
  
    const overlayConfig = this.overlay.position()
      .global()
      .centerHorizontally()
      .top(`${topPosition}px`); // Dynamische `top`-Position basierend auf Scroll
  
    this.overlayRef = this.overlay.create({
      positionStrategy: overlayConfig,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'fixed-overlay-dialog' // Wendet CSS-Klasse an
    });
  
    // Dialog erstellen und Daten an `EditStammdatenMstComponent` übergeben
    const dialogPortal = new ComponentPortal(EditStammdatenMstComponent);
    const componentRef = this.overlayRef.attach(dialogPortal);

    if (componentRef.instance) {
      componentRef.instance.data = this.arraybuendel; // Übergibt Daten an `EditStammdatenMstComponent`

      // Abonniert `closeDialog`-Event, um das Overlay zu schließen
      componentRef.instance.closeDialog.subscribe((result: any) => {
        this.closeDialog(result);  // Ruft `closeDialog` auf und schließt das Overlay
      });
    }

    // Schließen des Overlays bei Klick auf den Hintergrund
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeDialog();
    });
  }

  closeDialog(result?: any) {
    if (this.overlayRef) {
      this.overlayRef.dispose(); // Schließt das Overlay
      if (result) {
        this.newData.emit(result); // Sendet Daten zurück, falls vorhanden
      }
    }
  }

  

   calculateMouseY(scrollY) {
    let mouseY;

    if (scrollY < 100) {
        mouseY = 0.1;
    } else if (scrollY < 500) {
        mouseY = 0.2;
    } else if (scrollY < 1000) {
        mouseY = 0.3;
    } else if (scrollY < 1500) {
        mouseY = 0.4;
    } else if (scrollY < 2000) {
        mouseY = 0.5;
    } else if (scrollY < 2500) {
        mouseY = 0.6;
    } else if (scrollY < 3000) {
        mouseY = 0.7;
    } else if (scrollY < 3500) {
        mouseY = 0.8;
    } else if (scrollY < 4000) {
        mouseY = 0.9;
    } else if (scrollY < 4500) {
        mouseY = 1.0;
    } else if (scrollY < 5000) {
        mouseY = 1.1;
    } else if (scrollY < 5500) {
        mouseY = 1.2;
    } else if (scrollY < 6000) {
        mouseY = 1.3;
    } else if (scrollY < 6500) {
        mouseY = 1.4;
    } else if (scrollY < 7000) {
        mouseY = 1.5;
    } else if (scrollY < 7500) {
        mouseY = 1.6;
    } else if (scrollY < 8000) {
        mouseY = 1.7;
    } else if (scrollY < 8500) {
        mouseY = 1.8;
    } else if (scrollY < 9000) {
        mouseY = 1.9;
    } else if (scrollY < 9500) {
        mouseY = 2.0;
    } else if (scrollY < 10000) {
        mouseY = 2.1;
    } else if (scrollY < 10500) {
        mouseY = 2.2;
    } else if (scrollY < 11000) {
        mouseY = 2.3;
    } else if (scrollY < 11500) {
        mouseY = 2.4;
    } else if (scrollY < 12000) {
        mouseY = 2.5;
    } else if (scrollY < 12500) {
        mouseY = 2.6;
    } else if (scrollY < 13000) {
        mouseY = 2.7;
    } else if (scrollY < 13500) {
        mouseY = 2.8;
    } else if (scrollY < 14000) {
        mouseY = 2.9;
    } else {
        mouseY = 3.0; // Obergrenze für scrollY ab 14000
    }
    if (scrollY>6000){mouseY=mouseY+0.1;}
    if (scrollY>10000){mouseY=mouseY+0.2;}
      console.log(mouseY + ' ' + scrollY);
      return mouseY;
}

async showArchiv(person: MessstellenStam){



 await this.stammdatenService.holeArchiv(person.id_mst);
 this.archivMst= this.stammdatenService.archivMst;
  // console.log(this.archivMst);

  // const dialogRef = this.dialog.open(ArchivStammdatenComponent, {
  //   width: '1200px',
  //   data: this.archivMst
  // });

}

 }
