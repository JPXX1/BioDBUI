import { Component,OnInit,AfterViewInit,AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapVBSelectionDialogComponent } from 'src/app/map-vbselection-dialog/map-vbselection-dialog.component';
import Map from 'ol/Map';
import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { getWidth } from 'ol/extent';
import {Fill, Stroke, Style} from 'ol/style.js';
import Point from 'ol/geom/Point';  // Importiere den Punkt-Typ
//import Feature from 'ol/Feature';
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
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
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
  isErsterBPChecked: boolean = false;  // Variable für den Checkbox-Status
  pieChartLayer: VectorLayer | null = null;
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

  private source_landesgrenze: VectorSource = new VectorSource({
    format: new GeoJSON(),
    url: (extent) => 
      `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_landesgrenze&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=${extent.join(',')},EPSG:3857`,
    strategy: bboxStrategy
  });
//http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_landesgrenze&maxFeatures=50&outputFormat=application%2Fjson
  // private source_landesgrenze: TileWMS = new TileWMS({
  //   url: `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_landesgrenze&maxFeatures=50&outputFormat=application%2Fjson`,
  //   params: {'LAYERS': 'ne:landesgrenze', 'TILED': false},
  //   serverType: 'geoserver',
  //   transition: 0,
  // });
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

  
  private sourceFliesgewasserMessstellen: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_fgw_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private sourceSeeMessstellen: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_see_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private sourceVerbreitungMessstellen: VectorSource = new VectorSource({
    //http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_verbreitung_mst_geom&maxFeatures=50&outputFormat=application%2Fjson
    //url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_stam_fgw_mst_geom&maxFeatures=50&outputFormat=application%2Fjson`,
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_verbreitung_mst_geom&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });

  //http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp1&maxFeatures=50&outputFormat=application%2Fjson
  private source_lw_bp3_with_pie = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp1&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });

  private async loadWmtsLayer(): Promise<TileLayer> {
    const response = await fetch(this.wmtsCapabilitiesUrl);
    const capabilitiesText = await response.text();

    const parser = new WMTSCapabilities();
    const capabilities = parser.read(capabilitiesText);

    // Überprüfen der TileMatrixSets in der Konsole
    //console.log(capabilities);

    // Verwenden des TileMatrixSet 'DE_EPSG_3857_ADV' und des Layers 'de_basemapde_web_raster_farbe'
    const options = optionsFromCapabilities(capabilities, {
      layer: 'de_basemapde_web_raster_grau',  // Layer-Name aus der Dokumentation
      matrixSet: 'DE_EPSG_3857_ADV'           // TileMatrixSet für Pseudo-Mercator (EPSG:3857)
    });

    // Überprüfen Sie die generierten Optionen in der Konsole
    //console.log(options);

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
        removePieChartLayer() {
          if (this.pieChartLayer) {
            this.map.removeLayer(this.pieChartLayer);
            this.pieChartLayer = null;
          }
        }
        createPieChartLayer() {
          const messstellenLayer = new VectorLayer({
            source: this.source_lw_bp3_with_pie,
            style: this.mstfgw,  // Brauner Stil für Messstellen
          });
        
          this.pieChartLayer = new VectorLayer({
            source: this.source_lw_bp3_with_pie,
            style: (feature: FeatureLike) => {
              const realFeature = feature as Feature<Geometry>;
              const geometry = realFeature.getGeometry();
        
              if (geometry?.getType() === 'Point') {
                const pointGeometry = geometry as Point;
                const coordinates = pointGeometry.getCoordinates();  // EPSG:3857 Koordinaten
        
                // Hole die Daten aus dem Feature
                const data = [
                  realFeature.get('ÖKZ_QK_MZB'),  // Daten aus den vier Feldern
                  realFeature.get('ÖKZ_QK_P'),
                  realFeature.get('ÖKZ_TK_Dia'),
                  realFeature.get('ÖKZ_TK_MP')
                ];
        
                realFeature.set('chartData', data);
        
                return new Style({
                  image: new CircleStyle({
                    radius: 20,
                    fill: new Fill({ color: '#ffffff' }),
                  }),
                  renderer: (geometry, state) => {
                    const ctx = state.context;
                    ctx.save();
                    const pixel = this.map.getPixelFromCoordinate(coordinates);
                    
                    const view = this.map.getView();
                //    console.log(view.getProjection.name);
                      // Berechne die Breite der Karte in Pixeln basierend auf der Projektion und Auflösung
            // const width = getWidth(view.getProjection().getExtent()) / view.getResolution();
            

            const resolution = view.getResolution();
            const width = getWidth(view.getProjection().getExtent()) / resolution;
            
            // Bereinige die X-Koordinate unter Berücksichtigung der aktuellen Auflösung
            const pixelX = ((pixel[0] ) - (18000 / resolution));
            const pixelY = ((pixel[1] ) - (6000 / resolution));
            //console.log('Pixelkoordinaten:', pixel, 'Auflösung:', resolution);

            // // Bereinige die X-Koordinate
            // const pixelX = (((pixel[0]-120) % width) + width) % width;
            // const pixelY = pixel[1]-100;  // Y-Koordinate bleibt unverändert
                   
                    // Konvertiere geografische Koordinaten in Pixelkoordinaten
                    // const pixelCoords = this.map.getPixelFromCoordinate(pixel);
                    
                    // Wenn die Pixelkoordinaten vorhanden sind, zeichne das Diagramm
                    if (this.map.getPixelFromCoordinate(pixel)) {
                      const chartData = realFeature.get('chartData');
                      if (chartData) {
                        //console.log('Zeichne Tortendiagramm an:', pixelCoords[0], pixelCoords[1]);
        
                        // Zeichne das Tortendiagramm an den berechneten Pixelkoordinaten
                        this.drawQuarterPieChart(ctx, chartData, pixelX, pixelY);
                      }
                    }
        
                    ctx.restore();
                  },
                });
              }
        
              return new Style();  // Falls keine Punkt-Geometrie vorhanden ist
            },
          });
        
          // Füge die Layer zur Karte hinzu
          this.map.addLayer(this.pieChartLayer);
          this.map.addLayer(messstellenLayer);
        }
        drawQuarterPieChart(ctx: CanvasRenderingContext2D, data: string[], x: number, y: number) {
          const totalSlices = 4;  // Vier Segmente
          const radius = 20;  // Radius des Tortendiagramms
          let startAngle = 0;
          const sliceAngle = (2 * Math.PI) / totalSlices;
        
          // Durchlaufe jedes Viertel des Tortendiagramms
          data.forEach((value) => {
            ctx.beginPath();
            ctx.moveTo(x, y);  // Setze die Startposition auf die Messstellenkoordinaten
            ctx.arc(x, y, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
        
            // Setze die Farbe je nach Datenwert
            ctx.fillStyle = this.getColor(value);
            ctx.fill();
                  // Setze den Rand um jedes Segment (dunkelgrau)
            ctx.strokeStyle = '#4D4D4D';  // Dunkelgrau
            ctx.lineWidth = 1;  // Schmaler Rand
            ctx.stroke();  // Zeichne den Rand um das Segment
            startAngle += sliceAngle;  // Aktualisiere den Startwinkel für das nächste Segment
          });
        }
        
        // createPieChartLayer() {
        //   const messstellenLayer = new VectorLayer({
        //     source: this.source_lw_bp3_with_pie,
        //     style: this.mstfgw,  // Weise den braunen Stil zu
        //   });
        //   this.pieChartLayer = new VectorLayer({
        //     source: this.source_lw_bp3_with_pie,
        //     style: (feature: FeatureLike) => {
        //       const realFeature = feature as Feature<Geometry>;
        //       const geometry = realFeature.getGeometry() as Point;
        //       const coordinates = geometry.getCoordinates();  // Diese sollten in EPSG:3857 vorliegen
        
        //       // Hole die Daten aus dem Feature
        //       const data = [
        //        realFeature.get('ÖKZ_QK_MZB'),  // Daten aus den vier Feldern
        //         realFeature.get('ÖKZ_QK_P'),
        //         realFeature.get('ÖKZ_TK_Dia'),
        //         realFeature.get('ÖKZ_TK_MP')
        //       ];
        
        //       realFeature.set('chartData', data);
        
        //       return new Style({
        //         image: new CircleStyle({
        //           radius: 20,  // Größe des Kreises
        //           fill: new Fill({
        //             color: '#ffffff',  // Hintergrundfarbe des Kreises
        //           }),
        //         }),
        //         renderer: (pixelCoordinates, state) => {
        //           const ctx = state.context;
        //           ctx.save();
        
        //           // Hole die Pixelkoordinaten für die aktuellen Koordinaten
        //           //const pixelCoords = state.coordinateToPixelTransform(coordinates);  // Falsche Funktion
        //           // Dies wird ersetzt durch
        //           const pixelCoords = this.map.getPixelFromCoordinate(coordinates);
        //           console.log('Pixel-Koordinaten:', pixelCoords);  // Prüfe die Pixelkoordinaten
        //           const chartData = realFeature.get('chartData');
        
        //           if (chartData) {
        //             // Verwende die korrekten Pixelkoordinaten für die Positionierung
        //             //ctx.translate(pixelCoords[0], pixelCoords[1]);
        //             ctx.translate(pixelCoords[0] - 100, pixelCoords[1] - 20);  // Falls ein Offset benötigt wird

        //             this.drawQuarterPieChart(ctx, chartData, 20);  // Zeichne das Tortendiagramm
        //           }
        
        //           ctx.restore();
        //         },
        //       });
        //     },
        //   });
        //   console.log(this.pieChartLayer);
        //   // Füge den Layer zur Karte hinzu
        //   this.map.addLayer(this.pieChartLayer);
        //   this.map.addLayer(messstellenLayer);
        // }
        
// Style-Funktion für die Tortendiagramme
// pieChartStyleFunction(feature, map) {
//   return new Style({
//     image: new CircleStyle({
//       radius: 20,  // Größe des Kreises
//       fill: new Fill({
//         color: '#ffffff',  // Hintergrundfarbe des Kreises
//       }),
//     }),
//     renderer: (pixelCoordinates, state) => {
//       const ctx = state.context;  // Canvas Context
//       ctx.save();

//       // Hole die Geometrie des Features (Punktgeometrie)
//       const geometry = feature.getGeometry();
//       if (geometry) {
//         // Hole die Koordinaten der Geometrie
//         const coordinates = geometry.getCoordinates();  // EPSG:3857 Koordinaten

//         // Verwandle die geografischen Koordinaten in Pixel-Koordinaten
//         const pixelCoords = map.getPixelFromCoordinate(coordinates);  // Verwende map.getPixelFromCoordinate()

//         const data = feature.get('chartData');  // Hole die Daten für das Tortendiagramm
//         if (data) {
//           // Zeichne an den umgewandelten Pixel-Koordinaten
//           ctx.translate(pixelCoords[0], pixelCoords[1]);
//           this.drawQuarterPieChart(ctx, data, 20);  // Zeichne den geviertelten Kreis
//         }
//       }

//       ctx.restore();
//     },
//   });
// }
pieChartStyleFunction(feature) {
  return new Style({
    image: new CircleStyle({
      radius: 20,  // Größe des Kreises
      fill: new Fill({
        color: '#ffffff',  // Hintergrundfarbe des Kreises
      }),
    }),
    renderer: (pixelCoordinates, state) => {
      const ctx = state.context;
      ctx.save();

      // Feature wird benötigt, um auf die Geometrie zuzugreifen
      const geometry = feature.getGeometry();
      if (geometry instanceof Point) {
        let coordinates = geometry.getCoordinates();  // Hole die Koordinaten des Punktes

        // Optional: Transformiere die Koordinaten, falls erforderlich (EPSG:4326 -> EPSG:3857)
     
        const x = coordinates[0]; // X-Koordinate
        const y = coordinates[1]; // Y-Koordinate

        // Zeichne einen Kreis an den Koordinaten des Punktes
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);  // X und Y werden einzeln übergeben
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Hole die Tortendiagramm-Daten und zeichne sie
        const chartData = feature.get('chartData');
        if (chartData) {
          this.drawQuarterPieChart(ctx, chartData, x, y);  // Zeichne das Tortendiagramm an den Koordinaten
        }
      }

      ctx.restore();
    },
  });
}

// drawQuarterPieChart(ctx: CanvasRenderingContext2D, data: string[], radius: number) {
//   const totalSlices = 4;
//   let startAngle = 0;
//   const sliceAngle = (2 * Math.PI) / totalSlices;

//   // Gehe durch jedes Viertel und verwende den String-Wert direkt
//   data.forEach((value) => {
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.arc(0, 0, radius, startAngle, startAngle + sliceAngle);
//     ctx.closePath();
//     ctx.fillStyle = this.getColor(value);  // Verwende die getColor-Funktion direkt
//     ctx.fill();
//     startAngle += sliceAngle;
//   });
// }



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
  drawQuarterPieChartWithLegend(ctx: CanvasRenderingContext2D, data: string[], labels: string[], x: number, y: number) {
    const totalSlices = 4;  // Anzahl der Segmente
    const radius = 20;  // Radius des Tortendiagramms
    const labelRadius = radius + 30;  // Abstand für die Beschriftungen
    let startAngle = 0;
    const sliceAngle = (2 * Math.PI) / totalSlices;
  
    // Durchlaufe jedes Viertel des Tortendiagramms
    data.forEach((value, index) => {
      // Tortendiagramm zeichnen
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
  
      // Füllfarbe setzen
      ctx.fillStyle = this.getColor(value);
      ctx.fill();
  
      // Rand um das Segment zeichnen
      ctx.strokeStyle = '#4D4D4D';
      ctx.lineWidth = 1;
      ctx.stroke();
  
      // Linie und Beschriftung hinzufügen
      const labelAngle = startAngle + sliceAngle / 2;  // Mittlerer Winkel des Segments
      const labelX = x + labelRadius * Math.cos(labelAngle);  // X-Position der Beschriftung
      const labelY = y + labelRadius * Math.sin(labelAngle);  // Y-Position der Beschriftung
  
      // Linie vom Segment zur Beschriftung zeichnen
      ctx.beginPath();
      ctx.moveTo(x + radius * Math.cos(labelAngle), y + radius * Math.sin(labelAngle));  // Start bei der Kante des Segments
      ctx.lineTo(labelX, labelY);  // Linie zur Beschriftung
      ctx.strokeStyle = '#000000';  // Farbe der Linie
      ctx.lineWidth = 1;
      ctx.stroke();
  
      // Beschriftung zeichnen
      ctx.font = '12px Arial';
      ctx.fillStyle = '#000000';  // Textfarbe
      ctx.textAlign = labelX > x ? 'left' : 'right';  // Textausrichtung je nach Seite
      ctx.fillText(labels[index], labelX, labelY);
  
      startAngle += sliceAngle;  // Aktualisiere den Startwinkel
    });
  }
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
  // Methode, um den Layer mit den Tortendiagrammen hinzuzufügen oder zu entfernen
  ersterBP(checked: boolean) {
    this.isErsterBPChecked = checked;  // Toggle den Checkbox-Status
  
    if (this.isErsterBPChecked) {
      // Layer mit Tortendiagrammen hinzufügen
      this.createPieChartLayer();
  
      // Finde das Canvas-Element und hole den 2D-Zeichenkontext (ctx)
      const legendCanvas = document.getElementById('legendCanvas') as HTMLCanvasElement;
      const ctx = legendCanvas.getContext('2d');  // Erstelle den 2D-Zeichenkontext
  
      if (ctx) {
        // Zeichne das Tortendiagramm auf der Legende
        const data = ['1', '2', '3', '4'];  // Die Werte der Segmente
        const labels = ['Makrozoobenthos', 'Phytoplankton', 'Diatomeen', 'Makrophyten'];  // Beschriftungen der Segmente
        this.drawQuarterPieChartWithLegend(ctx, data, labels, 150, 100);  // Zeichne das Diagramm in die Mitte des Canvas
      }
  
    } else {
      // Layer mit Tortendiagrammen entfernen
      this.removePieChartLayer();
  
      // Verstecke die Legende und lösche den Canvas-Inhalt
      const legendCanvas = document.getElementById('legendCanvas') as HTMLCanvasElement;
      const ctx = legendCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, legendCanvas.width, legendCanvas.height);  // Lösche den Canvas-Inhalt
      }
    }
  }F
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

// Stil ohne Füllung (nur Umrandung)
const styleWithoutFill = new Style({
  stroke: new Stroke({
    color: '#0000FF', // Schwarze Umrandung
    width: 2,         // Linienbreite
  }),
  fill: null, // Keine Füllung
});
const landesgrenzeLayer = new VectorLayer({
  source: this.source_landesgrenze,
  style: styleWithoutFill,  // Stil ohne Füllung anwenden
});
    this.map = new Map({
      target: 'ol-map',
      layers: [
        wmtsLayer,  // WMTS-Layer Basemap
        landesgrenzeLayer// new TileLayer({
        //   source: this.source_landesgrenze,  //  WMS-Layer der Landesgrenze
        // }),
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

      this.forEachFeatureAtPixel(e.pixel, function (f, layer) {

        if (layer === landesgrenzeLayer) {
          return false; // Beende die Verarbeitung für Landesgrenzen-Features
        }
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

  
  
  }
  
}