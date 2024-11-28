import { Component,Input } from '@angular/core';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-center-button',
  templateUrl: './center-button.component.html',
  styleUrls: ['./center-button.component.css']
})
/**
 * Die CenterButtonComponent ist verantwortlich dafür, die Karte auf einen bestimmten Ort zu zentrieren,
 * wenn die centerMap-Methode aufgerufen wird. Die Karteninstanz wird über eine @Input-Eigenschaft bereitgestellt.
 *
 * @example
 * <app-center-button [map]="mapInstance"></app-center-button>
 *
 * @property {Map | undefined} map - Die Karteninstanz, die zentriert werden soll, bereitgestellt über @Input.
 *
 * @method centerMap
 * Zentriert die Karte auf vordefinierte Koordinaten (Beispiel: Berlin) und setzt einen bestimmten Zoom-Level.
 * Diese Methode überprüft, ob die Karteninstanz definiert ist, bevor versucht wird, die Karte zu zentrieren.
 */
export class CenterButtonComponent { @Input() map: Map | undefined;  // Map wird nun über Input gebunden

centerMap() {
  if (this.map) {
    const view = this.map.getView();
    const targetCoordinates = fromLonLat([13.405, 52.52]); // Beispielkoordinaten, z.B. Berlin
    view.setCenter(targetCoordinates);
    view.setZoom(10.6); // Optional: Setze einen Zoom-Level
  }
}
}

