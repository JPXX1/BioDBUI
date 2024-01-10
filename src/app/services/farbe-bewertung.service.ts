import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FarbeBewertungService {

  getColor(OZK) {
    switch (OZK) {
      case '1':
        return 'rgb(0, 158, 224)';
      case '2':
        return 'rgb(0, 144, 54)';
        case '3':
          return 'rgb(255, 255, 0)';
          case '4':
        return 'rgb(255, 153, 0)';
        case '5':
        return 'rgb(226, 0, 26)';
        default:
          return 'withe';
    }
  }
}
