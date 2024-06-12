import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
// import {getWidth} from 'ol/extent.js';
// import {DragBox, Select} from 'ol/interaction.js';
// import {defaults as defaultControls} from 'ol/control.js';
import VectorLayer from 'ol/layer/Vector.js';
import Vector from 'ol/source/Vector';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import Overlay from 'ol/Overlay';
import WMTS from 'ol/source/WMTS.js';
import {fromLonLat, get as getProjection} from 'ol/proj.js';
import {getWidth} from 'ol/extent.js';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
 
  
  constructor(private router: Router,private authService: AuthService,private Farbebewertg: FarbeBewertungService) { }
  source_landesgrenze:TileWMS= new TileWMS({
    url: 'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Alandesgrenze&bbox=13.088347434997559%2C52.3382453918457%2C13.761159896850586%2C52.67551040649414&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers',
    params: {'LAYERS': 'ne:landesgrenze', 'TILED': false},
    serverType: 'geoserver',
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  });
  // source_landesgrenze:VectorSource= new VectorSource({
  // //  url:'https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_wfs_alkis_land?REQUEST=GetCapabilities&SERVICE=wfs',
  //   url:'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Alandesgrenze&bbox=13.088347434997559%2C52.3382453918457%2C13.761159896850586%2C52.67551040649414&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers',
  //   format: new GeoJSON(),});

  
  source_lw_bp1:VectorSource=new VectorSource({
    url:'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(), });
  source_lw_bp2:VectorSource=new VectorSource({
    url: 'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),});
  source_lw_bp3:VectorSource=new VectorSource({
      url:'http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),});
  source_rw_bp1:VectorSource=new VectorSource({
    url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson',
  format: new GeoJSON(), });
  source_rw_bp2:VectorSource=new VectorSource({
      url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(), });
  source_rw_bp3:VectorSource=new VectorSource({
       url:'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),});
  sourceBasemap:TileWMS= new TileWMS({
    url: 'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Ade_basemapde_web_raster_grau&bbox=-446461.42518830835%2C5510197.99206421%2C2465866.739975654%2C7912675.880069686&width=768&height=633&srs=EPSG%3A3857&styles=&format=application/openlayers',
    params: {'LAYERS': 'ne:de_basemapde_web_raster_grau', 'TILED': true},
    serverType: 'geoserver',
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  });

  

getColor(wert:string){
 return this.Farbebewertg.getColor(wert);
}

  map: Map;
  coordinate
  options:String;

 

  
  public fgw = {
   
    '1': new Style({
      stroke: new Stroke({
        color: this.getColor('1'),
       
        width: 4
      })
    }),
    '2': new Style({
      stroke: new Stroke({
        color: this.getColor('2'),
      
        width: 4
      })
    }),

    '3': new Style({
      stroke: new Stroke({
        color: this.getColor('3'),
      
        width: 4
      })
    }),

    '4': new Style({
      stroke: new Stroke({
        color:  this.getColor('4'),
        
        width: 4
      })
    }),
    '5': new Style({
      stroke: new Stroke({
        color:  this.getColor('5'),
       width: 4
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
       width: 1
      }),
      fill: new Fill({
        color: this.getColor('5')
      })
    })
    
  };
  

  view_geo_lw_oezk_bp2 = new VectorLayer({

    source: this.source_lw_bp2,
    style: (feature) => {


      return this.seen[feature.get('Ökz')];
    }
  });
  view_geo_lw_oezk_bp3 =  new VectorLayer({
   
    source: this.source_lw_bp3
    ,
    style: (feature) => {


      return this.seen[feature.get('Ökz')];
    }
  });
  view_geo_lw_oezk_bp1 =  new VectorLayer({
   
    source: this.source_lw_bp1,
    style: (feature) => {


      return this.seen[feature.get('Ökz')];
    }
    
  });

  //Fließgewässerlayer
view_geo_wk_oezk_bp2 =  new VectorLayer({
   
  source: this.source_rw_bp2,
  style: (feature) => {


    return this.fgw[feature.get('Ökz')];
  }
  
});
view_geo_wk_oezk_bp3 =  new VectorLayer({
   
  source: this.source_rw_bp3,
  
  style: (feature) => {
  return this.fgw[feature.get('Ökz')];
  }});
view_geo_wk_oezk_bp1 =  new VectorLayer({
   
  source: this.source_rw_bp1,
  style: (feature) => {
    return this.fgw[feature.get('Ökz')];
  }});


  // view_landegrenze =  new VectorLayer({
  //   source: this.source_landesgrenze,
  //   style: {
  //     'stroke-width': 4.75,
  //     'stroke-color': 'pink',
  //     // 'fill-color': 'rgba(100,100,100,0.25)',
  //   },
  // });


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
  //this.map.addLayer(this.view_landegrenze);
}




  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
        } 
    const status = document.getElementById('status');
    // const ign_source = new WMTS({
    //   url: 'http://localhost:8080/geoserver/ne/wms?service=WMS&version=1.1.0&request=GetMap',
    //   layer: 'ne:de_basemapde_web_raster_grau',
    //   matrixSet: 'GLOBAL_WEBMERCATOR',
    //   format: 'image/png',
    //   projection: proj3857,
    //   tileGrid: tileGrid,
    //   style: '',
    //   // attributions:''
    //     // '<a href="https://www.ign.fr/" target="_blank">' +
    //     // '<img src="https://wxs.ign.fr/static/logos/IGN/IGN.gif" title="Institut national de l\'' +
    //     // 'information géographique et forestière" alt="IGN"></a>'
        
    // });
    

    var view = new View({
      center: [0, 0],
      zoom: 2
    });

    
    let popup = new Overlay({
      element: document.getElementById('popup'), 
     
    });
    this.map = new Map({
      //  overlays: [overlay],
      // controls: defaultControls().extend([this.mousePositionControl]),
      layers: [
        
        new TileLayer({
          // extent: [-13884991, 2870341, -7455066, 6338219],
          source: this.sourceBasemap,
        }),
       
        new TileLayer({
          // style: {
          //       'stroke-width': 4.75,
          //       'stroke-color': 'pink',
          //       // 'fill-color': 'rgba(100,100,100,0.25)',
          //     },
          source: this.source_landesgrenze,
        }),
        
      ], 
    
     
      target: 'ol-map',
      view: new View({
        center: [1512406.33, 6880500.21],
        zoom: 10,
      }),
   
   
    })
    
    ;

  //  this.map.setView(view);
   this.map.addOverlay(popup);
  

  var container = document.getElementById('popup');
  

    const selectStyle = new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 1.7)',
        width: 2,
      }),
    });
    
  
    
    let selected = null;
    this.map.on('pointermove', function (e) {
      if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
       
      };
    
       this.forEachFeatureAtPixel(e.pixel, function (f) {

        
        
        selected = f;
        selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
        f.setStyle(selectStyle);
        return true;
      });
      container.innerHTML ='';
      if (selected) {
        container.innerHTML =  selected.get('wk_name')+" ("+selected.get('jahr')+") Ökologischer Zustand: " + + selected.get('Ökz')+"<br>"+
        
        "<table border=2> <tr ><th font-weight=normal>Makrophten</th> <th>Diatomeen</th><th>Phytoplankton</th><th>Makrozoobenthos</th><th>Fische</th></tr>" +
         "<tr> <td align=center>" + selected.get('Ökz_tk_mp')+"</td><td align=center>" + selected.get('Ökz_tk_dia')+"</td> <td align=center>" + selected.get('Ökz_qk_p')+"</td><td align=center>" 
         + selected.get('Ökz_qk_mzb')+"</td> <td align=center>" + selected.get('Ökz_qk_f')+"</td></tr></table/"
        
       console.log(container.innerHTML)
        var coordinate = e.coordinate;
       
        popup.setPosition(coordinate);
        popup.setOffset([10,2]);
       // displayFeatureInfo(e.pixel, coordinate);
      } else {
         status.innerHTML = '&nbsp;';
        container.innerHTML == status.innerHTML;
        popup.setPosition([0,0]);
        
      }
    });
 
    
  }


     
  


}