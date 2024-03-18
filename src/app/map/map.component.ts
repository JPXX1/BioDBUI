import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import MousePosition from 'ol/control/MousePosition.js';
import { toStringHDMS,createStringXY } from 'ol/coordinate.js';
import { toLonLat } from 'ol/proj.js';
import {defaults as defaultControls} from 'ol/control.js';
import VectorLayer from 'ol/layer/Vector.js';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import Overlay from 'ol/Overlay';
import OSMXML from 'ol/format/OSMXML.js';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
 
  
  constructor(private Farbebewertg: FarbeBewertungService) { }

getColor(wert:string){
 return this.Farbebewertg.getColor(wert);
}

  map: Map;

  options:String;
  public fgw = {
   
    '1': new Style({
      stroke: new Stroke({
        color: this.getColor('1'),
       
        width: 2
      })
    }),
    '2': new Style({
      stroke: new Stroke({
        color: this.getColor('2'),
      
        width: 2
      })
    }),

    '3': new Style({
      stroke: new Stroke({
        color: this.getColor('3'),
      
        width: 2
      })
    }),

    '4': new Style({
      stroke: new Stroke({
        color:  this.getColor('4'),
        
        width: 2
      })
    }),
    '5': new Style({
      stroke: new Stroke({
        color:  this.getColor('5'),
       width: 2
      })
    })
  };
  public seen = {

    '1': new Style({
      stroke: new Stroke({
        color: 'black',
       
        width: 1
      }),
      fill: new Fill({
        color: this.getColor('1')
      })
    }),
    '2': new Style({
      stroke: new Stroke({
        color: 'black',
      
        width: 1
      }),
      fill: new Fill({
        color: this.getColor('2')
      })
    }),

    '3': new Style({
      stroke: new Stroke({
        color: 'black',
      
        width: 1
      }),
      fill: new Fill({
        color: this.getColor('3')
      })
    }),

    '4': new Style({
      stroke: new Stroke({
        color: 'black',
        
        width: 1
      }),
      fill: new Fill({
        color: this.getColor('4')
      })
    }),
    '5': new Style({
      stroke: new Stroke({
        color: 'black',
       width: 3
      }),
      fill: new Fill({
        color: this.getColor('5')
      })
    })
  };
  

    
   mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
  });
 
 
   
  


  
  
  view_geo_lw_oezk_bp2 = new VectorLayer({

    source: new VectorSource({

      url: 'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: (feature) => {


      return this.seen[feature.get('wert')];
    }
  });
  view_geo_lw_oezk_bp3 =  new VectorLayer({
   
    source: new VectorSource({
      
      url:'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson',
  
      format: new GeoJSON(),
  
      
    })
    ,
    style: (feature) => {


      return this.seen[feature.get('wert')];
    }
  });
  view_geo_lw_oezk_bp1 =  new VectorLayer({
   
    source: new VectorSource({
      // url: 'https://openlayers.org/data/vector/ecoregions.json',
      url:'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson',
  // url:'http://localhost:8080/geoserver/a/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=a%3Alwbody2&maxFeatures=50&outputFormat=application%2Fjson',
      format: new GeoJSON(),
   
     
      
    }),
    style: (feature) => {


      return this.seen[feature.get('wert')];
    }
    
  });
view_geo_wk_oezk_bp2 =  new VectorLayer({
   
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson',
// url:'http://localhost:8080/geoserver/a/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=a%3Alwbody2&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),
    
   
  // attributions:'geoserver'
   
    
  }),
  style: (feature) => {


    return this.fgw[feature.get('wert')];
  }
  
});
view_geo_wk_oezk_bp3 =  new VectorLayer({
   
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson',
// url:'http://localhost:8080/geoserver/a/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=a%3Alwbody2&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),
    
   
  // attributions:'geoserver'
   
    
  }),
  
  style: (feature) => {


    return this.fgw[feature.get('wert')];
  }
});
view_geo_wk_oezk_bp1 =  new VectorLayer({
   
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson',
// url:'http://localhost:8080/geoserver/a/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=a%3Alwbody2&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),
    
   
  // attributions:'geoserver'
   
     
  }),
  style: (feature) => {


    return this.fgw[feature.get('wert')];
  }


  
  
});



startbp1(){
  this.map.removeLayer( this.view_geo_wk_oezk_bp3)
  this.map.removeLayer( this.view_geo_wk_oezk_bp2)
  this.map.addLayer(this.view_geo_wk_oezk_bp1);

  this.map.removeLayer( this.view_geo_lw_oezk_bp3)
  this.map.removeLayer( this.view_geo_lw_oezk_bp2)
  this.map.addLayer(this.view_geo_lw_oezk_bp1); 
}
startbp2(){
  this.map.removeLayer( this.view_geo_wk_oezk_bp3);
  this.map.removeLayer( this.view_geo_wk_oezk_bp1);
  this.map.addLayer(this.view_geo_wk_oezk_bp2);
  this.map.removeLayer( this.view_geo_lw_oezk_bp3);
  this.map.removeLayer( this.view_geo_lw_oezk_bp1);
  this.map.addLayer(this.view_geo_lw_oezk_bp2);
}
startbp3(){
  this.map.removeLayer( this.view_geo_wk_oezk_bp2)
  this.map.removeLayer( this.view_geo_wk_oezk_bp1)
  this.map.addLayer(this.view_geo_wk_oezk_bp3);
  this.map.removeLayer( this.view_geo_lw_oezk_bp2)
  this.map.removeLayer( this.view_geo_lw_oezk_bp1)
  this.map.addLayer(this.view_geo_lw_oezk_bp3);
}




  ngOnInit(): void {
    
   
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');
    const overlay = new Overlay({
      element: container,
      autoPan: true
    });
 
    this.map = new Map({
      overlays: [overlay],
      controls: defaultControls().extend([this.mousePositionControl]),
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.7,
        }),
        
      ], 
      // layers: [
      //   new VectorLayer({
      //     source: new VectorSource({
      //       format: new GeoJSON(),
      //       url:'http://localhost:8080/geoserver/b/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=b%3ACALC_LWBODY_WK_DEBE_polygon&maxFeatures=50&outputFormat=application%2Fjson',
      //       // url: 'http://localhost:8080/geoserver/b/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=b%3ACALC_LWBODY_WK_DEBE_polygon&maxFeatures=50&outputFormat=text%2Fjavascript',
      //     }),
      //   }),
      // ],
     
      target: 'ol-map',
      view: new View({
        center: [1512406.33, 6880500.21],
        zoom: 10,
      }),
   
   
    });

    
    this.map.on('singleclick', function (evt: any) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
    
      content.innerHTML = '<p>Current coordinates are :</p><code>' + hdms +
        '</code>';
      overlay.setPosition(coordinate);
    });


    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    
   
    
  }


     




}