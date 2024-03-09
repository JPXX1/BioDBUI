import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';

import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // map:Map;
  options:String;
  ngOnInit(): void {
    const parser = new WMTSCapabilities();
    let options;
    let map;
    
    fetch('https://sgx.geodatenzentrum.de/wmts_basemapde/1.0.0/?SERVICE=WMTS&REQUEST=GetCapabilities')
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
     
      const result = parser.read(text);
       options = optionsFromCapabilities(result, 
        {
        layer: 'de_basemapde_web_raster_farbe',
         matrixSet: 'GLOBAL_WEBMERCATOR',
        format: 'image/png',
        // projection: 'EPGS:3857',
        
      });
  





 
    });

  
    


    map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.7,
        }),
        new TileLayer({
          source:new TileWMS({
            url:'http://localhost:8080/geoserver/ne/wms',
            params: {'LAYERS': 'ne:rwbody', 'TILED': true},
            serverType:'geoserver',
            transition:0,

          })


        }),
        new TileLayer({
          source:new TileWMS({
            url:'http://localhost:8080/geoserver/WK/wms',
            params: {'LAYERS': 'WK:lwbody', 'TILED': true},
            serverType:'geoserver',
            transition:0,

          })


        }),
        // new TileLayer({
        //   opacity: 1,
        //   source: new WMTS(options),
        // }),
      ],
      target: 'ol-map',
      view: new View({
        center: [1512406.33, 6880500.21],
        zoom: 10,
      }),
    });





    // this.map = new Map({
    //   view: new View({
    //     center: [0, 0],
    //     zoom: 1,
    //   }),
    //   layers: [
    //     new TileLayer({
    //       source: new OSM(),
    //     }),
    //   ],
    //   target: 'ol-map'
    // });
  }

 





}