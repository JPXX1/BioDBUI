import { Component,OnInit,AfterViewInit,AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapVBSelectionDialogComponent } from 'src/app/map-vbselection-dialog/map-vbselection-dialog.component';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { FarbeBewertungService } from 'src/app/services/farbe-bewertung.service';
import Overlay from 'ol/Overlay';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import {VerbreitungartenService} from 'src/app/services/verbreitungarten.service';
import { environment, environmentgeo } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import CircleStyle from 'ol/style/Circle';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit,AfterViewInit,AfterViewChecked {
  
  constructor(
    private helpService: HelpService,
    public dialog: MatDialog,
    private verbreitungartenService:VerbreitungartenService,
    private router: Router,
    private authService: AuthService,
    private Farbebewertg: FarbeBewertungService
  ) {}
    // WMTS capabilities URL
    private wmtsCapabilitiesUrl = 'https://sgx.geodatenzentrum.de/wmts_basemapde/1.0.0/WMTSCapabilities.xml';
    // private wmtsLayer: TileLayer;
  messstellenFilter: string = '';  // Speichert den aktuellen Filtertext
  map: Map;
  coordinate;
  options: String;
  verbreitung_text:string='';
  private geoserverUrl = environmentgeo.geoserverUrl;
  // selectedKomponentenIds: number[] = [];
  id_komponente:number=1;
  dbKomponenten: { id: number, Komponente: string }[] = [];
  // selectedTaxonIds: string [] = [];
  //allTaxons: { id_komponente: number, taxon: string }[] = [];
  taxon:string='';
  // filteredTaxons: { id_komponente: number, taxon: string }[] = [];
  isFliesgewasserChecked: boolean = false;
  isstartbp3Checked:boolean=false;
  isstartbp2Checked:boolean=false;
  isstartbp1Checked:boolean=false;
  isSeeChecked: boolean = false;
  isrepraesentFGWChecked: boolean = false;
  isrepraesentSeeChecked: boolean = false;
  isVerbreitungChecked: boolean = false;
  isRepraesentCheckedSEEdisable: boolean = true;
  isRepraesentCheckedFGWdisable: boolean = true;
  isFilterdisable: boolean = true;
   legendItems = [
    { color: this.getColor('1'), label: 'sehr gut (1)' },
    { color: this.getColor('2'), label: 'gut (2)' },
    { color: this.getColor('3'), label: 'mäßig (3)' },
    { color: this.getColor('4'), label: 'unbefriedigend (4)' },
    { color: this.getColor('5'), label: 'schlecht (5)' }
  ];



  private source_landesgrenze: TileWMS = new TileWMS({
    url: `${this.geoserverUrl}/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Alandesgrenze&bbox=13.088347434997559%2C52.3382453918457%2C13.761159896850586%2C52.67551040649414&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers`,
    params: {'LAYERS': 'ne:landesgrenze', 'TILED': false},
    serverType: 'geoserver',
    transition: 0,
  });
  private source_lw_bp1: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_lw_bp2: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_lw_bp3: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_geo_lw_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_rw_bp1: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp1&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_rw_bp2: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp2&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_rw_bp3: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_geo_wk_oezk_bp3&maxFeatures=50&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });

  // private sourceBasemap: TileWMS = new TileWMS({
  //   url: `${this.geoserverUrl}/ne/wms?service=WMS&version=1.1.0&request=GetMap&layers=ne%3Ade_basemapde_web_raster_grau&bbox=-446461.42518830835%2C5510197.99206421%2C2465866.739975654%2C7912675.880069686&width=768&height=633&srs=EPSG%3A3857&styles=&format=application/openlayers`,
  //   params: {'LAYERS': 'ne:de_basemapde_web_raster_grau', 'TILED': true},
  //   serverType: 'geoserver',
  //   transition: 0,
  // });
  private sourceFliesgewasserMessstellen: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_fgw_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private sourceSeeMessstellen: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_see_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private sourceVerbreitungMessstellen: VectorSource = new VectorSource({
    //http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_verbreitung_mst_geom&maxFeatures=50&outputFormat=application%2Fjson
    //url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_fgw_mst_geom&maxFeatures=50&outputFormat=application%2Fjson`,
    url: `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_verbreitung_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  
  private async loadWmtsLayer(): Promise<TileLayer> {
    const response = await fetch(this.wmtsCapabilitiesUrl);
    const capabilitiesText = await response.text();

    const parser = new WMTSCapabilities();
    const capabilities = parser.read(capabilitiesText);

    // Überprüfen der TileMatrixSets in der Konsole
    console.log(capabilities);

    // Verwenden des TileMatrixSet 'DE_EPSG_3857_ADV' und des Layers 'de_basemapde_web_raster_farbe'
    const options = optionsFromCapabilities(capabilities, {
      layer: 'de_basemapde_web_raster_grau',  // Layer-Name aus der Dokumentation
      matrixSet: 'DE_EPSG_3857_ADV'           // TileMatrixSet für Pseudo-Mercator (EPSG:3857)
    });

    // Überprüfen Sie die generierten Optionen in der Konsole
    console.log(options);

    // Rückgabe des WMTS TileLayers
    return new TileLayer({
      source: new WMTS(options)
    });
  }
    //Verbreitung von Arten Dialog
    openDialogVerbreitung(): void {
      this.map.removeLayer(this.VerbreitungMessstellenLayer);
      this.map.addLayer(this.VerbreitungMessstellenLayer);
      const dialogRef = this.dialog.open(MapVBSelectionDialogComponent, {
        width: '600px',
        data: {
          idkomp:this.id_komponente,
          dbKomponenten: this.dbKomponenten,
         taxon:this.taxon,// filteredTaxons: this.filteredTaxons,
          // allTaxons: this.allTaxons
        }
      });
  //Verbreitung von Arten-Dialog
      dialogRef.afterClosed().subscribe(result => {
        this.map.removeLayer(this.VerbreitungMessstellenLayer);
        this.verbreitung_text='';
        if (result) {
         this.id_komponente=result.idkomp;
          console.log('Ausgewählte taxa:', result.taxon);
          const min=result.min;
          const max=result.max;
          const taxon=result.taxon;
    // this.selectedTaxonIds=;
          this.verbreitung_text='Vorkommen von ' + taxon + ', Abfragezeitraum: ' + min + ' bis ' + max
         const dbarten= this.verbreitungartenService.dbArten.filter(excelspalten => excelspalten.jahr >=min && excelspalten.jahr<=max && excelspalten.taxon===taxon);
          let ids_mst: number[]=[];// 
          const uniqueMst = new Set(); 
         for (const art of dbarten) {
          //filtert die doppelten Mst raus
          if (!uniqueMst.has(art.id_mst)) {
            uniqueMst.add(art.id_mst); // Füge die Mst hinzu, wenn sie noch nicht existiert
            ids_mst.push(art.id_mst);
           
          }
       
              }
              this.filterVerbreitungMessstellenLayer(ids_mst);
        }
      });
    }
   
   // Funktion, die die Filterung durchführt
  filterLayer(source: VectorSource, layer: VectorLayer, filter: string,repreasent: boolean) {
    const features = source.getFeatures();
    
// Filtern der Features nach dem Namen (namemst)
    const filteredFeatures = features.filter(feature => {
      const namemst = feature.get('namemst') || '';
      const repraesentMst = feature.get('repraesent_mst') === repreasent;
      if (!filter || filter.trim() === '') {
        return namemst && repraesentMst;}
      else {
        return namemst.toLowerCase().includes(filter.toLowerCase()) && repraesentMst;}
    });
    
    // Neue Quelle nur mit gefilterten Features erstellen
    const filteredSource = new VectorSource({
      features: filteredFeatures,
    });

    // Den Layer mit der gefilterten Quelle aktualisieren
    layer.setSource(filteredSource);
    this.map.addLayer(layer);
  }

  // Funktion, die alle Features ohne Filter anzeigt
  showAllFeatures(source: VectorSource, layer: VectorLayer) {
    // Den Layer mit allen Features wiederherstellen
    layer.setSource(source);
    this.map.addLayer(layer);
  }
    ngAfterViewInit() {
	
      //	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
        this.helpService.registerMouseoverEvents();}
        ngAfterViewChecked() {
          this.helpService.registerMouseoverEvents();
        }


  // filtert die Messstellen durch die zuvor ausgewählten Arten und Untersuchungsjahre
  filterVerbreitungMessstellenLayer(ids_mst: number[]) {
    
     
    
   // this.toggleLayerVerbreitung(false);
    // Alle Features von der Quelle abrufen
    const features = this.sourceVerbreitungMessstellen.getFeatures();
 
    // Die Features nach den übergebenen id_mst-Werten filtern
    const filteredFeatures = features.filter(feature => ids_mst.includes(feature.get('id_mst')));
  
    // Neue Quelle nur mit gefilterten Features erstellen
    const filteredSource = new VectorSource({
      features: filteredFeatures,
    });
  
    // Den Layer aktualisieren
    this.VerbreitungMessstellenLayer.setSource(filteredSource);
    this.map.addLayer(this.VerbreitungMessstellenLayer);

  }
  
  getColor(wert: string) {
    return this.Farbebewertg.getColor(wert);
  }
  mstfgw = new Style({
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({color: 'black'}),
      stroke: new Stroke({
        color: 'black',
        width: 1
      })
    })
  });
mstsee = new Style({
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({color: 'brown'}),
      stroke: new Stroke({
        color: 'brown',
        width: 1
      })
    })
  });
  mstverbreitung = new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({color: 'green'}),
      stroke: new Stroke({
        color: 'black',
        width: 1
      })
    })
  });
  fgw = {
    '1': new Style({
      stroke: new Stroke({
        color: this.getColor('1'),
        width: 4,
      }),
    }),
    '2': new Style({
      stroke: new Stroke({
        color: this.getColor('2'),
        width: 4,
      }),
    }),
    '3': new Style({
      stroke: new Stroke({
        color: this.getColor('3'),
        width: 4,
      }),
    }),
    '4': new Style({
      stroke: new Stroke({
        color: this.getColor('4'),
        width: 4,
      }),
    }),
    '5': new Style({
      stroke: new Stroke({
        color: this.getColor('5'),
        width: 4,
      }),
    }),
  };

  seen = {
    '1': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: this.getColor('1'),
      }),
    }),
    '2': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: this.getColor('2'),
      }),
    }),
    '3': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: this.getColor('3'),
      }),
    }),
    '4': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: this.getColor('4'),
      }),
    }),
    '5': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: this.getColor('5'),
      }),
    }),
  };

  view_geo_lw_oezk_bp1 = new VectorLayer({
    source: this.source_lw_bp1,
    style: (feature) => this.seen[feature.get('Ökz')],
  });

  view_geo_lw_oezk_bp2 = new VectorLayer({
    source: this.source_lw_bp2,
    style: (feature) => this.seen[feature.get('Ökz')],
  });

  view_geo_lw_oezk_bp3 = new VectorLayer({
    source: this.source_lw_bp3,
    style: (feature) => this.seen[feature.get('Ökz')],
  });

  view_geo_wk_oezk_bp1 = new VectorLayer({
    source: this.source_rw_bp1,
    style: (feature) => this.fgw[feature.get('Ökz')],
  });

  view_geo_wk_oezk_bp2 = new VectorLayer({
    source: this.source_rw_bp2,
    style: (feature) => this.fgw[feature.get('Ökz')],
  });

  view_geo_wk_oezk_bp3 = new VectorLayer({
    source: this.source_rw_bp3,
    style: (feature) => this.fgw[feature.get('Ökz')],
  });

  fliesgewasserLayer = new VectorLayer({
    source: this.sourceFliesgewasserMessstellen,
     style: (feature) => this.mstfgw
  });

  seeLayer = new VectorLayer({
    source: this.sourceSeeMessstellen,
    style:(feature) =>  this.mstsee
 
  });
  VerbreitungMessstellenLayer = new VectorLayer({
    source: this.sourceVerbreitungMessstellen,
    style:(feature) =>  this.mstverbreitung
 
  });
  
  startbp1(checked: boolean) {
    if (checked){this.map.removeLayer(this.view_geo_wk_oezk_bp3);
    this.map.removeLayer(this.view_geo_wk_oezk_bp2);
    this.map.addLayer(this.view_geo_wk_oezk_bp1);

    this.map.removeLayer(this.view_geo_lw_oezk_bp3);
    this.map.removeLayer(this.view_geo_lw_oezk_bp2);
    this.map.addLayer(this.view_geo_lw_oezk_bp1);
  
  
    this.mstnachoben();
    this.isstartbp2Checked=false;
    this.isstartbp3Checked=false;}else{

      this.map.removeLayer(this.view_geo_wk_oezk_bp1);
      this.map.removeLayer(this.view_geo_lw_oezk_bp1);
    }
  }

  startbp2(checked: boolean) {
    if (checked){
    this.map.removeLayer(this.view_geo_wk_oezk_bp3);
    this.map.removeLayer(this.view_geo_wk_oezk_bp1);
    this.map.addLayer(this.view_geo_wk_oezk_bp2);

    this.map.removeLayer(this.view_geo_lw_oezk_bp3);
    this.map.removeLayer(this.view_geo_lw_oezk_bp1);
    this.map.addLayer(this.view_geo_lw_oezk_bp2);
    this.mstnachoben();
    this.isstartbp3Checked=false;
    this.isstartbp1Checked=false;}else{
      this.map.removeLayer(this.view_geo_wk_oezk_bp2);
      this.map.removeLayer(this.view_geo_lw_oezk_bp2);
    }
  }

  startbp3(checked: boolean) {
    if (checked){
    this.map.removeLayer(this.view_geo_wk_oezk_bp2);
    this.map.removeLayer(this.view_geo_wk_oezk_bp1);
    this.map.addLayer(this.view_geo_wk_oezk_bp3);
    
    this.map.removeLayer(this.view_geo_lw_oezk_bp2);
    this.map.removeLayer(this.view_geo_lw_oezk_bp1);
    this.map.addLayer(this.view_geo_lw_oezk_bp3);
    
  this.isstartbp2Checked=false;
  this.isstartbp1Checked=false;
  this.mstnachoben();}else{
    this.map.removeLayer(this.view_geo_wk_oezk_bp3);
    this.map.removeLayer(this.view_geo_lw_oezk_bp3);
  }
  }
  
mstnachoben(){

  if (this.isFliesgewasserChecked=== true){
    this.map.removeLayer(this.fliesgewasserLayer);
    this.map.addLayer(this.fliesgewasserLayer);
  }
  if (this.isSeeChecked=== true){
    this.map.removeLayer(this.seeLayer);
    this.map.addLayer(this.seeLayer);
  }
  
}

startalleSee(checked: boolean) {
  this.map.removeLayer(this.seeLayer);
  if (!checked){this.isrepraesentSeeChecked=false;this.isRepraesentCheckedSEEdisable=true;
    if (this.isFliesgewasserChecked===false){
      this.messstellenFilter='';this.isFilterdisable=true;
  }
  }
  if (checked) {this.isFilterdisable=false;
    this.isRepraesentCheckedSEEdisable=false;
  this.showAllFeatures(this.sourceSeeMessstellen, this.seeLayer);
  }
}
startalleFGW(checked: boolean) {
  this.map.removeLayer(this.fliesgewasserLayer);
  if (!checked){this.isrepraesentFGWChecked=false;
    this.isRepraesentCheckedFGWdisable=true;
    if (this.isSeeChecked===false){
      this.messstellenFilter='';this.isFilterdisable=true;
  }
}
  if (checked) {
    this.isFilterdisable=false;
    this.isRepraesentCheckedFGWdisable=false;
  this.showAllFeatures(this.sourceFliesgewasserMessstellen, this.fliesgewasserLayer);
  }
}
filterMessstellen(fgwchecked: boolean,seechecked: boolean,repraesent_mst_fgw: boolean,repraesent_mst_see: boolean) {
 
  this.toggleLayerseemst(seechecked,repraesent_mst_see);
  this.toggleLayerfgwmst(fgwchecked,repraesent_mst_fgw);
}
toggleLayerseemst(checked: boolean,repraesent_mst: boolean) {
  this.map.removeLayer(this.seeLayer);
  if (checked) {
    // if (!this.messstellenFilter || this.messstellenFilter.trim() === '') {
      
    //   this.showAllFeatures(this.sourceSeeMessstellen, this.seeLayer);
     
    // }else{
      // this.map.removeLayer(this.seeLayer);
      this.filterLayer(this.sourceSeeMessstellen, this.seeLayer,this.messstellenFilter,repraesent_mst);
      }
  }


toggleLayerfgwmst(checked: boolean,repraesent_mst: boolean) {
  this.map.removeLayer(this.fliesgewasserLayer);
  
  if (checked) {
    // if (!this.messstellenFilter || this.messstellenFilter.trim() === '') {
      
        // this.showAllFeatures(this.sourceFliesgewasserMessstellen, this.fliesgewasserLayer);
      // }else{
        this.filterLayer(this.sourceFliesgewasserMessstellen, this.fliesgewasserLayer,this.messstellenFilter,repraesent_mst);
        // }
  } 
}
  toggleLayerVerbreitung(checked: boolean) {
    if (checked) {
      this.map.addLayer(this.VerbreitungMessstellenLayer);
     
        }else{

          this.map.removeLayer(this.VerbreitungMessstellenLayer);
        }
  }
  verbreitungsdaten(){
   
    //this.verbreitungartenService.callArten();
this.verbreitungartenService.callKomponenten();

//this.allTaxons=this.verbreitungartenService.dbArtenListe;
this.dbKomponenten = this.verbreitungartenService.dbKomponenten;
  }


  private initializeMap(wmtsLayer: TileLayer): void {

    this. verbreitungsdaten();
    const status = document.getElementById('status');
    const view = new View({
      center: [0, 0],
      zoom: 2,
    });
    this.map = new Map({
      target: 'ol-map',
      layers: [
        wmtsLayer,  // WMTS-Layer Basemap
        new TileLayer({
          source: this.source_landesgrenze,  //  WMS-Layer der Landesgrenze
        }),
      ],
      view: new View({
        center: [1512406.33, 6880500.21], // Beispiel-Zentrum, bitte anpassen
        zoom: 10
      }),
    });

    const popup = new Overlay({
      element: document.getElementById('popup'),
    });
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
      }

      this.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
        f.setStyle(selectStyle);
        return true;
      });
      container.innerHTML = '';
      if (selected) {
        let wkName = selected.get('wk_name');
        let jahr = selected.get('jahr');
        let oekz = selected.get('Ökz');
        let namemst = selected.get('namemst');
      
        if (!namemst) {
          container.innerHTML =
            wkName +
            ' (' +
            jahr +
            ') Ökologischer Zustand: ' +
            oekz +
            '<br>' +
            '<table border=2> <tr ><th font-weight=normal>Makrophten</th> <th>Diatomeen</th><th>Phytoplankton</th><th>Makrozoobenthos</th><th>Fische</th></tr>' +
            '<tr> <td align=center>' +
            selected.get('Ökz_tk_mp') +
            '</td><td align=center>' +
            selected.get('Ökz_tk_dia') +
            '</td> <td align=center>' +
            selected.get('Ökz_qk_p') +
            '</td><td align=center>' +
            selected.get('Ökz_qk_mzb') +
            '</td> <td align=center>' +
            selected.get('Ökz_qk_f') +
            '</td></tr></table/';
        } else if (namemst) {
          container.innerHTML =
            namemst
           
        } else {
          container.innerHTML = 'Keine Daten verfügbar';
        }
      
        var coordinate = e.coordinate;
        popup.setPosition(coordinate);
        popup.setOffset([10, 2]);
      }
      //  else {
      //   status.innerHTML = 'Kein Objekt ausgewählt';
      //   container.innerHTML = status.innerHTML;
      //   popup.setPosition([0, 0]);
      // }
    });
    
  }




  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
   
      
    } this.loadWmtsLayer().then(wmtsLayer => {
      this.initializeMap(wmtsLayer);
    }).catch(error => {
      console.error('Error loading WMTS layer:', error);
    });

  //  this. verbreitungsdaten();
  //   const status = document.getElementById('status');
  //   const view = new View({
  //     center: [0, 0],
  //     zoom: 2,
  //   });
   
    // let popup = new Overlay({
    //   element: document.getElementById('popup'),
    // });

    // this.map = new Map({
    //   layers: [
    //     new TileLayer({
    //       source: this.sourceBasemap,
    //     }),
    //     new TileLayer({
    //       source: this.source_landesgrenze,
    //     }),
    //   ],
    //   target: 'ol-map',
    //   view: new View({
    //     center: [1512406.33, 6880500.21],
    //     zoom: 10,
    //   }),
    // });

    // this.map.addOverlay(popup);
    
    // var container = document.getElementById('popup');

    // const selectStyle = new Style({
    //   fill: new Fill({
    //     color: '#eeeeee',
    //   }),
    //   stroke: new Stroke({
    //     color: 'rgba(255, 255, 255, 1.7)',
    //     width: 2,
    //   }),
    // });

    // let selected = null;
    // this.map.on('pointermove', function (e) {
    //   if (selected !== null) {
    //     selected.setStyle(undefined);
    //     selected = null;
    //   }

    //   this.forEachFeatureAtPixel(e.pixel, function (f) {
    //     selected = f;
    //     selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
    //     f.setStyle(selectStyle);
    //     return true;
    //   });
    //   container.innerHTML = '';
    //   if (selected) {
    //     let wkName = selected.get('wk_name');
    //     let jahr = selected.get('jahr');
    //     let oekz = selected.get('Ökz');
    //     let namemst = selected.get('namemst');
      
    //     if (!namemst) {
    //       container.innerHTML =
    //         wkName +
    //         ' (' +
    //         jahr +
    //         ') Ökologischer Zustand: ' +
    //         oekz +
    //         '<br>' +
    //         '<table border=2> <tr ><th font-weight=normal>Makrophten</th> <th>Diatomeen</th><th>Phytoplankton</th><th>Makrozoobenthos</th><th>Fische</th></tr>' +
    //         '<tr> <td align=center>' +
    //         selected.get('Ökz_tk_mp') +
    //         '</td><td align=center>' +
    //         selected.get('Ökz_tk_dia') +
    //         '</td> <td align=center>' +
    //         selected.get('Ökz_qk_p') +
    //         '</td><td align=center>' +
    //         selected.get('Ökz_qk_mzb') +
    //         '</td> <td align=center>' +
    //         selected.get('Ökz_qk_f') +
    //         '</td></tr></table/';
    //     } else if (namemst) {
    //       container.innerHTML =
    //         namemst
           
    //     } else {
    //       container.innerHTML = 'Keine Daten verfügbar';
    //     }
      
    //     var coordinate = e.coordinate;
    //     popup.setPosition(coordinate);
    //     popup.setOffset([10, 2]);
    //   }
    //   //  else {
    //   //   status.innerHTML = 'Kein Objekt ausgewählt';
    //   //   container.innerHTML = status.innerHTML;
    //   //   popup.setPosition([0, 0]);
    //   // }
    // });
  
  }
  
}