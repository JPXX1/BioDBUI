import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FarbeBewertungService {

  getColor(OZK: string): string {
    switch (true) {
      case OZK && OZK.startsWith('1') && ((OZK.length < 4 && OZK.endsWith('°')) || (OZK.length < 4 && OZK.endsWith('*')) || OZK.length === 1):
        return 'rgb(0, 158, 224)';
        case OZK && OZK.startsWith('2') && ((OZK.length < 4 && OZK.endsWith('°')) || (OZK.length < 4 && OZK.endsWith('*')) || OZK.length === 1):
    
        return 'rgb(0, 144, 54)';
        case OZK && OZK.startsWith('3') && ((OZK.length < 4 && OZK.endsWith('°')) || (OZK.length < 4 && OZK.endsWith('*')) || OZK.length === 1):
    
        return 'rgb(255, 255, 0)';
        case OZK && OZK.startsWith('4') && ((OZK.length < 4 && OZK.endsWith('°')) || (OZK.length < 4 && OZK.endsWith('*')) || OZK.length === 1):
    
        return 'rgb(255, 153, 0)';
        case OZK && OZK.startsWith('5') && ((OZK.length < 4 && OZK.endsWith('°')) ||(OZK.length < 4 && OZK.endsWith('*')) || OZK.length === 1):
    
        return 'rgb(226, 0, 26)';
      default:
        return 'rgb(255, 255, 255)'; // white
    }}
  getColorRL(RL) {
    switch (RL) {
      case '0':
        return 'rgb(226, 0, 26)';
      case '1':
        return 'rgb(0, 158, 224)';
      case '2':
        return 'rgb(0, 144, 54)';
      case '3':
          return 'rgb(255, 255, 0)';
       case 'V':
        return 'rgb(226, 0, 26)';
        default:
          return 'withe';
    }
  }
  getColorArtfehltinDB(Wert:String) {
  //   if (Wert.includes("ID_ART nicht bekannt")){

  //     return 'rgb(226, 0, 26)';}
  //     else
  // {return 'withe';}

  
    }
    
    getColorFehler(Wert1:boolean,Wert2:boolean) {
      if (Wert1===false || Wert2===false){
  
        return 'rgb(226, 0, 26)';}
        else
    { return 'withe';}
  
    
      }
  getButtonAktivColor(aktiv:Number){
  if (aktiv===1)  {return 'rgb(220,220,220)';}
  else
  {return 'withe';}

  }
}
