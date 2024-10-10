import { Component, Renderer2, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { HelpService } from '../app/services/help.service';
import { AuthService } from './auth/auth.service';

// import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('link1') link1: ElementRef;
  // klebriges Menü
  @ViewChild('stickyMenu') menuElement: ElementRef;
  title = 'WRRL BioDatenBank Senat Berlin';
sticky:boolean=false;
menuPosition: any;
selectedMenuItem: string = '';
  isHelpActive: boolean = false;
constructor(public authService:AuthService,private renderer: Renderer2, private helpService: HelpService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  this.helpService.helpActive$.subscribe(active => this.isHelpActive = active);
}
  //constructor(private _renderer2: Renderer2,){}

  //klebriges Menü
  
  ngAfterViewInit() {
    this.menuPosition = this.menuElement.nativeElement.offsetTop;
    this.ngZone.run(() => {
      this.selectedMenuItem = 'Monitoringdaten';
      this.cdr.detectChanges(); // Manuell Änderungen erkennen
    });
  }
  // navigateAndSetMenuItem(route: string, menuItem: string) {
  //   this.router.navigate([route]).then(() => {
  //     this.ngZone.run(() => {
  //       this.selectedMenuItem = menuItem;
  //       this.cdr.detectChanges(); // Manuell Änderungen erkennen
  //     });
  //   });
  // }
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
// @HostListener('window:scroll', ['$event'])
//     handleScroll(){
//         const windowScroll = window.pageYOffset;
//         if(windowScroll >= this.menuPosition){
//             this.sticky = true;
//         } else {
//             this.sticky = false;
//         }
//     }

    
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
