import { Component,OnInit,AfterViewInit,AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MapVBSelectionDialogComponent } from 'src/app/map/map-vbselection-dialog/map-vbselection-dialog.component';
import Map from 'ol/Map';
import { defaults as defaultControls } from 'ol/control';
import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { DEVICE_PIXEL_RATIO } from 'ol/has';
import {Fill, Stroke, Style} from 'ol/style.js';
import Point from 'ol/geom/Point';  // Importiere den Punkt-Typ
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { FarbeBewertungService } from 'src/app/shared/services/farbe-bewertung.service';
import Overlay from 'ol/Overlay';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import {VerbreitungartenService} from 'src/app/shared/services/verbreitungarten.service';
import { environment, environmentgeo } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import CircleStyle from 'ol/style/Circle';
import { HelpService } from 'src/app/shared/services/help.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
/**
 * Die MapComponent-Klasse ist verantwortlich für die Verwaltung und Anzeige einer Karte mit verschiedenen Ebenen und Features.
 * Sie integriert mehrere Dienste, um geospatiale Daten abzurufen und anzuzeigen, und bietet Funktionen zum Filtern und Visualisieren dieser Daten auf der Karte.
 * 
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {AfterViewChecked}
 * 
 * @constructor
 * @param {HelpService} helpService - Dienst zum Registrieren von Mouseover-Ereignissen.
 * @param {MatDialog} dialog - Dienst zum Öffnen von Dialogen.
 * @param {VerbreitungartenService} verbreitungartenService - Dienst zur Verwaltung von Verbreitungsdaten von Arten.
 * @param {Router} router - Dienst zur Navigation.
 * @param {AuthService} authService - Dienst zur Authentifizierung.
 * @param {FarbeBewertungService} Farbebewertg - Dienst zur Farbbewertung.
 * 
 * @property {string} wmtsCapabilitiesUrl - URL für WMTS-Fähigkeiten.
 * @property {VectorLayer | null} activeBpPieLayer - Aktive Tortendiagramm-Ebene.
 * @property {string} messstellenFilter - Aktueller Filtertext für Messstellen.
 * @property {Map} map - OpenLayers-Karteninstanz.
 * @property {any} coordinate - Koordinaten für die Karte.
 * @property {string} options - Optionen für die Karte.
 * @property {string} verbreitung_text - Text für die Verbreitung von Arten.
 * @property {string} geoserverUrl - URL für den GeoServer.
 * @property {number} id_komponente - ID der ausgewählten Komponente.
 * @property {Array<{ id: number, Komponente: string }>} dbKomponenten - Array von Komponenten aus der Datenbank.
 * @property {string} taxon - Ausgewähltes Taxon.
 * @property {boolean} isFliesgewasserChecked - Status der Fliesgewasser-Checkbox.
 * @property {boolean} isstartbp3Checked - Status der startbp3-Checkbox.
 * @property {boolean} isstartbp2Checked - Status der startbp2-Checkbox.
 * @property {boolean} isstartbp1Checked - Status der startbp1-Checkbox.
 * @property {boolean} isSeeChecked - Status der See-Checkbox.
 * @property {boolean} isrepraesentFGWChecked - Status der repraesentFGW-Checkbox.
 * @property {boolean} isrepraesentSeeChecked - Status der repraesentSee-Checkbox.
 * @property {boolean} isVerbreitungChecked - Status der Verbreitung-Checkbox.
 * @property {boolean} isErsterBPChecked - Status der ErsterBP-Checkbox.
 * @property {boolean} isZweiterBPChecked - Status der ZweiterBP-Checkbox.
 * @property {boolean} isDritterBPChecked - Status der DritterBP-Checkbox.
 * @property {boolean} isVierterBPChecked - Status der VierterBP-Checkbox.
 * @property {VectorLayer | null} pieChartLayer - Ebene für Tortendiagramme.
 * @property {boolean} isRepraesentCheckedSEEdisable - Deaktivierungsstatus für die repraesentSee-Checkbox.
 * @property {boolean} isRepraesentCheckedFGWdisable - Deaktivierungsstatus für die repraesentFGW-Checkbox.
 * @property {boolean} isFilterdisable - Deaktivierungsstatus für den Filter.
 * @property {Array<{ color: string, label: string }>} legendItems - Array von Legenden-Elementen.
 * @property {VectorSource} source_landesgrenze - Quelle für die Landesgrenze-Ebene.
 * @property {VectorSource} source_aus_daten_lw_bp2 - Quelle für die aus_daten_lw_bp2-Ebene.
 * @property {VectorSource} source_aus_daten_lw_bp3 - Quelle für die aus_daten_lw_bp3-Ebene.
 * @property {VectorSource} source_aus_daten_lw_bp4 - Quelle für die aus_daten_lw_bp4-Ebene.
 * @property {VectorSource} source_aus_daten_rw_bp2 - Quelle für die aus_daten_rw_bp2-Ebene.
 * @property {VectorSource} source_aus_daten_rw_bp3 - Quelle für die aus_daten_rw_bp3-Ebene.
 * @property {VectorSource} source_aus_daten_rw_bp4 - Quelle für die aus_daten_rw_bp4-Ebene.
 * @property {VectorSource} source_lw_bp1 - Quelle für die lw_bp1-Ebene.
 * @property {VectorSource} source_lw_bp2 - Quelle für die lw_bp2-Ebene.
 * @property {VectorSource} source_lw_bp3 - Quelle für die lw_bp3-Ebene.
 * @property {VectorSource} source_rw_bp1 - Quelle für die rw_bp1-Ebene.
 * @property {VectorSource} source_rw_bp2 - Quelle für die rw_bp2-Ebene.
 * @property {VectorSource} source_rw_bp3 - Quelle für die rw_bp3-Ebene.
 * @property {VectorSource} sourceFliesgewasserMessstellen - Quelle für die FliesgewasserMessstellen-Ebene.
 * @property {VectorSource} sourceSeeMessstellen - Quelle für die SeeMessstellen-Ebene.
 * @property {VectorSource} sourceVerbreitungMessstellen - Quelle für die VerbreitungMessstellen-Ebene.
 * @property {VectorSource} source_lw_bp3_with_pie - Quelle für die lw_bp3_with_pie-Ebene.
 * @property {VectorSource} source_lw_bp2_with_pie - Quelle für die lw_bp2_with_pie-Ebene.
 * @property {VectorSource} source_lw_bp1_with_pie - Quelle für die lw_bp1_with_pie-Ebene.
 * @property {VectorSource} source_lw_bp4_with_pie - Quelle für die lw_bp4_with_pie-Ebene.
 * 
 * @method loadWmtsLayer - Lädt die WMTS-Ebene.
 * @method openDialogVerbreitung - Öffnet den Verbreitungsdialog.
 * @method filterLayer - Filtert die Ebene basierend auf dem angegebenen Filtertext und Repräsentationsstatus.
 * @method showAllFeatures - Zeigt alle Features der Ebene an.
 * @method ngAfterViewInit - Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
 * @method ngAfterViewChecked - Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente überprüft wurde.
 * @method removePieChartLayer - Entfernt die Tortendiagramm-Ebene von der Karte.
 * @method createPieChartLayer - Erstellt und fügt eine Tortendiagramm-Ebene zur Karte hinzu.
 * @method drawQuarterPieChart - Zeichnet ein Viertel-Tortendiagramm auf die Leinwand.
 * @method filterVerbreitungMessstellenLayer - Filtert die VerbreitungMessstellen-Ebene basierend auf den angegebenen IDs.
 * @method getColor - Holt die Farbe basierend auf dem angegebenen Wert.
 * @method startbp1 - Schaltet die Sichtbarkeit der bp1-Ebene um.
 * @method startbp2 - Schaltet die Sichtbarkeit der bp2-Ebene um.
 * @method startbp3 - Schaltet die Sichtbarkeit der bp3-Ebene um.
 * @method toggleSingleBpLayer - Schaltet die Sichtbarkeit einer einzelnen bp-Ebene um.
 * @method drawLegend - Zeichnet die Legende auf die Leinwand.
 * @method clearLegend - Löscht die Legende von der Leinwand.
 * @method ersterBP - Schaltet die Sichtbarkeit der ErsterBP-Ebene um.
 * @method zweiterBP - Schaltet die Sichtbarkeit der ZweiterBP-Ebene um.
 * @method removeallbp - Entfernt alle bp-Ebenen von der Karte.
 * @method dritterBP - Schaltet die Sichtbarkeit der DritterBP-Ebene um.
 * @method vierterBP - Schaltet die Sichtbarkeit der VierterBP-Ebene um.
 * @method mstnachoben - Verschiebt die Messstellen-Ebenen nach oben.
 * @method startalleSee - Schaltet die Sichtbarkeit aller See-Ebenen um.
 * @method startalleFGW - Schaltet die Sichtbarkeit aller FGW-Ebenen um.
 * @method filterMessstellen - Filtert die Messstellen-Ebenen basierend auf den angegebenen Parametern.
 * @method toggleLayerseemst - Schaltet die Sichtbarkeit der See-Messstellen-Ebene um.
 * @method toggleLayerfgwmst - Schaltet die Sichtbarkeit der FGW-Messstellen-Ebene um.
 * @method toggleLayerVerbreitung - Schaltet die Sichtbarkeit der Verbreitung-Ebene um.
 * @method verbreitungsdaten - Ruft die Verbreitungsdaten von Arten ab.
 * @method initializeMap - Initialisiert die Karte mit der angegebenen WMTS-Ebene.
 * @method ngOnInit - Lifecycle-Hook, der aufgerufen wird, nachdem die Komponente initialisiert wurde.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
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
   
    private activeBpPieLayer: VectorLayer | null = null;
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
  iskartButton:boolean=false;
  isverbreitung:boolean=false;
  isbwmstButton:boolean=false;
  ismstButton:boolean=false;
  isstartbp3Checked:boolean=false;
  isstartbp2Checked:boolean=false;
  isstartbp1Checked:boolean=false;
  isSeeChecked: boolean = false;
  isrepraesentFGWChecked: boolean = false;
  isrepraesentSeeChecked: boolean = false;
  isVerbreitungChecked: boolean = false;
  isErsterBPChecked: boolean = false;  // Variable für den Checkbox-Status
  isZweiterBPChecked: boolean = false;  // Variable für den Checkbox-Status
  isDritterBPChecked: boolean = false;  // Variable für den Checkbox-Status
  isVierterBPChecked: boolean = false;  // Variable für den Checkbox-Status
  pieChartLayer: VectorLayer | null = null;
  isRepraesentCheckedSEEdisable: boolean = true;
  isRepraesentCheckedFGWdisable: boolean = true;
  isFilterdisable: boolean = true;
   legendItems = [
    { color: this.getColor('1'), label: 'sehr gut (1)' },
    { color: this.getColor('2'), label: 'gut (2)' },
    { color: this.getColor('3'), label: 'mäßig (3)' },
    { color: this.getColor('4'), label: 'unbefriedigend (4)' },
    { color: this.getColor('5'), label: 'schlecht (5)' },
    { color: '#FFC0CB', label: 'keine Daten' }
     
  ];

  private source_landesgrenze: VectorSource = new VectorSource({
    format: new GeoJSON(),
    url: (extent) => 
      `${this.geoserverUrl}/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aview_landesgrenze&outputFormat=application%2Fjson&srsname=EPSG:3857&bbox=${extent.join(',')},EPSG:3857`,
    strategy: bboxStrategy
  });
   private source_aus_daten_lw_bp2: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_lw_bp2&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_aus_daten_lw_bp3: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_lw_bp3&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_aus_daten_lw_bp4: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_lw_bp4&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_aus_daten_rw_bp2: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_rw_bp2&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_aus_daten_rw_bp3: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_rw_bp3&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_aus_daten_rw_bp4: VectorSource = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_rw_bp4&maxFeatures=250&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
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
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp3&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  //http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp1&maxFeatures=50&outputFormat=application%2Fjson
  private source_lw_bp2_with_pie = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp2&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  //http://localhost:8080/geoserver/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp1&maxFeatures=50&outputFormat=application%2Fjson
  private source_lw_bp1_with_pie = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp1&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  private source_lw_bp4_with_pie = new VectorSource({
    url: `${this.geoserverUrl}/WK/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=WK%3Aview_wk_bewertung_aus_mst_kreuz_bp4&maxFeatures=500&outputFormat=application%2Fjson`,
    format: new GeoJSON(),
  });
  /**
   * Lädt eine WMTS (Web Map Tile Service) Ebene asynchron.
   * 
   * Diese Methode ruft die WMTS-Fähigkeiten von der angegebenen URL ab, analysiert die Fähigkeiten
   * und erstellt eine TileLayer unter Verwendung der angegebenen Layer- und Matrix-Set-Optionen.
   * 
   * @returns {Promise<TileLayer>} Ein Promise, das zu einer TileLayer konfiguriert mit den WMTS-Optionen aufgelöst wird.
   * 
   * @throws {Error} Wenn ein Problem beim Abrufen oder Analysieren der WMTS-Fähigkeiten auftritt.
   */
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
    /**
     * Öffnet einen Dialog zur Auswahl der Verbreitung von Arten.
     * 
     * Diese Methode führt die folgenden Aktionen aus:
     * 1. Entfernt den `VerbreitungMessstellenLayer` von der Karte.
     * 2. Fügt den `VerbreitungMessstellenLayer` wieder zur Karte hinzu.
     * 3. Öffnet einen Dialog (`MapVBSelectionDialogComponent`) mit einer Breite von 600px und übergibt die folgenden Daten:
     *    - `idkomp`: Die Komponenten-ID.
     *    - `dbKomponenten`: Die Datenbankkomponenten.
     *    - `taxon`: Das Taxon.
     * 
     * Nachdem der Dialog geschlossen wurde, führt er die folgenden Aktionen aus:
     * 1. Entfernt den `VerbreitungMessstellenLayer` von der Karte.
     * 2. Löscht den `verbreitung_text`.
     * 3. Wenn ein Ergebnis aus dem Dialog zurückgegeben wird:
     *    - Aktualisiert die Komponenten-ID (`id_komponente`) mit der ausgewählten ID.
     *    - Protokolliert das ausgewählte Taxon in der Konsole.
     *    - Konstruiert einen Textstring, der das Vorkommen des ausgewählten Taxons und den Abfragezeitraum angibt.
     *    - Filtert die Artendaten (`dbArten`) basierend auf dem ausgewählten Taxon und Abfragezeitraum.
     *    - Filtert doppelte Messstellen-IDs heraus und speichert sie in `ids_mst`.
     *    - Ruft `filterVerbreitungMessstellenLayer` mit den gefilterten Messstellen-IDs auf.
     */
    openDialogVerbreitung(): void {
      this.isverbreitung=true;
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
        this.isverbreitung=false;
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
  /**
   * Filtert die Features einer gegebenen Vektorquelle basierend auf einem angegebenen Filterstring und einem Repräsentations-Flag,
   * und aktualisiert die bereitgestellte Vektorebene mit den gefilterten Features.
   *
   * @param {VectorSource} source - Die Vektorquelle, die die zu filternden Features enthält.
   * @param {VectorLayer} layer - Die Vektorebene, die mit den gefilterten Features aktualisiert werden soll.
   * @param {string} filter - Der Filterstring, der verwendet wird, um die 'namemst'-Eigenschaft der Features zu filtern.
   * @param {boolean} repreasent - Das Repräsentations-Flag, das verwendet wird, um die 'repraesent_mst'-Eigenschaft der Features zu filtern.
   */
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
  /**
   * Stellt die angegebene Ebene mit allen Features aus der bereitgestellten Quelle wieder her und fügt sie der Karte hinzu.
   *
   * @param source - Die Vektorquelle, die die anzuzeigenden Features enthält.
   * @param layer - Die Vektorebene, die wiederhergestellt und der Karte hinzugefügt werden soll.
   */
  
  showAllFeatures(source: VectorSource, layer: VectorLayer) {
    // Den Layer mit allen Features wiederherstellen
    layer.setSource(source);
    this.map.addLayer(layer);
  }
    /**
     * Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht einer Komponente vollständig initialisiert wurde.
     * Hier sollten Sie jeglichen Code platzieren, der mit der Ansicht der Komponente interagieren muss.
     * 
     * In dieser Methode registrieren wir Mouseover-Ereignisse für Elemente mit der Klasse 'helpable'
     * unter Verwendung des helpService.
     * 
     * @memberof MapComponent
     */
    ngAfterViewInit() {
	
      //	const elements = document.querySelectorAll('.helpable') as NodeListOf<HTMLElement>;
        this.helpService.registerMouseoverEvents();}
    /**
     * Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht der Komponente vom Angular-Änderungserkennungsmechanismus überprüft wurde.
     * Diese Methode wird verwendet, um Mouseover-Ereignisse mit dem helpService zu registrieren.
     * 
     * @memberof MapComponent
     */
    ngAfterViewChecked() {
          this.helpService.registerMouseoverEvents();
        }
    /**
     * Entfernt die Tortendiagramm-Ebene von der Karte, falls sie existiert.
     * Wenn die Tortendiagramm-Ebene vorhanden ist, wird sie von der Karte entfernt
     * und die Referenz auf die Tortendiagramm-Ebene wird auf null gesetzt.
     */
    removePieChartLayer() {
          if (this.pieChartLayer) {
            this.map.removeLayer(this.pieChartLayer);
            this.pieChartLayer = null;
          }
        }
    /**
     * Erstellt eine Tortendiagramm-Ebene und fügt sie der Karte hinzu.
     * 
     * Diese Funktion initialisiert eine neue `VectorLayer` für Tortendiagramme und eine `VectorLayer` für Messstellen.
     * Sie verwendet die bereitgestellte `VectorSource` oder eine neue, falls keine angegeben ist. Die Tortendiagramm-Ebene
     * wird so gestaltet, dass Tortendiagramme an den Koordinaten von Punkt-Features gerendert werden.
     * 
     * @param {VectorSource} [source_=new VectorSource()] - Die Vektorquelle für die Ebene. Standardmäßig wird eine neue `VectorSource` verwendet, falls keine angegeben ist.
     * 
     * @remarks
     * - Die Funktion verhindert mehrfaches Rendern durch Verwendung einer Flagge `hasBeenRendered`.
     * - Die Pixelposition des Diagramms wird mit `getPixelFromCoordinate` berechnet.
     * - Die Tortendiagramm-Daten werden aus den Eigenschaften des Features extrahiert und auf `chartData` gesetzt.
     * - Das Tortendiagramm wird mit einer benutzerdefinierten Renderer-Funktion gezeichnet.
     * 
     * @example
     * ```typescript
     * const source = new VectorSource();
     * createPieChartLayer(source);
     * ```
     */
    createPieChartLayer(source_ = new VectorSource()) {
         
        this.messstellenLayer=new VectorLayer({
            source: source_,
            style: this.mstDia,  
          });


          let hasBeenRendered = false;  // Flagge, um mehrfaches Rendern zu verhindern
        //DevicePixelRatio
          const ratio=DEVICE_PIXEL_RATIO;

                
          const resolution = this.map.getView().getResolution();
          this.pieChartLayer = new VectorLayer({
            source: source_,
            style: (feature: FeatureLike) => {
              const realFeature = feature as Feature<Geometry>;
              const geometry = realFeature.getGeometry() as Point;
        
              // Prüfe, ob die Geometrie existiert und vom Typ 'Point' ist
              if (geometry?.getType() === 'Point') {
                const coordinates = geometry.getCoordinates();  // Hole die X- und Y-Koordinaten des Punktes
        
                // Verwende getPixelFromCoordinate, um die Pixelposition des Diagramms exakt zu berechnen
                const pixel = this.map.getPixelFromCoordinate(coordinates);
                if (coordinates[0] >1500000) {

                  pixel[0]=pixel[0]//-50;
                  pixel[1]=pixel[1]//-5;
                }
               
               
                //console.log(`Pixelkoordinaten in ${navigator.userAgent}:`, pixel);
                const pixelX = pixel[0]*ratio//*0.995;
                const pixelY = pixel[1]*ratio//*0.995;
        
                if (!hasBeenRendered) {  // Prüfe, ob das Rendering schon stattgefunden hat
                  console.log(`Pixelposition des Diagramms: [${pixelX}, ${pixelY}] Koordinaten: [${coordinates[0]}, ${coordinates[1]}]`);
                  hasBeenRendered = true;  // Setze die Flagge, um mehrfache Logs zu verhindern
                }
        
                // Hole die Daten aus dem Feature
                const data = [
                  realFeature.get('ÖKZ_QK_MZB'),  // Daten aus den vier Feldern
                  realFeature.get('ÖKZ_QK_P'),
                  realFeature.get('ÖKZ_TK_Dia'),
                  realFeature.get('ÖKZ_TK_MP')
                ];
        
                realFeature.set('chartData', data);  // Setze die 'chartData'
        
                // Style für das Tortendiagramm (mit berechneten Pixelwerten)
                return new Style({
                  image: new CircleStyle({
                    radius: 20,  // Größe des Kreises
                    fill: new Fill({
                      color: '#ffffff',  // Hintergrundfarbe des Kreises
                    }),
                  }),
                  renderer: (geometry, state) => {
                    const ctx = state.context;  // Canvas Context
                    ctx.save();
        
                    const chartData = realFeature.get('chartData');
                    if (chartData) {
                      // Verwende die berechneten Pixelkoordinaten für das Zeichnen
                      this.drawQuarterPieChart(ctx, chartData, pixelX, pixelY);
                    }
        
                    ctx.restore();
                  },
                });
              }
        
              // Füge hier ein explizites `null` für den Fall ein, dass die Geometrie keine Punkt-Geometrie ist
              return null;
            },
          });
          this.activeBpPieLayer = this.pieChartLayer;

          
          // Füge den Layer zur Karte hinzu
          this.map.addLayer(this.pieChartLayer);
          this.map.addLayer(this.messstellenLayer);
        }
        
        
        
        /**
         * Zeichnet ein Viertel-Tortendiagramm auf einem gegebenen Canvas-Kontext.
         *
         * @param ctx - Der Canvas-Rendering-Kontext, auf dem das Tortendiagramm gezeichnet wird.
         * @param data - Ein Array von Strings, das die Daten für jedes Viertel-Segment darstellt.
         * @param x - Die x-Koordinate des Zentrums des Tortendiagramms.
         * @param y - Die y-Koordinate des Zentrums des Tortendiagramms.
         */
        drawQuarterPieChart(ctx: CanvasRenderingContext2D, data: string[], x: number, y: number) {
          const totalSlices = 4;  // Vier Segmente
          const radius = 15;  // Radius des Tortendiagramms
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
      
        
        
        
  // filtert die Messstellen durch die zuvor ausgewählten Arten und Untersuchungsjahre
  /**
   * Filtert die Features des VerbreitungMessstellenLayer basierend auf dem bereitgestellten ids_mst-Array.
   * 
   * @param ids_mst - Ein Array von Zahlen, das die ids_mst-Werte repräsentiert, nach denen die Features gefiltert werden sollen.
   * 
   * Diese Funktion führt die folgenden Schritte aus:
   * 1. Ruft alle Features von der sourceVerbreitungMessstellen ab.
   * 2. Filtert die Features basierend darauf, ob ihre 'id_mst'-Eigenschaft im ids_mst-Array enthalten ist.
   * 3. Erstellt eine neue VectorSource mit den gefilterten Features.
   * 4. Aktualisiert den VerbreitungMessstellenLayer mit der neuen gefilterten Quelle.
   * 5. Fügt den aktualisierten Layer zur Karte hinzu.
   */
  
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
  
  /**
   * Holt die Farbe, die dem angegebenen Wert zugeordnet ist.
   *
   * @param wert - Der Wert, für den die Farbe abgerufen werden soll.
   * @returns Die Farbe, die dem angegebenen Wert entspricht.
   */
  getColor(wert: string) {
    return this.Farbebewertg.getColor(wert);
  }
  mstDia = new Style({
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({color: 'grey'}),
      stroke: new Stroke({
        color: 'black',
        width: 1.5
      })
    })
  });
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
    '99': new Style({
      stroke: new Stroke({
        color: '#FFC0CB',
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
    '99': new Style({
      stroke: new Stroke({
        color: 'black',
        width: 1,
      }),
      fill: new Fill({
        color: '#FFC0CB',
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
  //Layer für die Messstellen mit Tortendiagrammen  
   messstellenLayer = new VectorLayer({
    source: this.source_lw_bp3_with_pie,
    style: this.mstDia,  
  });
  

 
  
  view_geo_aus_daten_lw_oezk_bp2 = new VectorLayer({
    source: this.source_aus_daten_lw_bp2,
    style: (feature) => this.seen[feature.get('OEZK')],
  });
  
  view_geo_aus_daten_lw_oezk_bp3 = new VectorLayer({
    source: this.source_aus_daten_lw_bp3,
    style: (feature) => this.seen[feature.get('OEZK')],
  });
  view_geo_aus_daten_lw_oezk_bp4 = new VectorLayer({
    source: this.source_aus_daten_lw_bp4,
    style: (feature) => this.seen[feature.get('OEZK')],
  });


  view_geo_aus_daten_rw_oezk_bp2 = new VectorLayer({
    source: this.source_aus_daten_rw_bp2,
    style: (feature) => this.fgw[feature.get('OEZK')],
  });
  view_geo_aus_daten_rw_oezk_bp3 = new VectorLayer({
    source: this.source_aus_daten_rw_bp3,
    style: (feature) => this.fgw[feature.get('OEZK')],
  });
  view_geo_aus_daten_rw_oezk_bp4 = new VectorLayer({
    source: this.source_aus_daten_rw_bp4,
    style: (feature) => this.fgw[feature.get('OEZK')],
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
  /**
   * Zeichnet ein Viertel-Tortendiagramm mit einer Legende auf einem gegebenen Canvas-Kontext.
   * 
   * @param ctx - Der Canvas-Rendering-Kontext, auf dem das Tortendiagramm gezeichnet wird.
   * @param data - Ein Array von Strings, das die Daten für jedes Viertel des Tortendiagramms darstellt.
   * @param labels - Ein Array von Strings, das die Beschriftungen für jedes Viertel des Tortendiagramms darstellt.
   * @param x - Die x-Koordinate des Zentrums des Tortendiagramms.
   * @param y - Die y-Koordinate des Zentrums des Tortendiagramms.
   */
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
      ctx.strokeStyle = '#4D4D4D';  // Dunkelgrau
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
      ctx.strokeStyle = '#4D4D4D';  // Dunkelgrau
      ctx.lineWidth = 1;
      ctx.stroke();
  
      // Beschriftung zeichnen
      ctx.font = '12px Arial';
      ctx.fillStyle = '#000000';  // Textfarbe
      ctx.textAlign = labelX > x ? 'left' : 'right';  // Textausrichtung je nach Seite
     
      if (labels[index] === 'Makrozoobenthos') {
        ctx.fillText('Makrozoo-', labelX, labelY);           // Erste Zeile
        ctx.fillText('benthos', labelX, labelY + 12);        // Zweite Zeile leicht nach unten versetzt
      } else {
        ctx.fillText(labels[index], labelX, labelY);         // Standardbeschriftung ohne Zeilenumbruch
      }
     
      // ctx.fillText(labels[index], labelX, labelY);
  
      startAngle += sliceAngle;  // Aktualisiere den Startwinkel
    });
  
     // Zeichne den zentralen Kreis mit dem Stil `mstDia`
  const circleStyle = this.mstDia.getImage() as CircleStyle;  // Cast zu CircleStyle
  ctx.beginPath();
  ctx.arc(x, y, circleStyle.getRadius(), 0, 2 * Math.PI);  // Zeichne den Kreis in die Mitte des Diagramms
  ctx.fillStyle = (circleStyle.getFill() as Fill).getColor() as string;
  ctx.fill();
  ctx.strokeStyle = (circleStyle.getStroke() as Stroke).getColor() as string;
  ctx.lineWidth = (circleStyle.getStroke() as Stroke).getWidth();
  ctx.stroke();

    // Zeichne die Linie im 12°-Winkel vom Kreis aus
  const angle = 2 * (Math.PI / 180);  // 45° in Radiant umrechnen
  const lineLength = 30;  // Länge der Linie
  const lineEndX = x + (circleStyle.getRadius() + lineLength) * Math.cos(angle);
  const lineEndY = y + (circleStyle.getRadius() + lineLength) * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(x, y);  // Start von der Mitte des Kreises
  ctx.lineTo(lineEndX, lineEndY);  // Linie im 12°-Winkel
  ctx.strokeStyle = '#4D4D4D';
  ctx.lineWidth = 1;
  ctx.stroke();

// Positioniere den Text "Messstelle" neben demDiagramm
const textXPosition = x + radius + 45; // Position leicht unterhalb des Diagramms
ctx.font = '12px Arial';
ctx.fillStyle = '#4D4D4D';  // Textfarbe
ctx.textAlign = 'center';  // Zentriere den Text horizontal
ctx.fillText('Messstelle', textXPosition, y);  // Platziere den Text mittig unterhalb des Kreises
  }
  
  /**
   * Schaltet die Sichtbarkeit bestimmter Kartenebenen basierend auf dem Zustand der bereitgestellten Checkbox um.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die Checkbox aktiviert ist.
   * 
   * Wenn `checked` wahr ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp3` und `view_geo_wk_oezk_bp2` von der Karte.
   * - Fügt die Ebene `view_geo_wk_oezk_bp1` zur Karte hinzu.
   * - Entfernt die Ebenen `view_geo_lw_oezk_bp3` und `view_geo_lw_oezk_bp2` von der Karte.
   * - Fügt die Ebene `view_geo_lw_oezk_bp1` zur Karte hinzu.
   * - Ruft die Methode `mstnachoben` auf.
   * - Setzt `isstartbp2Checked` und `isstartbp3Checked` auf false.
   * 
   * Wenn `checked` falsch ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp1` und `view_geo_lw_oezk_bp1` von der Karte.
   */
  startbp1(checked: boolean) {
    // this.getkartButtonAktivColor();
    if (checked){
      this.iskartButton=true;  
    this.map.removeLayer(this.view_geo_wk_oezk_bp3);
    this.map.removeLayer(this.view_geo_wk_oezk_bp2);
    this.map.addLayer(this.view_geo_wk_oezk_bp1);

    this.map.removeLayer(this.view_geo_lw_oezk_bp3);
    this.map.removeLayer(this.view_geo_lw_oezk_bp2);
    this.map.addLayer(this.view_geo_lw_oezk_bp1);
  
  
    this.mstnachoben();
    this.isstartbp2Checked=false;
    this.isstartbp3Checked=false;}else{
      this.iskartButton=false;
      this.map.removeLayer(this.view_geo_wk_oezk_bp1);
      this.map.removeLayer(this.view_geo_lw_oezk_bp1);
    }
    
  }

  /**
   * Schaltet die Sichtbarkeit bestimmter Kartenebenen basierend auf dem Zustand der bereitgestellten Checkbox um.
   * 
   * @param {boolean} checked - Der Zustand der Checkbox. Wenn true, werden bestimmte Ebenen hinzugefügt und andere entfernt. Wenn false, werden die hinzugefügten Ebenen entfernt.
   * 
   * Wenn `checked` wahr ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp3` und `view_geo_wk_oezk_bp1` von der Karte.
   * - Fügt die Ebene `view_geo_wk_oezk_bp2` zur Karte hinzu.
   * - Entfernt die Ebenen `view_geo_lw_oezk_bp3` und `view_geo_lw_oezk_bp1` von der Karte.
   * - Fügt die Ebene `view_geo_lw_oezk_bp2` zur Karte hinzu.
   * - Ruft die Methode `mstnachoben()` auf.
   * - Setzt `isstartbp3Checked` und `isstartbp1Checked` auf false.
   * 
   * Wenn `checked` falsch ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp2` und `view_geo_lw_oezk_bp2` von der Karte.
   */
  startbp2(checked: boolean) {
    if (checked){
      this.iskartButton=true;
     
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
      this.iskartButton=false;
    }
    // this.getkartButtonAktivColor();
  }

  /**
   * Schaltet die Sichtbarkeit bestimmter Kartenebenen basierend auf dem Zustand der bereitgestellten Checkbox um.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die Checkbox aktiviert ist.
   * 
   * Wenn `checked` wahr ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp2` und `view_geo_wk_oezk_bp1` von der Karte.
   * - Fügt die Ebene `view_geo_wk_oezk_bp3` zur Karte hinzu.
   * - Entfernt die Ebenen `view_geo_lw_oezk_bp2` und `view_geo_lw_oezk_bp1` von der Karte.
   * - Fügt die Ebene `view_geo_lw_oezk_bp3` zur Karte hinzu.
   * - Setzt `isstartbp2Checked` und `isstartbp1Checked` auf false.
   * - Ruft die Methode `mstnachoben` auf.
   * 
   * Wenn `checked` falsch ist:
   * - Entfernt die Ebenen `view_geo_wk_oezk_bp3` und `view_geo_lw_oezk_bp3` von der Karte.
   */
  startbp3(checked: boolean) {
    
   

    if (checked){
      this.iskartButton=true;
    this.map.removeLayer(this.view_geo_wk_oezk_bp2);
    this.map.removeLayer(this.view_geo_wk_oezk_bp1);
    this.map.addLayer(this.view_geo_wk_oezk_bp3);
    
    this.map.removeLayer(this.view_geo_lw_oezk_bp2);
    this.map.removeLayer(this.view_geo_lw_oezk_bp1);
    this.map.addLayer(this.view_geo_lw_oezk_bp3);
    
  this.isstartbp2Checked=false;
  this.isstartbp1Checked=false;
  this.mstnachoben();}else{
    this.iskartButton=false;
    this.map.removeLayer(this.view_geo_wk_oezk_bp3);
    this.map.removeLayer(this.view_geo_lw_oezk_bp3);
  }
  
  }

  

  /**
   * Schaltet die Sichtbarkeit einer einzelnen BP-Ebene auf der Karte um.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die Ebene angezeigt (true) oder ausgeblendet (false) werden soll.
   * @param sourceLayer - Die Vektorquellenebene, die für die Erstellung der Tortendiagramm-Ebene verwendet werden soll.
   * 
   * Wenn `checked` wahr ist:
   * - Entfernt die aktuell aktive BP-Tortendiagramm-Ebene und die Messstellen-Ebene von der Karte, falls sie existieren.
   * - Zeichnet die Legende.
   * - Erstellt und setzt die Tortendiagramm-Ebene unter Verwendung der bereitgestellten Vektorquellenebene.
   * 
   * Wenn `checked` falsch ist:
   * - Entfernt die Messstellen-Ebene von der Karte.
   * - Entfernt die Tortendiagramm-Ebene.
   * - Löscht die Legende.
   */
  
  private toggleSingleBpLayer(checked: boolean, sourceLayer: VectorSource) {
  
  if (checked) {
   
    if (this.activeBpPieLayer) {
      this.map.removeLayer(this.activeBpPieLayer);
      this.map.removeLayer(this.messstellenLayer);
      this.activeBpPieLayer = null;
    }
    this.drawLegend();
    this.createPieChartLayer(sourceLayer);
    this.activeBpPieLayer = this.pieChartLayer;

  } else {
    this.map.removeLayer(this.messstellenLayer);
    this.removePieChartLayer();
    this.activeBpPieLayer = null;
    this.clearLegend();
  }
  
}
/**
 * Zeichnet eine Legende auf einem Canvas-Element mit der ID 'legendCanvas'.
 * Löscht das Canvas, bevor ein Viertel-Tortendiagramm mit Legende gezeichnet wird.
 * Das Diagramm stellt vier Kategorien dar: Makrozoobenthos, Phytoplankton, Diatomeen und Makrophyten.
 * 
 * @private
 */
private drawLegend() {
  const legendCanvas = document.getElementById('legendCanvas') as HTMLCanvasElement;
  const ctx = legendCanvas.getContext('2d');
 
  if (ctx) {
    ctx?.clearRect(0, 0, legendCanvas.width, legendCanvas.height);
    const data = ['1', '2', '3', '4'];
    const labels = ['Makrozoobenthos', 'Phytoplankton', 'Diatomeen', 'Makrophyten'];
    this.drawQuarterPieChartWithLegend(ctx, data, labels, 110, 80);
  }
}

/**
 * Löscht den Inhalt des Legenden-Canvas.
 * Diese Methode ruft das Canvas-Element mit der ID 'legendCanvas' ab,
 * erhält dessen 2D-Rendering-Kontext und löscht den gesamten Canvas-Bereich.
 */
private clearLegend() {
  const legendCanvas = document.getElementById('legendCanvas') as HTMLCanvasElement;
  const ctx = legendCanvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, legendCanvas.width, legendCanvas.height);
  }
}


  // 
    /**
   * Behandelt den Auswahlzustand des ersten BP (ersterBP).
   * Methode, um den Layer mit den Tortendiagrammen hinzuzufügen oder zu entfernen

   * @param checked - Ein boolescher Wert, der angibt, ob der erste BP aktiviert ist.
   * 
   * Diese Methode aktualisiert den Zustand von `isErsterBPChecked` auf den Wert von `checked`,
   * und setzt `isZweiterBPChecked`, `isDritterBPChecked` und `isVierterBPChecked` auf false.
   * Sie schaltet auch die Sichtbarkeit der einzelnen BP-Ebene um, die mit `source_lw_bp1_with_pie` verbunden ist.
   */
  ersterBP(checked: boolean) {
  
    this.isErsterBPChecked = checked;
    this.isZweiterBPChecked = false;
    this.isDritterBPChecked = false;
    this.isVierterBPChecked = false;
    this.toggleSingleBpLayer(checked, this.source_lw_bp1_with_pie);
    if (checked){this.isbwmstButton=true;}else{ this.isbwmstButton=false;}
  }
  /**
   * Behandelt die Auswahl der zweiten BP (BP2) Ebene auf der Karte.
   * 
   * Diese Methode setzt die Namen für die `view_geo_aus_daten_lw_oezk_bp2` und 
   * `view_geo_aus_daten_rw_oezk_bp2` Ebenen, entfernt alle BP-Ebenen und fügt 
   * dann bedingt die BP2-Ebenen zur Karte hinzu, wenn `checked` wahr ist. 
   * Sie aktualisiert auch den Zustand der BP-Checkboxen.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die BP2-Ebene zur Karte 
   *                  hinzugefügt werden soll.
   */
  zweiterBP(checked: boolean) {
    this.view_geo_aus_daten_lw_oezk_bp2.set('name', 'view_geo_aus_daten_lw_oezk_bp2');
    this.view_geo_aus_daten_rw_oezk_bp2.set('name', 'view_geo_aus_daten_rw_oezk_bp2');
    this.removeallbp();
   
    
    if (checked){this.map.addLayer(this.view_geo_aus_daten_lw_oezk_bp2);
    this.map.addLayer(this.view_geo_aus_daten_rw_oezk_bp2);this.isbwmstButton=true;}else{ this.isbwmstButton=false;}
    this.isErsterBPChecked = false;
    this.isZweiterBPChecked = checked;
    this.isDritterBPChecked = false;
    this.isVierterBPChecked = false;
    //this.map.addLayer(this.view_geo_wk_oezk_bp3);
    this.toggleSingleBpLayer(checked, this.source_lw_bp2_with_pie);
  }
  /**
   * Entfernt alle angegebenen Ebenen von der Karte.
   * 
   * Diese Methode entfernt die folgenden Ebenen:
   * - `view_geo_aus_daten_rw_oezk_bp2`
   * - `view_geo_aus_daten_lw_oezk_bp2`
   * - `view_geo_aus_daten_rw_oezk_bp3`
   * - `view_geo_aus_daten_lw_oezk_bp3`
   * - `view_geo_aus_daten_rw_oezk_bp4`
   * - `view_geo_aus_daten_lw_oezk_bp4`
   */
  removeallbp(){
    this.map.removeLayer(this.view_geo_aus_daten_rw_oezk_bp2);
    this.map.removeLayer(this.view_geo_aus_daten_lw_oezk_bp2);
    this.map.removeLayer(this.view_geo_aus_daten_rw_oezk_bp3);
    this.map.removeLayer(this.view_geo_aus_daten_lw_oezk_bp3);
    this.map.removeLayer(this.view_geo_aus_daten_rw_oezk_bp4);
    this.map.removeLayer(this.view_geo_aus_daten_lw_oezk_bp4);
  }
  /**
   * Schaltet die Sichtbarkeit der dritten BP-Ebene auf der Karte um.
   * 
   * Diese Methode setzt die Namen für die dritten BP-Ebenen, entfernt alle BP-Ebenen,
   * und fügt dann die dritten BP-Ebenen zur Karte hinzu, wenn der `checked` Parameter wahr ist.
   * Sie aktualisiert auch den Zustand der BP-Checkboxen und schaltet die einzelne BP-Ebene um.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die dritte BP-Ebene sichtbar sein soll.
   */
  dritterBP(checked: boolean) {
    this.view_geo_aus_daten_lw_oezk_bp3.set('name', 'view_geo_aus_daten_lw_oezk_bp3');
    this.view_geo_aus_daten_rw_oezk_bp3.set('name', 'view_geo_aus_daten_rw_oezk_bp3');
    this.removeallbp();
    if (checked){this.map.addLayer(this.view_geo_aus_daten_lw_oezk_bp3);
      this.map.addLayer(this.view_geo_aus_daten_rw_oezk_bp3);this.isbwmstButton=true;}else{ this.isbwmstButton=false;}

    this.isErsterBPChecked = false;
    this.isZweiterBPChecked = false;
    this.isDritterBPChecked = checked;
    this.isVierterBPChecked = false;
    this.toggleSingleBpLayer(checked, this.source_lw_bp3_with_pie);
  }
  
  /**
   * Behandelt die Auswahl und Anzeige der vierten BP-Ebene auf der Karte.
   * 
   * Diese Methode setzt die Namen für die `view_geo_aus_daten_lw_oezk_bp4` und 
   * `view_geo_aus_daten_rw_oezk_bp4` Ebenen, entfernt alle BP-Ebenen von der Karte, 
   * und fügt die vierten BP-Ebenen hinzu, wenn der `checked` Parameter wahr ist. 
   * Sie aktualisiert auch den Zustand der BP-Checkboxen und schaltet die Sichtbarkeit 
   * der `source_lw_bp4_with_pie` Ebene um.
   * 
   * @param checked - Ein boolescher Wert, der angibt, ob die vierte BP-Ebene angezeigt werden soll.
   */
  vierterBP(checked: boolean) {
    this.view_geo_aus_daten_lw_oezk_bp4.set('name', 'view_geo_aus_daten_lw_oezk_bp4');
    this.view_geo_aus_daten_rw_oezk_bp4.set('name', 'view_geo_aus_daten_rw_oezk_bp4');
    this.removeallbp();
    if (checked){this.map.addLayer(this.view_geo_aus_daten_lw_oezk_bp4);
      this.map.addLayer(this.view_geo_aus_daten_rw_oezk_bp4);
      this.isbwmstButton=true;}else{ this.isbwmstButton=false;}
    this.isErsterBPChecked = false;
    this.isZweiterBPChecked = false;
    this.isDritterBPChecked = false;
    this.isVierterBPChecked = checked;
    this.toggleSingleBpLayer(checked, this.source_lw_bp4_with_pie);
  }
/**
 * Aktualisiert die Kartenebenen, indem sie basierend auf dem überprüften Status entfernt und erneut hinzugefügt werden.
 * 
 * Wenn `isFliesgewasserChecked` wahr ist, wird die `fliesgewasserLayer` entfernt und dann erneut zur Karte hinzugefügt.
 * Wenn `isSeeChecked` wahr ist, wird die `seeLayer` entfernt und dann erneut zur Karte hinzugefügt.
 */

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

/**
 * Schaltet die Sichtbarkeit der 'seeLayer' auf der Karte basierend auf dem Zustand der bereitgestellten Checkbox um.
 * 
 * @param checked - Ein boolescher Wert, der angibt, ob die Checkbox aktiviert ist.
 * 
 * Wenn `checked` `false` ist:
 * - Entfernt die 'seeLayer' von der Karte.
 * - Setzt `isrepraesentSeeChecked` auf `false`.
 * - Deaktiviert die 'Repraesent'-Checkbox für 'SEE', indem `isRepraesentCheckedSEEdisable` auf `true` gesetzt wird.
 * - Wenn `isFliesgewasserChecked` ebenfalls `false` ist, wird der `messstellenFilter` gelöscht und der Filter deaktiviert, indem `isFilterdisable` auf `true` gesetzt wird.
 * 
 * Wenn `checked` `true` ist:
 * - Aktiviert den Filter, indem `isFilterdisable` auf `false` gesetzt wird.
 * - Aktiviert die 'Repraesent'-Checkbox für 'SEE', indem `isRepraesentCheckedSEEdisable` auf `false` gesetzt wird.
 * - Ruft `showAllFeatures` auf, um alle Features von `sourceSeeMessstellen` auf der 'seeLayer' anzuzeigen.
 */
startalleSee(checked: boolean) {
  this.map.removeLayer(this.seeLayer);
  if (!checked){this.isrepraesentSeeChecked=false;this.isRepraesentCheckedSEEdisable=true;
    if (this.isFliesgewasserChecked===false){
      this.messstellenFilter='';this.isFilterdisable=true;this.ismstButton=false;
  } else{this.ismstButton=true;}
  }
  if (checked) {this.isFilterdisable=false;
    this.isRepraesentCheckedSEEdisable=false;
  this.showAllFeatures(this.sourceSeeMessstellen, this.seeLayer);
  this.ismstButton=true;}
}
/**
 * Schaltet die Sichtbarkeit und Interaktivität der "Fliesgewasser"-Ebene auf der Karte um.
 * 
 * @param checked - Ein boolescher Wert, der angibt, ob die "Fliesgewasser"-Ebene angezeigt oder ausgeblendet werden soll.
 * 
 * Wenn `checked` `true` ist, wird die "Fliesgewasser"-Ebene zur Karte hinzugefügt und verwandte Filter und Steuerungen werden aktiviert.
 * Wenn `checked` `false` ist, wird die "Fliesgewasser"-Ebene von der Karte entfernt und verwandte Filter und Steuerungen werden deaktiviert.
 */
startalleFGW(checked: boolean) {
  this.map.removeLayer(this.fliesgewasserLayer);
  if (!checked){this.isrepraesentFGWChecked=false;
    this.isRepraesentCheckedFGWdisable=true;
    if (this.isSeeChecked===false){
      this.messstellenFilter='';this.isFilterdisable=true;this.ismstButton=false;
    } else{this.ismstButton=true;}
}
  if (checked) {
    this.ismstButton=true;
    this.isFilterdisable=false;
    this.isRepraesentCheckedFGWdisable=false;
  this.showAllFeatures(this.sourceFliesgewasserMessstellen, this.fliesgewasserLayer);
  }
}
/**
 * Filtert die Messstellen basierend auf den angegebenen Kriterien.
 *
 * @param fgwchecked - Gibt an, ob die FGW-Messstellen einbezogen werden sollen.
 * @param seechecked - Gibt an, ob die SEE-Messstellen einbezogen werden sollen.
 * @param repraesent_mst_fgw - Gibt an, ob die repräsentativen FGW-Messstellen einbezogen werden sollen.
 * @param repraesent_mst_see - Gibt an, ob die repräsentativen SEE-Messstellen einbezogen werden sollen.
 */
filterMessstellen(fgwchecked: boolean,seechecked: boolean,repraesent_mst_fgw: boolean,repraesent_mst_see: boolean) {
 
  this.toggleLayerseemst(seechecked,repraesent_mst_see);
  this.toggleLayerfgwmst(fgwchecked,repraesent_mst_fgw);
}
/**
 * Schaltet die Sichtbarkeit der seeLayer auf der Karte basierend auf den bereitgestellten Parametern um.
 * 
 * @param checked - Ein boolescher Wert, der angibt, ob die Ebene angezeigt werden soll.
 * @param repraesent_mst - Ein boolescher Wert, der angibt, ob der Messstellenfilter angewendet werden soll.
 * 
 * Wenn `checked` wahr ist, wendet die Methode einen Filter auf die seeLayer unter Verwendung des messstellenFilter an.
 * Andernfalls entfernt sie die seeLayer von der Karte.
 */
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


/**
 * Schaltet die Sichtbarkeit der 'fliesgewasserLayer' auf der Karte basierend auf den bereitgestellten Parametern um.
 * 
 * @param checked - Ein boolescher Wert, der angibt, ob die Ebene angezeigt werden soll.
 * @param repraesent_mst - Ein boolescher Wert, der angibt, ob der Messstellenfilter angewendet werden soll.
 */
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
  /**
   * Schaltet die Sichtbarkeit des VerbreitungMessstellenLayer auf der Karte um.
   *
   * @param checked - Ein boolescher Wert, der angibt, ob die Ebene hinzugefügt (true) oder entfernt (false) werden soll.
   */
  toggleLayerVerbreitung(checked: boolean) {
    if (checked) {
      this.map.addLayer(this.VerbreitungMessstellenLayer);
     
        }else{

          this.map.removeLayer(this.VerbreitungMessstellenLayer);
        }
  }
  /**
   * Ruft Daten vom `verbreitungartenService` ab und weist sie zu.
   * 
   * Diese Methode ruft die Funktion `callKomponenten` vom `verbreitungartenService` auf
   * und weist die resultierenden Daten der Eigenschaft `dbKomponenten` zu.
   */
  verbreitungsdaten(){
   
    //this.verbreitungartenService.callArten();
this.verbreitungartenService.callKomponenten();

//this.allTaxons=this.verbreitungartenService.dbArtenListe;
this.dbKomponenten = this.verbreitungartenService.dbKomponenten;
  }


  /**
   * Initialisiert die Karte mit dem angegebenen WMTS-Layer und richtet verschiedene Kartenkonfigurationen,
   * Stile und Ereignishandler ein.
   *
   * @param {TileLayer} wmtsLayer - Der WMTS-Layer, der als Basis-Layer der Karte hinzugefügt wird.
   *
   * Diese Funktion führt die folgenden Aufgaben aus:
   * - Ruft die Methode `verbreitungsdaten` auf.
   * - Richtet die Kartenansicht mit einem angegebenen Zentrum und Zoom-Level ein.
   * - Definiert einen Stil ohne Füllung für den landesgrenze-Layer.
   * - Erstellt und fügt den landesgrenze-Layer zur Karte hinzu.
   * - Initialisiert die Karte mit dem angegebenen Ziel, den Steuerungen, Layern und der Ansicht.
   * - Fügt ein Popup-Overlay zur Karte hinzu.
   * - Richtet einen Ereignishandler für Zeigerbewegungen ein, um Features hervorzuheben und
   *   Informationen in einem Popup anzuzeigen.
   *
   * Der Ereignishandler für Zeigerbewegungen:
   * - Setzt den Stil zuvor ausgewählter Features zurück.
   * - Hebt das Feature unter dem Zeiger mit einem bestimmten Stil hervor.
   * - Zeigt Informationen über das ausgewählte Feature in einem Popup an.
   * - Bestimmt den Untersuchungszeitraum basierend auf dem Layer-Namen.
   * - Zeigt den ökologischen Zustand und andere relevante Informationen in einem Tabellenformat an.
   */
  private initializeMap(wmtsLayer: TileLayer): void {

    this. verbreitungsdaten();
    const status = document.getElementById('status');
    const view = new View({
      center: fromLonLat([13.413215, 52.521918]), // Wähle das passende Zentrum
      // center: [0, 0],
      projection: 'EPSG:3857',
      zoom: 2,
    });

// Stil ohne Füllung (nur Umrandung)
const styleWithoutFill = new Style({
  stroke: new Stroke({
    color: '#800080', // Rosa Umrandung
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
      controls: defaultControls({ rotate: false }),
           layers: [
        wmtsLayer,  // WMTS-Layer Basemap
        landesgrenzeLayer// new TileLayer({
        //   source: this.source_landesgrenze,  //  WMS-Layer der Landesgrenze
        // }),
      ],
      view: new View({
        center: [1512406.33, 6880500.21], // Beispiel-Zentrum, bitte anpassen
        enableRotation: false,   // Deaktiviert die Möglichkeit, die Karte zu drehen
        rotation: 0,              // Setzt die Drehung auf 0 (Standardausrichtung)
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
    let activeLayer = null; // Variable, um den aktiven Layer zu speichern
    this.map.on('pointermove', function (e) {
      if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
        activeLayer = null; // Setze den aktiven Layer zurück
      }

      this.forEachFeatureAtPixel(e.pixel, function (f, layer) {

        if (layer === landesgrenzeLayer) {
          return false; // Beende die Verarbeitung für Landesgrenzen-Features
        }
        selected = f;
        activeLayer = layer; // Speichere den aktiven Layer
        selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
        f.setStyle(selectStyle);
        return true;
      });
      container.innerHTML = '';
      if (selected) {
        const layerName = activeLayer ? activeLayer.get('name') : 'Unbekannt';
        let wkName = selected.get('wk_name');
        let jahr = selected.get('jahr');
        let oekz = selected.get('Ökz');
        let namemst = selected.get('namemst');
        let zeitraum = '';
         // Logik zur Bestimmung des Zeitraums
    if (layerName!==undefined) {if (layerName.endsWith('4')) {
      
      zeitraum = '2021-2026';
    } else if (layerName.endsWith('3')) {
      zeitraum = '2015-2020';
    } else if (layerName.endsWith('2')) {
      zeitraum = '2005-2014';
    } else {
      zeitraum = 'Unbekannter Zeitraum';
    }}
          if(oekz!==undefined && jahr!==undefined){
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
            '</td></tr></table/';}
         else if (namemst!==undefined) {
          container.innerHTML =
            namemst
           
        }else if (wkName!==undefined) {
          container.innerHTML =
          wkName + '; Untersuchungszeitraum: ' + zeitraum;
           
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




  /**
   * Lifecycle-Hook, der aufgerufen wird, nachdem Angular alle datengebundenen Eigenschaften einer Direktive initialisiert hat.
   * Diese Methode führt die folgenden Aktionen aus:
   * 1. Überprüft, ob der Benutzer mit dem AuthService eingeloggt ist. Wenn nicht, wird zur Login-Seite navigiert.
   * 2. Lädt asynchron einen WMTS-Layer und initialisiert die Karte mit dem geladenen Layer.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
   
      
    } 
    // Stelle sicher, dass OpenLayers mit geografischen Koordinaten (EPSG:4326) arbeitet
   // useGeographic();
    this.loadWmtsLayer().then(wmtsLayer => {
      this.initializeMap(wmtsLayer);
    }).catch(error => {
      console.error('Error loading WMTS layer:', error);
    });

  
  
  }
  // getkartButtonAktivColor() {
    
  //   const kartButton = document.getElementById('kartButton');
  //   this._renderer2.setStyle(kartButton, 'background-color', 'rgb(20,220,220)'); 
  //   const bwmstButton = document.getElementById('berichtsEUButton');
  //   this._renderer2.removeStyle(bwmstButton,'background-color');  
  //   const mstButton = document.getElementById('mpButton');
  //   this._renderer2.removeStyle(mstButton, 'background-color'); 
  //   const verbreitung = document.getElementById('mzButton');
  //   this._renderer2.removeStyle(verbreitung, 'background-color');  

  // }
}