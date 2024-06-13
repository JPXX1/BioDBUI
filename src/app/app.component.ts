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
    const em = document.getElementById('link0');
    this._renderer2.setStyle(em, 'background-color', 'rgb(20,220,220)')
    const el = document.getElementById('link1');
    this._renderer2.removeStyle(el, 'background-color');  
    const ee = document.getElementById('link2');
    this._renderer2.removeStyle(ee,'background-color');  
    const ef = document.getElementById('link3');
    this._renderer2.removeStyle(ef,'background-color');  
  
}
  getlink1() {
    const em = document.getElementById('link0');
    this._renderer2.removeStyle(em, 'background-color');  
      const el = document.getElementById('link1');
      this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
      const ee = document.getElementById('link2');
      this._renderer2.removeStyle(ee,'background-color');  
      const ef = document.getElementById('link3');
      this._renderer2.removeStyle(ef,'background-color');  
    
  }
  getlink2() {
    const em = document.getElementById('link0');
    this._renderer2.removeStyle(em, 'background-color'); 
    const el = document.getElementById('link2');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('link1');
    this._renderer2.removeStyle(ee,'background-color');  
    const ef = document.getElementById('link3');
    this._renderer2.removeStyle(ef,'background-color'); 
  }

  getlink3(){
    const em = document.getElementById('link0');
    this._renderer2.removeStyle(em, 'background-color'); 
    const el = document.getElementById('link3');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('link1');
    this._renderer2.removeStyle(ee,'background-color');  
    const ef = document.getElementById('link2');
    this._renderer2.removeStyle(ef,'background-color'); 

  }

  getlink4(){
    const em = document.getElementById('link0');
    this._renderer2.removeStyle(em, 'background-color'); 
    const el = document.getElementById('link4');
    this._renderer2.setStyle(el, 'background-color', 'rgb(20,220,220)');  
    const ee = document.getElementById('link1');
    this._renderer2.removeStyle(ee,'background-color');  
    const ef = document.getElementById('link2');
    this._renderer2.removeStyle(ef,'background-color'); 
    const eg = document.getElementById('link3');
    this._renderer2.removeStyle(ef,'background-color'); 
  }
}
