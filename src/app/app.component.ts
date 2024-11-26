import { Component, Renderer2, ViewChild, ElementRef, HostListener, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { HelpService } from '../app/services/help.service';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
// import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Die Hauptkomponente der Anwendung.
 * 
 * @class
 * @implements {OnInit}
 * 
 * @property {string} title - Der Titel der Anwendung.
 * @property {boolean} showMainContent - Flag, um den Hauptinhalt anzuzeigen oder auszublenden.
 * @property {string} selectedMenuItem - Das aktuell ausgewählte Menüelement.
 * @property {boolean} isHelpActive - Flag, um anzuzeigen, ob die Hilfe aktiv ist.
 * 
 * @constructor
 * @param {Router} router - Der Angular Router Service.
 * @param {AuthService} authService - Der Authentifizierungsservice.
 * @param {Renderer2} renderer - Der Angular Renderer2 Service.
 * @param {HelpService} helpService - Der Hilfeservice.
 * @param {ChangeDetectorRef} cdr - Der Angular ChangeDetectorRef Service.
 * @param {NgZone} ngZone - Der Angular NgZone Service.
 * 
 * @method onKeyDown - HostListener, um das Zoomen mit STRG + Tastenkombinationen zu verhindern.
 * @param {KeyboardEvent} event - Das Tastaturereignis.
 * 
 * @method onWheel - HostListener, um das Zoomen mit STRG + Mausrad zu verhindern.
 * @param {WheelEvent} event - Das Raderereignis.
 * 
 * @method ngOnInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem die datengebundenen Eigenschaften initialisiert wurden.
 * 
 * @method preventZoom - Verhindert das Zoomen mit STRG + Tastenkombinationen.
 * @param {KeyboardEvent} event - Das Tastaturereignis.
 * 
 * @method preventWheelZoom - Verhindert das Zoomen mit STRG + Mausrad.
 * @param {WheelEvent} event - Das Raderereignis.
 * 
 * @method ngAfterViewInit - Lebenszyklus-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
 * 
 * @method disableMiniMenu - Deaktiviert das Mini-Menü, indem die Textauswahl gelöscht wird.
 * 
 * @method getwiki - Setzt das ausgewählte Menüelement auf 'Wiki'.
 * 
 * @method getlink0 - Setzt das ausgewählte Menüelement auf 'Monitoringkarte'.
 * 
 * @method getlink1 - Setzt das ausgewählte Menüelement auf 'Datenimport'.
 * 
 * @method getlink2 - Setzt das ausgewählte Menüelement auf 'Monitoringdaten'.
 * 
 * @method getlink3 - Setzt das ausgewählte Menüelement auf 'Stammdaten'.
 * 
 * @method getlink4 - Setzt das ausgewählte Menüelement auf 'Nutzerverwaltung'.
 * 
 * @method getlink5 - Setzt das ausgewählte Menüelement auf 'Datenexport'.
 * 
 * @method getlink6 - Setzt das ausgewählte Menüelement auf 'Bewerten'.
 * 
 * @method toggleHelp - Schaltet den Hilfsstatus um.
 */
export class AppComponent  implements OnInit{
  // @ViewChild('link1') link1: ElementRef;
  // klebriges Menü
  // @ViewChild('stickyMenu') menuElement: ElementRef;
  title = 'WRRL BioDatenBank Senat Berlin';
// sticky:boolean=false;
menuPosition: any;
showMainContent = true;
selectedMenuItem: string = '';
  isHelpActive: boolean = false;
constructor(private router: Router,public authService:AuthService,private renderer: Renderer2, private helpService: HelpService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
}
@HostListener('window:keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  // Prevent zooming with CTRL + Mouse Wheel
  if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
    event.preventDefault();
  }

  // Prevent zooming with CTRL + Key shortcuts
  if (event.ctrlKey && (event.code === 'Equal' || event.code === 'Minus' || event.code === 'Digit0')) {
    event.preventDefault();
  }
}

@HostListener('wheel', ['$event'])
onWheel(event: WheelEvent): void {
  // Prevent zooming with CTRL + Mouse Wheel
  if (event.ctrlKey) {
    event.preventDefault();

  }
}
ngOnInit(): void {
  window.addEventListener('keydown', this.preventZoom, { passive: false });
  window.addEventListener('wheel', this.preventWheelZoom, { passive: false });
  this.router.events.subscribe(() => {
    // Prüfen, ob die aktuelle Route die Startseite ist
    this.disableMiniMenu();
   
    this.showMainContent = this.router.url !== '/';
  });
}
preventZoom(event: KeyboardEvent): void {
  if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
    event.preventDefault();
  }
}

preventWheelZoom(event: WheelEvent): void {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}

  //constructor(private _renderer2: Renderer2,){}

  //klebriges Menü
  
  ngAfterViewInit() {
    // this.menuPosition = this.menuElement.nativeElement.offsetTop;
    // this.ngZone.run(() => {
    //   // this.selectedMenuItem = 'Monitoringdaten';
    //   this.cdr.detectChanges(); // Manuell Änderungen erkennen
    // });
  }

  disableMiniMenu() {
    this.renderer.listen('document', 'selectionchange', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range && range.toString().length > 0) {
          // Clear the selection to prevent the mini menu from appearing
          selection.removeAllRanges();
        }
      }
    });
  }
// //klebriges Menü
// @HostListener('window:scroll', ['$event'])
// handleScroll() {
//   const windowScroll = window.pageYOffset;
//   // if (windowScroll >= this.menuPosition) {
//   //   this.sticky = true;
//   //   this.renderer.addClass(this.menuElement.nativeElement, 'sticky-header');
//   // } else {
//   //   this.sticky = false;
//   //   this.renderer.removeClass(this.menuElement.nativeElement, 'sticky-header');
//   // }
// }

getwiki() {
  this.selectedMenuItem = 'Wiki';
}
    
  getlink0() {
      
    this.selectedMenuItem = 'Monitoringkarte';
}
  getlink1() {
  
      this.selectedMenuItem = 'Datenimport';
  }
  getlink2() {

    this.selectedMenuItem = 'Monitoringdaten';
  }

  getlink3(){
 

    this.selectedMenuItem = 'Stammdaten';
  }

  getlink4(){
   
    this.selectedMenuItem = 'Nutzerverwaltung';
  }
  getlink5(){
   
    this.selectedMenuItem = 'Datenexport';
  }
  getlink6(){
   
    this.selectedMenuItem = 'Bewerten';
  }
  
  
  toggleHelp() {
    this.helpService.toggleHelp();
  }
}
