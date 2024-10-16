import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, QueryList, ViewChildren,ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MstMitExpertenurteil } from 'src/app/interfaces/mst-mit-expertenurteil';
import { MatSort } from '@angular/material/sort';
import { MsteditService } from 'src/app/services/mstedit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mst-expertenurteil-edit',
  templateUrl: './mst-expertenurteil-edit.component.html',
  styleUrls: ['./mst-expertenurteil-edit.component.css']
})
export class MstExpertenurteilEditComponent implements OnChanges, AfterViewInit {
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
    this.displayedColumns =  ['wkName', 'namemst', 'jahr',  'wert','expertenurteil','begruendung'];
     if (this.mstMitExpertenurteil.some(item => item.ausblenden !== null)) {
       this.displayausblenden=false;
     }
    if (this.mstMitExpertenurteil.some(item => item.letzteAenderung !== null)) {
      this.displayedColumns.push('letzteAenderung');
    }
    if (this.mstMitExpertenurteil.some(item => item.ausblenden !== null)) {
      this.displayausblenden=true;
    }
    // if (this.mstMitExpertenurteil.some(item => item.firma !== null)) {
    //   this.displayedColumns.push('firma');
    // }
    // if (this.mstMitExpertenurteil.some(item => item.begruendung !== null)) {
    //   this.displayedColumns.push('begruendung');
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
      if (this.context === 'context1') {
        const result = await this.msteditService.saveData(element);
      this.snackBar.open('Daten erfolgreich gespeichert', 'Schließen', {
        duration: 3000,
      });
        console.log('Speichern im Kontext 1:', element);
      } else if (this.context === 'context2') {
        // speichern Expertneurteil WK
        const result = await this.msteditService.saveDataWK(element);
        console.log('Speichern im Kontext 2:', element);
      } else {
        // Standardverhalten
        console.log('Speichern im Standardkontext:', element);
      }

     
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
