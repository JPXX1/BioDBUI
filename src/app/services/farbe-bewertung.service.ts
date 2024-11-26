import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

  /**
    * Service zur Bewertung und Bestimmung von Farben basierend auf verschiedenen Eingabewerten.
     * Bestimmt die Farbe basierend auf dem angegebenen OZK-String.
     *
     * @param {string} OZK - Der Eingabestring, der zur Bestimmung der Farbe verwendet wird.
     * @returns {string} - Der entsprechende RGB-Farbstring.
     *
     * Die Funktion bewertet den Eingabestring `OZK` und gibt eine spezifische RGB-Farbe basierend auf den folgenden Bedingungen zurück:
     * - Wenn `OZK` mit '1' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(0, 158, 224)' zurück.
     * - Wenn `OZK` mit '2' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(0, 144, 54)' zurück.
     * - Wenn `OZK` mit '3' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(255, 255, 0)' zurück.
     * - Wenn `OZK` mit '4' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(255, 153, 0)' zurück.
     * - Wenn `OZK` mit '5' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(226, 0, 26)' zurück.
     * - Für jede andere Eingabe gibt sie 'rgb(255, 255, 255)' (weiß) zurück.
     */
export class FarbeBewertungService {

  /**
     * Bestimmt die Farbe basierend auf dem angegebenen OZK-String.
     *
     * @param {string} OZK - Der Eingabestring, der zur Bestimmung der Farbe verwendet wird.
     * @returns {string} - Der entsprechende RGB-Farbstring.
     *
     * Die Funktion bewertet den Eingabestring `OZK` und gibt eine spezifische RGB-Farbe basierend auf den folgenden Bedingungen zurück:
     * - Wenn `OZK` mit '1' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(0, 158, 224)' zurück.
     * - Wenn `OZK` mit '2' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(0, 144, 54)' zurück.
     * - Wenn `OZK` mit '3' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(255, 255, 0)' zurück.
     * - Wenn `OZK` mit '4' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(255, 153, 0)' zurück.
     * - Wenn `OZK` mit '5' beginnt und entweder mit '°' oder '*' endet und seine Länge weniger als 4 beträgt oder seine Länge 1 ist, gibt sie 'rgb(226, 0, 26)' zurück.
     * - Für jede andere Eingabe gibt sie 'rgb(255, 255, 255)' (weiß) zurück.
     */
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
  /**
     * Gibt den entsprechenden RGB-Farbcode basierend auf dem angegebenen RL-Wert zurück.
     *
     * @param {string} RL - Der RL-Wert, der die Farbe bestimmt. 
     *                      Mögliche Werte sind '0', '1', '2', '3' und 'V'.
     * @returns {string} - Der RGB-Farbcode als String. Wenn der RL-Wert keinem Fall entspricht, wird 'white' zurückgegeben.
     */
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
    
        /**
         * Bestimmt die Farbe basierend auf den angegebenen booleschen Werten.
         *
         * @param Wert1 - Der erste boolesche Wert.
         * @param Wert2 - Der zweite boolesche Wert.
         * @returns Ein String, der die Farbe darstellt. Gibt 'rgb(226, 0, 26)' zurück, wenn entweder Wert1 oder Wert2 false ist, andernfalls 'white'.
         */
    getColorFehler(Wert1:boolean,Wert2:boolean) {
      if (Wert1===false || Wert2===false){
  
        return 'rgb(226, 0, 26)';}
        else
    { return 'withe';}
  
    
      }
  /**
   * Gibt die Farbe für einen Button basierend auf seinem Aktivzustand zurück.
   *
   * @param aktiv - Der Aktivzustand des Buttons. Wenn `aktiv` 1 ist, wird der Button als aktiv betrachtet.
   * @returns Die Farbe des Buttons als String. Wenn der Button aktiv ist, wird 'rgb(220,220,220)' zurückgegeben; andernfalls 'weiß'.
   */
  getButtonAktivColor(aktiv:Number){
  if (aktiv===1)  {return 'rgb(220,220,220)';}
  else
  {return 'withe';}

  }
}
