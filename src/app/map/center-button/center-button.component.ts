import { Component,Input } from '@angular/core';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-center-button',
  templateUrl: './center-button.component.html',
  styleUrls: ['./center-button.component.css']
})
export class CenterButtonComponent { @Input() map: Map | undefined;  // Map wird nun über Input gebunden

centerMap() {
  if (this.map) {
    const view = this.map.getView();
    const targetCoordinates = fromLonLat([13.405, 52.52]); // Beispielkoordinaten, z.B. Berlin
    view.setCenter(targetCoordinates);
    view.setZoom(10); // Optional: Setze einen Zoom-Level
  }
}
}

