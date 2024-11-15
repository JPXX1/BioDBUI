import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, QueryList, ViewChildren,ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MstMitExpertenurteil } from 'src/app/interfaces/mst-mit-expertenurteil';
import { MatSort } from '@angular/material/sort';
import { MsteditService } from 'src/app/services/mstedit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-wkexpertenurteil-edit-component',
  templateUrl: './wkexpertenurteil-edit-component.component.html',
  styleUrls: ['./wkexpertenurteil-edit-component.component.css']
})

  export class WKExpertenurteilEditComponent implements OnChanges, AfterViewInit {
    @ViewChildren('textarea') textareas: QueryList<ElementRef>;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private Farbebewertg: FarbeBewertungService,private msteditService: MsteditService,  private snackBar: MatSnackBar,private renderer: Renderer2, private cdr: ChangeDetectorRef) {}
    @Input() context: string; // Neue Eingabe für den Kontext
    @Input() mstMitExpertenurteil: MstMitExpertenurteil[] = [];
    
    dataSource: MatTableDataSource<any>;
    
  
    //dataSource: any[] = [];
    displayedColumns: string[] =  [];
  
    displayausblenden: boolean = false;
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    
      this.textareas.changes.subscribe((textareas: QueryList<ElementRef>) => {
        setTimeout(() => {
          textareas.forEach(textarea => {
            this.adjustTextareaHeight(textarea.nativeElement);
            this.renderer.listen(textarea.nativeElement, 'input', () => {
              this.adjustTextareaHeight(textarea.nativeElement);
            });
          });
          this.cdr.detectChanges();
        }, 0);
      });
    }
   
     
    updateDisplayedColumns() {
      // Beispiel: Bedingung, um bestimmte Spalten optional anzuzeigen
      this.displayedColumns =  ['wkName','jahr','wert','expertenurteil','begruendung','letzteAenderung'];
       if (this.mstMitExpertenurteil.some(item => item.ausblenden !== null)) {
         this.displayausblenden=false;
       }
     
      
     
      //  if (this.mstMitExpertenurteil.some(item => item.letzteAenderung !== null)) {
      //   this.displayedColumns.push('letzteAenderung');
      // }
  
    //  
      // if (this.mstMitExpertenurteil.some(item => item.ausblenden !== null)) {
      //   this.displayausblenden=true;
      // }
  
  
      this.displayedColumns.push('aktionen');
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes['mstMitExpertenurteil']) {
        this.dataSource = new MatTableDataSource(this.mstMitExpertenurteil);
        this.dataSource.sort = this.sort;
        // this.dataSource = this.mstMitExpertenurteil;
        this.updateDisplayedColumns();
        setTimeout(() => {
          this.textareas.forEach(textarea => {
            this.adjustTextareaHeight(textarea.nativeElement);
          });
        }, 0);
      }
    }
  
    async saveElement(element: MstMitExpertenurteil) {
      try {
        // speichern Expertneurteil Mst
       
          const result = await this.msteditService.saveDataWK(element);
        this.snackBar.open('Daten erfolgreich gespeichert', 'Schließen', {
          duration: 3000,
        });
       
  
       
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
        this.snackBar.open('Fehler beim Speichern', 'Schließen', {
          duration: 3000,
        });
      }
    }
    
    async onCheckboxChange(element: any) {
      // Hier kannst du die Logik implementieren, um die Änderung in der Datenbank zu speichern
     // console.log('Checkbox status geändert:', element.ausblenden);
      const result = await this.msteditService.saveDataAbiotik(element.id,element.ausblenden,element.id_mst);
      // Optional: API-Aufruf zum Aktualisieren des Status in der Datenbank
  
     
    }
    
    async deleteElement(element: MstMitExpertenurteil) {
      // try {
      //   const result = await this.msteditService.deleteData(element);
      //   console.log('Erfolgreich gelöscht:', result);
      // } catch (error) {
      //   console.error('Fehler beim Löschen:', error);
      // }
    }
  
  //manipulation des Textareas
    adjustTextareaHeight(textarea: HTMLTextAreaElement) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    getColor(OZK){
      return this.Farbebewertg.getColor(OZK);
       
    }}
