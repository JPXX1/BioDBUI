import { Component,Renderer2,ViewChild,ElementRef,HostListener} from '@angular/core';

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
  constructor(private _renderer2: Renderer2,){}
  selectedMenuItem: string = '';
  //klebriges Menü
  
  ngAfterViewInit(){
    this.menuPosition = this.menuElement.nativeElement.offsetTop
}

//klebriges Menü
@HostListener('window:scroll', ['$event'])
    handleScroll(){
        const windowScroll = window.pageYOffset;
        if(windowScroll >= this.menuPosition){
            this.sticky = true;
        } else {
            this.sticky = false;
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
   
    this.selectedMenuItem = 'Administration';
  }
}
