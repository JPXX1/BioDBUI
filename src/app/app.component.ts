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
export class AppComponent  implements OnInit{
  // @ViewChild('link1') link1: ElementRef;
  // klebriges Menü
  @ViewChild('stickyMenu') menuElement: ElementRef;
  title = 'WRRL BioDatenBank Senat Berlin';
sticky:boolean=false;
menuPosition: any;
showMainContent = true;
selectedMenuItem: string = '';
  isHelpActive: boolean = false;
constructor(private router: Router,public authService:AuthService,private renderer: Renderer2, private helpService: HelpService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
}

ngOnInit(): void {
  this.router.events.subscribe(() => {
    // Prüfen, ob die aktuelle Route die Startseite ist
    console.log(this.router.url);
    this.showMainContent = this.router.url !== '/';
  });
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

//klebriges Menü
@HostListener('window:scroll', ['$event'])
handleScroll() {
  const windowScroll = window.pageYOffset;
  if (windowScroll >= this.menuPosition) {
    this.sticky = true;
    this.renderer.addClass(this.menuElement.nativeElement, 'sticky-header');
  } else {
    this.sticky = false;
    this.renderer.removeClass(this.menuElement.nativeElement, 'sticky-header');
  }
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
