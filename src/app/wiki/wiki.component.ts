import { Component, OnInit } from '@angular/core';
import { WikiService,WikiEntry } from 'src/app/shared/services/wiki-service';


/**
 * @description Component zur Anzeige von Wiki-Einträgen.
 * @author Dr. Jens Päzolt, UmweltSoft
 * @date 20-10-2024
 * @export
 * @class WikiComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css']
})
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