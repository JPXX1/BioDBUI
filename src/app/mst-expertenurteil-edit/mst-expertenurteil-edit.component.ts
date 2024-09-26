import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, QueryList, ViewChildren, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MstMitExpertenurteil } from 'src/app/interfaces/mst-mit-expertenurteil';
import { MsteditService } from 'src/app/services/mstedit.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-mst-expertenurteil-edit',
  templateUrl: './mst-expertenurteil-edit.component.html',
  styleUrls: ['./mst-expertenurteil-edit.component.css']
})
export class MstExpertenurteilEditComponent implements OnChanges, AfterViewInit {
  @ViewChildren('textarea') textareas: QueryList<ElementRef>;

  constructor(private msteditService: MsteditService,  private snackBar: MatSnackBar,private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  @Input() mstMitExpertenurteil: MstMitExpertenurteil[] = [];
  dataSource: any[] = [];
  displayedColumns: string[] = ['wkName', 'namemst', 'jahr', 'letzteAenderung', 'firma', 'wert', 'expertenurteil', 'begruendung', 'aktionen'];

  ngAfterViewInit() {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mstMitExpertenurteil']) {
      this.dataSource = this.mstMitExpertenurteil;
      setTimeout(() => {
        this.textareas.forEach(textarea => {
          this.adjustTextareaHeight(textarea.nativeElement);
        });
      }, 0);
    }
  }

  async saveElement(element: MstMitExpertenurteil) {
    try {
      const result = await this.msteditService.saveData(element);
      //console.log('Erfolgreich gespeichert:', result);
      
      // Zeige eine kurze Bestätigung mittels Snackbar
      this.snackBar.open('Daten erfolgreich gespeichert', 'Schließen', {
        duration: 3000, // 3 Sekunden anzeigen
      });
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      
      // Optional: Fehlernachricht in einer Snackbar anzeigen
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
}
