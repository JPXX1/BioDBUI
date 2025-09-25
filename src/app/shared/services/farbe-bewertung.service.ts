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
    /** Farbzuordnung 0–5; alles andere = weiß */
  getColor(val: number | string): string {
    const num = this.toOZKNumber(val);
    if (num == null) return 'rgb(255, 255, 255)';

    switch (num) {
      case 0: return 'rgb(224, 224, 224)'; // grau
      case 1: return 'rgb(0, 158, 224)';   // blau
      case 2: return 'rgb(0, 144, 54)';    // grün
      case 3: return 'rgb(255, 255, 0)';   // gelb
      case 4: return 'rgb(255, 153, 0)';   // orange
      case 5: return 'rgb(226, 0, 26)';    // rot
      default: return 'rgb(255, 255, 255)'; // weiß
    }
  }
  
    /** Robust: akzeptiert 0–5 als Zahl oder String, inkl. "1*", "2°", "3 " etc. */
  private toOZKNumber(val: unknown): number | null {
    if (val == null) return null;

    if (typeof val === 'number' && Number.isFinite(val)) return val;

    // String normalisieren
    const s = String(val).trim();
    if (!s) return null;

    // 1) Muster wie "1", "1*", "1°"
    const m = s.match(/^([0-5])(?:\s*[°*])?$/);
    if (m) return Number(m[1]);

    // 2) Falls der String mit 0–5 beginnt, nimm die erste Ziffer
    const m2 = s.match(/^([0-5])/);
    if (m2) return Number(m2[1]);

    // 3) Letzter Fallback: numerisch interpretieren (Komma berücksichtigen)
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? Math.round(n) : null;
  }
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
