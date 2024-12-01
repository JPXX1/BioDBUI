import { Component, OnInit } from '@angular/core';
import { WikiService,WikiEntry } from 'src/app/shared/services/wiki-service';


@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css']
})
/**
 * @class WikiComponent
 * @implements OnInit
 * @description Diese Komponente ist verantwortlich für die Anzeige und Verwaltung von Wiki-Einträgen.
 * Sie ruft die Wiki-Einträge vom WikiService ab, gruppiert sie nach ihrem ersten Header
 * und ermöglicht dem Benutzer, eine bestimmte Gruppe von Einträgen auszuwählen.
 *
 * @property {WikiEntry[]} wikiEntries - Ein Array von Wiki-Einträgen, die vom Service abgerufen werden.
 * @property {{ [header1: string]: { header2: string; body: string }[] }} groupedEntries - Ein Objekt, das Wiki-Einträge nach ihrem ersten Header gruppiert.
 * @property {string | null} selectedHeader1 - Der aktuell ausgewählte erste Header.
 *
 * @constructor
 * @param {WikiService} wikiService - Der Service, der zum Abrufen der Wiki-Einträge verwendet wird.
 *
 * @method getGroupedKeys
 * @returns {string[]} - Gibt ein Array von Schlüsseln zurück, die die gruppierten Einträge darstellen.
 *
 * @method ngOnInit
 * @description Lifecycle-Hook, der aufgerufen wird, nachdem die Ansicht der Komponente initialisiert wurde.
 * Er ruft die Wiki-Einträge ab und gruppiert sie nach ihrem ersten Header.
 * 
 * @method selectHeader1
 * @param {string} header1 - Der erste Header, der ausgewählt werden soll.
 * @description Setzt den ausgewählten ersten Header.
 */
export class WikiComponent implements OnInit {
  wikiEntries: WikiEntry[] = [];
  groupedEntries: { [header1: string]: { header2: string; body: string }[] } = {};
  selectedHeader1: string | null = null;

  constructor(private wikiService: WikiService) {}
  getGroupedKeys(): string[] {
    return Object.keys(this.groupedEntries);
  }
  ngOnInit(): void {
    // Aufruf der Methode mit ()
    this.wikiService.getWikiEntries().subscribe((data) => {
      this.wikiEntries = data;

      // Gruppiere die Einträge
      this.groupedEntries = this.wikiEntries.reduce((acc, entry) => {
        if (!acc[entry.header1]) {
          acc[entry.header1] = [];
        }
        acc[entry.header1].push({ header2: entry.header2, body: entry.body });
        return acc;
      }, {} as { [header1: string]: { header2: string; body: string }[] });
    });
  }

  selectHeader1(header1: string): void {
    this.selectedHeader1 = header1;
  }
}